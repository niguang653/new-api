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
import { useQuery } from '@tanstack/react-query'
import { Megaphone, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getNotice } from '@/lib/api'
import { requireServerSuccess } from '@/lib/server-error-message'

/** 去掉 Markdown 语法，保留纯文本用于单行展示 */
function toPlainText(markdown: string): string {
  return markdown
    .replaceAll(/\[([^\]]*)\]\(([^)]*)\)/g, '$1')
    .replaceAll(/[#>*`_~]/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
}

export function Notice() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  const { data } = useQuery({
    queryKey: ['notice'],
    queryFn: async () => requireServerSuccess(await getNotice()),
    staleTime: 5 * 60 * 1000,
  })

  const notice = useMemo(() => {
    const raw = data?.success ? (data.data || '').trim() : ''
    if (!raw) return ''
    const plain = toPlainText(raw)
    return plain.length > 120 ? `${plain.slice(0, 120)}…` : plain
  }, [data])

  if (!notice || dismissed) return null

  return (
    <div className='border-border/60 bg-muted/40 relative border-b'>
      <div className='text-muted-foreground mx-auto flex max-w-[1470px] items-center gap-2.5 px-5 py-2.5 text-sm sm:px-7'>
        <Megaphone className='size-4 shrink-0 text-[#475CFF]' aria-hidden />
        <p className='min-w-0 flex-1 truncate' title={notice}>
          {notice}
        </p>
        <button
          type='button'
          onClick={() => setDismissed(true)}
          aria-label={t('home.notice.close')}
          className='hover:text-foreground focus-visible:ring-ring rounded-sm p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none'
        >
          <X className='size-4' aria-hidden />
        </button>
      </div>
    </div>
  )
}
