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
import { Footer as BaseFooter } from '@/components/layout/components/footer'

/**
 * 首页页脚：复用站内 Footer，仅补一条顶部分隔渐变以衔接新暗色主题。
 */
export function Footer() {
  return (
    <div className='relative bg-gray-50 dark:bg-[#101828]'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#7C6BFF]/40 to-transparent' />
      <BaseFooter />
    </div>
  )
}
