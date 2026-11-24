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

function DotGrid({
  className,
  dotSize = 2,
  gap = 18,
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
    const mouse = { x: -9999, y: -9999 }
    let shock: { x: number; y: number; r: number; life: number } | null = null
    const build = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          dots.push({ x, y, ox: x, oy: y })
        }
      }
    }
    const frame = () => {
      ctx.clearRect(0, 0, width, height)
      if (shock) {
        shock.r += shockStrength * 3.2
        shock.life -= 0.012
        if (shock.life <= 0) shock = null
      }
      for (const dot of dots) {
        let tx = dot.ox
        let ty = dot.oy
        let active = false
        const dx = dot.ox - mouse.x
        const dy = dot.oy - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < proximity && dist > 0.01) {
          const force = (1 - dist / proximity) ** 2
          tx += (dx / dist) * force * 24
          ty += (dy / dist) * force * 24
          active = true
        }
        if (shock) {
          const sdx = dot.ox - shock.x
          const sdy = dot.oy - shock.y
          const sdist = Math.hypot(sdx, sdy)
          if (sdist > 0.01 && Math.abs(sdist - shock.r) < 40) {
            const force = (1 - Math.abs(sdist - shock.r) / 40) * shock.life
            tx += (sdx / sdist) * force * 18
            ty += (sdy / sdist) * force * 18
            active = true
          }
        }
        dot.x += (tx - dot.x) * 0.18
        dot.y += (ty - dot.y) * 0.18
        const moved = Math.abs(dot.x - dot.ox) + Math.abs(dot.y - dot.oy) > 1
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, moved ? dotSize * 1.15 : dotSize / 2, 0, Math.PI * 2)
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
    build()
    frame()
    window.addEventListener('resize', build)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', build)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [gap, dotSize, baseColor, activeColor, proximity, shockRadius, shockStrength])
  return <canvas ref={canvasRef} className={className} aria-hidden />
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
    <section className='relative overflow-hidden pt-16 sm:pt-24'>
      {/* 背景：漂移光斑 + 透视网格地面 */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='ll-drift absolute -top-40 -left-40 size-[520px] rounded-full bg-[#4F8BFF]/25 blur-[120px] dark:bg-[#3D5BFF]/30' />
        <div className='ll-drift-rev absolute top-10 -right-32 size-[460px] rounded-full bg-[#8B6CFF]/20 blur-[120px] dark:bg-[#7C5CFF]/30' />
        <div className='ll-drift absolute top-[420px] left-1/2 h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-[#FF9AB0]/15 blur-[120px] dark:bg-[#C05CFF]/15' />
        <div className='absolute inset-x-0 bottom-0 h-[560px] [mask-image:linear-gradient(to_top,black_10%,transparent_85%)] [perspective:600px]'>
          <div className='ll-grid-floor absolute inset-x-[-50%] bottom-[-10%] h-[200%] origin-bottom bg-[linear-gradient(to_right,rgba(71,92,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,92,255,0.18)_1px,transparent_1px)] bg-[size:56px_56px] [transform:rotateX(68deg)] dark:bg-[linear-gradient(to_right,rgba(139,123,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,123,255,0.22)_1px,transparent_1px)]' />
        </div>
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
