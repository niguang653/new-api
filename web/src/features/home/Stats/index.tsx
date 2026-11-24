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
import { useTranslation } from 'react-i18next'

interface StatDef {
  title: string
  description: string
}

export function Stats() {
  const { t } = useTranslation()

  // 4 格定性规格，不放运营数字
  const items: StatDef[] = [
    {
      title: t('home.stats.titles.openaiCompat'),
      description: t('home.stats.descriptions.openaiCompat'),
    },
    {
      title: t('home.stats.titles.models'),
      description: t('home.stats.descriptions.models'),
    },
    {
      title: t('home.stats.titles.failover'),
      description: t('home.stats.descriptions.failover'),
    },
    {
      title: t('home.stats.titles.metered'),
      description: t('home.stats.descriptions.metered'),
    },
  ]

  return (
    <div className='relative mx-auto w-full max-w-4xl'>
      <div className='group relative grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-white/70 p-4 shadow-[0_18px_45px_-30px_rgba(79,70,229,0.45)] backdrop-blur-md sm:grid-cols-2 sm:gap-4 sm:p-5 dark:bg-[#0B0E16]/80 md:grid-cols-4 md:gap-0 md:p-0 md:pr-6'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-[#5B5BFF]/70 to-transparent' />
        {items.map((item, index) => (
          <div
            key={index}
            className='group/cell relative flex flex-col gap-1.5 rounded-xl px-4 py-4 transition-colors duration-500 hover:bg-[#475CFF]/[0.03] dark:hover:bg-[#5B5BFF]/[0.06] md:rounded-none md:px-5 md:py-5 md:first:rounded-l-2xl md:last:rounded-r-2xl md:first:pl-5 md:last:pr-5 md:[&:not(:last-child)]:divide-x md:[&:not(:last-child)]:divide-border/60'
          >
            <span className='text-foreground/40 pointer-events-none absolute inset-x-3 bottom-1.5 h-6 rounded-full bg-[#5B5BFF]/0 blur-xl transition-colors duration-500 group-hover/cell:bg-[#5B5BFF]/25 md:inset-x-5' />
            <span className='relative text-center font-mono text-[11px] font-medium tracking-[0.18em] text-[#475CFF] uppercase sm:text-left dark:text-[#93A1FF]'>
              {item.title}
            </span>
            <span className='relative text-center text-[13px] leading-6 text-muted-foreground sm:text-left'>
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
