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
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface BrandLogo {
  src: string
  alt: string
}

const DEFAULT_LOGOS: BrandLogo[] = [
  { src: '/images/brands/br-1.svg', alt: 'Za' },
  { src: '/images/brands/br-2.svg', alt: 'Qwen' },
  { src: '/images/brands/br-3.svg', alt: 'Doubao' },
  { src: '/images/brands/br-4.svg', alt: 'Gemini' },
  { src: '/images/brands/br-5.svg', alt: 'Grok' },
  { src: '/images/brands/br-6.svg', alt: 'Z.ai' },
  { src: '/images/brands/br-7.svg', alt: 'KIMI' },
  { src: '/images/brands/br-8.svg', alt: 'MINIMAX' },
  { src: '/images/brands/br-10.svg', alt: 'OpenAI' },
  { src: '/images/brands/br-11.svg', alt: 'KwaiKAT' },
  { src: '/images/brands/br-12.svg', alt: 'Claude' },
]

/** 模型厂商 logo 无限走马灯：悬停暂停 */
export function BrandMarquee({
  logos = DEFAULT_LOGOS,
  speedSeconds = 30,
  className,
}: {
  logos?: BrandLogo[]
  speedSeconds?: number
  className?: string
}) {
  const { t } = useTranslation()
  const stripRef = useRef<HTMLDivElement>(null)
  const doubled = useMemo(
    () => [
      ...logos.map((logo) => ({ ...logo, copy: 0 })),
      ...logos.map((logo) => ({ ...logo, copy: 1 })),
    ],
    [logos]
  )

  const pause = () => {
    if (stripRef.current) stripRef.current.style.animationPlayState = 'paused'
  }
  const resume = () => {
    if (stripRef.current) stripRef.current.style.animationPlayState = 'running'
  }

  return (
    <section className={cn('relative py-8 sm:py-10', className)}>
      <div className='mx-auto max-w-[120rem] px-5 sm:px-7'>
        <div className='mb-6 flex items-center justify-center gap-4 sm:mb-8'>
          <span className='h-px w-12 bg-linear-to-r from-transparent to-gray-300 sm:w-24 dark:to-white/20' />
          <span className='font-mono text-[11px] tracking-[0.2em] text-gray-500 uppercase sm:text-xs dark:text-gray-400'>
            {t('home.logos.caption')}
          </span>
          <span className='h-px w-12 bg-linear-to-l from-transparent to-gray-300 sm:w-24 dark:to-white/20' />
        </div>

        <div
          className='relative overflow-hidden'
          style={{ isolation: 'isolate' }}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-[#101828]' />
          <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-[#101828]' />

          <div
            ref={stripRef}
            className='flex w-max items-center'
            style={{
              willChange: 'transform',
              animation: `logo-marquee ${speedSeconds}s linear infinite`,
              marginRight: '48px',
            }}
          >
            {doubled.map((logo) => (
              <div
                key={`${logo.src}-${logo.copy}`}
                className='flex shrink-0 items-center justify-center opacity-50 transition-opacity hover:opacity-100 dark:opacity-70 dark:brightness-150 dark:grayscale dark:hover:opacity-100 dark:hover:grayscale-0'
                style={{ width: '120px', marginRight: '48px' }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  className='h-10 w-[120px] object-contain'
                  loading='lazy'
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
