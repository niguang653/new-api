/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    mountFluid?: (options?: FluidMountOptions) => FluidInstance
  }
}

interface FluidMountOptions {
  container?: HTMLElement
  hostStyle?: string
  SIM_RESOLUTION?: number
  DYE_RESOLUTION?: number
  DENSITY_DISSIPATION?: number
  VELOCITY_DISSIPATION?: number
  PRESSURE?: number
  PRESSURE_ITERATIONS?: number
  CURL?: number
  SPLAT_RADIUS?: number
  SPLAT_FORCE?: number
  SHADING?: boolean
  COLOR_UPDATE_SPEED?: number
  HUE_RANGE?: [number, number]
}

interface FluidInstance {
  host: HTMLElement
  canvas: HTMLCanvasElement
  destroy: () => void
  start: () => void
  stop: () => void
}

/** 设备分档：high (桌面/高内存) / low (移动/低端) */
function detectDeviceTier(): 'high' | 'low' {
  const ua = navigator.userAgent
  const mobile = /Mobi|Android/i.test(ua)
  const cores = navigator.hardwareConcurrency || 4
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  if (mobile) return 'low'
  if (cores <= 4 || mem <= 4) return 'low'
  return 'high'
}

function tierToOptions(tier: 'high' | 'low'): FluidMountOptions {
  if (tier === 'low') {
    return {
      SIM_RESOLUTION: 64,
      DYE_RESOLUTION: 512,
      PRESSURE_ITERATIONS: 10,
      SPLAT_FORCE: 4000,
    }
  }
  return {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    PRESSURE_ITERATIONS: 20,
    SPLAT_FORCE: 6000,
  }
}

// NOTE: FPS 自适应（§3.3）需要在 fluid-hero.js 内部 raf 循环里采样 frameMs。
// 当前 React 层面只做设备分档 + visibility/scroll 暂停，运行时 FPS 降档为后续迭代项。

/**
 * 全屏 WebGL 流体鼠标拖尾（SplashCursor）。
 * 脚本位于 /fluid-hero.js，按需注入一次；无 WebGL2 或用户偏好减弱动效时跳过。
 */
export function FluidOverlay() {
  const instanceRef = useRef<FluidInstance | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const probe = document.createElement('canvas')
    if (!probe.getContext('webgl2')) return

    let currentTier = detectDeviceTier()

    const mount = () => {
      if (instanceRef.current || typeof window.mountFluid !== 'function') return
      const baseOptions: FluidMountOptions = {
        hostStyle:
          'position:fixed;inset:0;z-index:50;pointer-events:none;overflow:hidden;will-change:transform;transform:translateZ(0);contain:layout style paint;',
        DENSITY_DISSIPATION: 4.2,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.1,
        CURL: 3,
        SPLAT_RADIUS: 0.2,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        HUE_RANGE: [0.58, 0.82],
        ...tierToOptions(currentTier),
      }
      instanceRef.current = window.mountFluid(baseOptions)
    }

    if (typeof window.mountFluid === 'function') {
      mount()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-fluid-hero]'
      )
      if (existing) {
        existing.addEventListener('load', mount, { once: true })
      } else {
        const script = document.createElement('script')
        script.src = '/fluid-hero.js'
        script.async = true
        script.dataset.fluidHero = 'true'
        script.addEventListener('load', mount, { once: true })
        document.head.appendChild(script)
      }
    }

    // visibilitychange → pause/resume
    const onVis = () => {
      const inst = instanceRef.current
      if (!inst) return
      if (document.hidden) {
        try { inst.stop() } catch { /* ignore */ }
      } else {
        try { inst.start?.() } catch { /* ignore */ }
      }
    }
    document.addEventListener('visibilitychange', onVis)

    // scroll pause
    let scrollTimer: number | undefined
    const onScroll = () => {
      const inst = instanceRef.current
      if (!inst) return
      try { inst.stop() } catch { /* ignore */ }
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        if (!document.hidden) try { inst.start?.() } catch { /* ignore */ }
      }, 250)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(scrollTimer)
      try {
        instanceRef.current?.destroy()
      } catch {
        /* ignore */
      }
      instanceRef.current = null
    }
  }, [])

  return null
}
