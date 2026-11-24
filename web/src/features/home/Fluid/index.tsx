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
}

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

    const mount = () => {
      if (instanceRef.current || typeof window.mountFluid !== 'function') return
      instanceRef.current = window.mountFluid({
        hostStyle:
          'position:fixed;inset:0;z-index:50;pointer-events:none;overflow:hidden;',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        DENSITY_DISSIPATION: 4.2,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        HUE_RANGE: [0.58, 0.82],
      })
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

    return () => {
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
