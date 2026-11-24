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
import { useId, useRef, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import {
  FeatureIllustration,
  type FeatureCardKey,
} from './illustrations'

const ROW_ONE: FeatureCardKey[] = ['singleApi', 'security', 'globalEdge']
const ROW_TWO: FeatureCardKey[] = ['latency', 'failover']

function FeatureCard({
  cardKey,
  title,
  description,
  gid,
  index,
}: {
  cardKey: FeatureCardKey
  title: string
  description: string
  gid: string
  index: number
}) {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl p-px sm:min-h-[295px]',
        'bg-gray-200/80 dark:bg-white/10',
        'transition-all duration-300 ease-out hover:-translate-y-1',
        'hover:shadow-[0_20px_50px_-20px_rgba(91,91,255,0.45)]'
      )}
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),#7C6BFF,transparent_70%)]' />

      <div className='relative flex flex-1 flex-col overflow-hidden rounded-[15px] bg-white p-6 sm:p-8 dark:bg-[#0E1424]'>
        <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.08)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_bottom,black_20%,transparent_75%)] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)]' />
        <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,50%),rgba(124,107,255,0.10),transparent_70%)]' />

        <span className='relative z-[1] font-mono text-xs font-medium tracking-[0.12em] text-[#475CFF] dark:text-[#93A1FF]'>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className='relative z-[1] mt-2.5 text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl dark:text-white'>
          {title}
        </h3>
        <p className='relative z-[1] mt-2.5 max-w-md text-[15px] leading-7 text-gray-600 dark:text-gray-300'>
          {description}
        </p>

        <div className='pointer-events-none absolute right-6 -bottom-6 size-32 origin-bottom scale-90 opacity-35 transition-all duration-500 ease-out group-hover:translate-y-[-14px] group-hover:scale-100 group-hover:opacity-70 sm:size-36 dark:opacity-40'>
          <FeatureIllustration cardKey={cardKey} gid={gid} />
        </div>
      </div>
    </article>
  )
}

export function Features() {
  const { t } = useTranslation()
  const uid = useId().replaceAll(':', '')

  return (
    <section className='relative overflow-hidden bg-white py-16 sm:py-24 dark:bg-[#0A0F1E]'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#7C6BFF]/50 to-transparent' />
      <div className='pointer-events-none absolute top-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-[#5B5BFF]/10 blur-[100px] dark:bg-[#5B5BFF]/20' />

      <div className='relative mx-auto max-w-[1470px] px-5 sm:px-7'>
        <p className='font-mono text-xs font-semibold tracking-[0.16em] text-[#475CFF] uppercase dark:text-[#93A1FF]'>
          {t('home.chooseUs.eyebrow')}
        </p>
        <h2 className='mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-gray-950 sm:text-4xl sm:leading-[1.18] dark:text-white'>
          {t('home.chooseUs.title')}
        </h2>

        <div className='mt-10 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5'>
          {ROW_ONE.map((key, i) => (
            <div key={key} className='md:col-span-2'>
              <FeatureCard
                index={i}
                cardKey={key}
                gid={`${uid}-${key}`}
                title={t(`home.chooseUs.cards.${key}.title`)}
                description={t(`home.chooseUs.cards.${key}.description`)}
              />
            </div>
          ))}
          {ROW_TWO.map((key, i) => (
            <div key={key} className='md:col-span-3'>
              <FeatureCard
                index={ROW_ONE.length + i}
                cardKey={key}
                gid={`${uid}-${key}`}
                title={t(`home.chooseUs.cards.${key}.title`)}
                description={t(`home.chooseUs.cards.${key}.description`)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
