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
import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/context/theme-provider'
import { Terminal } from './Terminal'
import { Stats } from '../Stats'

/** 打字机：逐字揭示 i18n 文案 */
function useTypewriter(text: string, enabled: boolean, speed = 42) {
  const [shown, setShown] = useState(enabled ? '' : text)
  useEffect(() => {
    if (!enabled) {
      setShown(text)
      return
    }
    setShown('')
    const start = performance.now()
    const timer = window.setInterval(() => {
      const count = Math.min(
        text.length,
        Math.floor((performance.now() - start) / speed)
      )
      setShown(text.slice(0, count))
      if (count >= text.length) window.clearInterval(timer)
    }, 25)
    return () => window.clearInterval(timer)
  }, [text, enabled, speed])
  return shown
}

interface Dot {
  x: number
  y: number
  ox: number
  oy: number
}

/** 空间哈希桶：把 N 个 dot 按坐标入桶，邻域查询 O(1) 平均 */
function buildSpatialHash(
  dots: Dot[],
  cellSize: number,
  cols: number
): Map<number, number[]> {
  const buckets = new Map<number, number[]>()
  for (let i = 0; i < dots.length; i++) {
    const c = Math.min(cols - 1, Math.max(0, Math.floor(dots[i].ox / cellSize)))
    const r = Math.max(0, Math.floor(dots[i].oy / cellSize))
    const key = r * cols + c
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = []
      buckets.set(key, bucket)
    }
    bucket.push(i)
  }
  return buckets
}

function DotGrid({
  className,
  dotSize = 2,
  gap: _gap = 18,
  baseColor,
  activeColor,
  proximity = 130,
  shockRadius = 250,
  shockStrength = 5,
}: {
  className?: string
  dotSize?: number
  gap?: number
  baseColor: string
  activeColor: string
  proximity?: number
  shockRadius?: number
  shockStrength?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let dots: Dot[] = []
    let width = 0
    let height = 0
    let raf = 0
    let paused = false
    const mouse = { x: -9999, y: -9999 }
    let shock: { x: number; y: number; r: number; life: number } | null = null

    // 动态粒子数：按视口宽度调 gap 保持密度一致
    const pickGap = () => {
      const w = window.innerWidth
      if (w >= 1440) return 36      // ~120 dots
      if (w >= 1024) return 42     // ~90 dots
      if (w >= 768) return 54      // ~60 dots
      return 68                    // ~40 dots
    }
    let curGap = pickGap()

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      curGap = pickGap()
      for (let x = curGap / 2; x < width; x += curGap) {
        for (let y = curGap / 2; y < height; y += curGap) {
          dots.push({ x, y, ox: x, oy: y })
        }
      }
    }
    const cellSize = Math.max(proximity, curGap * 3)
    const colsForHash = () => Math.max(1, Math.ceil(width / cellSize))

    const frame = () => {
      if (paused) return
      ctx.clearRect(0, 0, width, height)
      if (shock) {
        shock.r += shockStrength * 3.2
        shock.life -= 0.012
        if (shock.life <= 0) shock = null
      }

      // 空间哈希
      const colsH = colsForHash()
      const rowsH = Math.max(1, Math.ceil(height / cellSize))
      const buckets = buildSpatialHash(dots, cellSize, colsH)

      const mouseInRange =
        mouse.x > -9000 &&
        mouse.x < width + proximity &&
        mouse.y > -9000 &&
        mouse.y < height + proximity

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        let tx = dot.ox
        let ty = dot.oy
        let active = false

        if (mouseInRange) {
          const dc = Math.min(colsH - 1, Math.max(0, Math.floor(mouse.x / cellSize)))
          const dr = Math.max(0, Math.floor(mouse.y / cellSize))
          // 只查自身桶 + 邻 8 桶
          for (let r2 = dr - 1; r2 <= dr + 1; r2++) {
            if (r2 < 0 || r2 >= rowsH) continue
            for (let c2 = dc - 1; c2 <= dc + 1; c2++) {
              if (c2 < 0 || c2 >= colsH) continue
              const bucket = buckets.get(r2 * colsH + c2)
              if (!bucket) continue
              for (const j of bucket) {
                if (j !== i) continue
                const dx2 = dot.ox - mouse.x
                const dy2 = dot.oy - mouse.y
                const dist2 = dx2 * dx2 + dy2 * dy2
                const p2 = proximity * proximity
                if (dist2 < p2 && dist2 > 0.01) {
                  const dist = Math.sqrt(dist2)
                  const force = (1 - dist / proximity) ** 2
                  tx += (dx2 / dist) * force * 24
                  ty += (dy2 / dist) * force * 24
                  active = true
                }
                break
              }
            }
          }
        }

        // shock 冲击波（半径内距离平方比较，r2 仅用于范围预筛）
        if (shock) {
          const sdx = dot.ox - shock.x
          const sdy = dot.oy - shock.y
          const sdist2 = sdx * sdx + sdy * sdy
          const within = shockRadius * shockRadius
          if (sdist2 < within) {
            const sdist = Math.sqrt(sdist2)
            if (Math.abs(sdist - shock.r) < 40) {
              const force = (1 - Math.abs(sdist - shock.r) / 40) * shock.life
              tx += (sdx / sdist) * force * 18
              ty += (sdy / sdist) * force * 18
              active = true
            }
          }
        }

        dot.x += (tx - dot.x) * 0.18
        dot.y += (ty - dot.y) * 0.18
        const moved = Math.abs(dot.x - dot.ox) + Math.abs(dot.y - dot.oy) > 1
        ctx.beginPath()
        ctx.arc(
          dot.x,
          dot.y,
          moved ? dotSize * 1.15 : dotSize / 2,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = active || moved ? activeColor : baseColor
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }
    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      shock = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        r: 0,
        life: 1,
      }
    }
    const onVisChange = () => {
      paused = document.hidden
      if (!paused && !raf) raf = requestAnimationFrame(frame)
      if (paused && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    // Scroll pause
    let scrollTimer: number | undefined
    const onScroll = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        if (!document.hidden) raf = requestAnimationFrame(frame)
      }, 250)
    }
    build()
    frame()
    window.addEventListener('resize', build)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVisChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVisChange)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(scrollTimer)
    }
    // Note: intentionally only depends on stable handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    />
  )
}

/** 模型名微强调：GPT / Claude / Gemini / DeepSeek */
function BrandedDescription({ text }: { text: string }) {
  const brands = ['GPT', 'Claude', 'Gemini', 'DeepSeek']
  const re = new RegExp(`(${brands.join('|')})`, 'g')
  const parts = text.split(re)
  return (
    <p className='mx-auto mt-5 max-w-2xl text-base leading-relaxed text-center text-pretty text-gray-600 sm:text-lg dark:text-gray-300/90'>
      {parts.map((p) =>
        brands.includes(p) ? (
          <span
            key={`b-${p}`}
            className='font-medium text-[#475CFF] dark:text-[#93A1FF]'
          >
            {p}
          </span>
        ) : (
          <span key={`t-${p}`}>{p}</span>
        )
      )}
    </p>
  )
}

export function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const typedTitle = useTypewriter(t('home.banner.title'), !reduced)
  const title = t('home.banner.title')

  return (
    <section className='relative overflow-x-clip overflow-y-hidden pt-16 contain-[layout_style_paint] sm:pt-24'>
      {/* 背景：漂移光斑 + 透视网格地面 — 合成层隔离 */}
      <div
        className='pointer-events-none absolute inset-0 z-0'
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {/* 光斑：radial-gradient + blur-24px，去 blur-3xl 重成本 */}
        <div
          className='ll-drift absolute -top-32 -left-32 size-[288px] rounded-full opacity-90 blur-[24px] dark:opacity-95'
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            background:
              'radial-gradient(circle, rgba(79,139,255,0.22) 0%, rgba(79,139,255,0.10) 40%, transparent 70%)',
          }}
        />
        <div
          className='ll-drift-rev absolute top-8 -right-24 size-[288px] rounded-full opacity-90 blur-[24px] dark:opacity-95'
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            background:
              'radial-gradient(circle, rgba(139,108,255,0.22) 0%, rgba(139,108,255,0.10) 40%, transparent 70%)',
          }}
        />
        <div
          className='ll-drift absolute top-[440px] left-1/2 -translate-x-1/2 size-[288px] rounded-full opacity-85 blur-[24px] dark:opacity-90'
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            background:
              'radial-gradient(circle, rgba(255,154,176,0.18) 0%, rgba(255,154,176,0.08) 40%, transparent 70%)',
          }}
        />
        {/* 透视网格地面 — 标准透视写法：同元素 perspective + rotateX + bottom center origin */}
        <div
          className='ll-grid-floor absolute left-1/2 bottom-0 h-[180%] w-[200vw] origin-bottom'
          style={{
            willChange: 'transform',
            transform:
              'translateX(-50%) translateZ(0) perspective(700px) rotateX(60deg)',
            transformOrigin: 'bottom center',
            maskImage:
              'linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 40%, transparent 80%)',
            WebkitMaskImage:
              'linear-gradient(to top, #000 0%, rgba(0,0,0,0.7) 40%, transparent 80%)',
            backgroundImage:
              'linear-gradient(to right, rgba(71,92,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,92,255,0.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px, 60px 60px',
          }}
        />
      </div>

      {/* 点阵（斥力 + 冲击波） */}
      <DotGrid
        className='pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,black,transparent)]'
        dotSize={2}
        gap={18}
        baseColor={isDark ? '#334155' : '#d6d9e6'}
        activeColor='#7C6BFF'
      />

      <div className='relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-7'>
        {/* Eyebrow — 英文全大写 + 宽字距 */}
        <p className='font-mono text-[11px] font-semibold tracking-[0.28em] uppercase text-[#475CFF] dark:text-[#8B97FF] sm:text-xs'>
          <span className='mr-3 inline-block h-px w-8 align-middle bg-[#475CFF]/40 dark:bg-[#8B97FF]/40 sm:w-12' />
          {t('home.banner.eyebrow')}
          <span className='ml-3 inline-block h-px w-8 align-middle bg-[#475CFF]/40 dark:bg-[#8B97FF]/40 sm:w-12' />
        </p>

        {/* 主标题 — 桌面端严格单行，响应式 clamp */}
        <h1
          aria-label={title}
          className='ll-shine-text mx-auto mt-4 max-w-5xl pb-2 text-center font-semibold tracking-tight text-balance sm:leading-[1.06]'
          style={{
            fontSize: 'clamp(1.75rem, 4.2vw, 3.75rem)',
            lineHeight: 1.1,
            whiteSpace: 'normal',
          }}
        >
          <span
            aria-hidden
            className='max-lg:block lg:whitespace-nowrap lg:text-[clamp(2.25rem,5.2vw,4.5rem)]'
          >
            {typedTitle}
            <span className='ll-caret ml-1 text-[#475CFF] dark:text-[#8B97FF]'>
              |
            </span>
          </span>
        </h1>

        {/* 副文案 — 两行，模型名微强调 */}
        <BrandedDescription text={t('home.banner.description')} />

        {/* 双 CTA */}
        <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <Link
            to={isAuthenticated ? '/dashboard' : '/sign-up'}
            className='ll-sheen group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#475CFF] px-6 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(71,92,255,0.75)] transition-colors hover:bg-[#3b50e8]'
          >
            <span className='relative'>
              {isAuthenticated
                ? t('Go to Dashboard')
                : t('home.banner.primaryCta')}
            </span>
            <svg
              className='relative size-4 transition-transform group-hover:translate-x-0.5'
              viewBox='0 0 20 20'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.75'
              aria-hidden
            >
              <path
                d='M4.5 10h11M11 5.5 15.5 10 11 14.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </Link>
          <Link
            to='/pricing'
            className='inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-300/90 bg-white/80 px-6 text-sm font-semibold text-gray-800 backdrop-blur-md transition-colors hover:border-gray-400 hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/25 dark:hover:bg-white/[0.08]'
          >
            <span>{t('home.banner.secondaryCta')}</span>
          </Link>
        </div>

        {/* 终端卡片（demo 1:1 复刻） */}
        <Terminal className='mt-10 w-full' />

        {/* 统计条 */}
        <div className='mt-14 w-full max-w-5xl pb-16 sm:mt-16 sm:pb-24'>
          <Stats />
        </div>
      </div>
    </section>
  )
}
