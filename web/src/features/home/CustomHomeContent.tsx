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
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicLayout } from '@/components/layout'
import { RichContent } from '@/components/rich-content'
import { useTheme } from '@/context/theme-provider'
import { isLikelyHtml } from '@/lib/content-format'

/** 后台配置了自定义首页（URL / HTML / Markdown）时的兜底渲染 */
export function CustomHomeContent({
  content,
  isUrl,
}: {
  content: string
  isUrl: boolean
}) {
  const { i18n } = useTranslation()
  const { resolvedTheme } = useTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const syncPreferences = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { themeMode: resolvedTheme },
        '*'
      )
      iframeRef.current?.contentWindow?.postMessage(
        { lang: i18n.language },
        '*'
      )
    } catch {
      /* cross-origin frames may reject */
    }
  }, [i18n.language, resolvedTheme])

  useEffect(() => {
    if (isUrl) syncPreferences()
  }, [isUrl, syncPreferences])

  if (isUrl) {
    return (
      <PublicLayout showMainContainer={false}>
        <iframe
          ref={iframeRef}
          src={content}
          className='h-screen w-full border-none'
          title='Custom Home Page'
          sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation-by-user-activation'
          onLoad={syncPreferences}
        />
      </PublicLayout>
    )
  }

  if (isLikelyHtml(content)) {
    return (
      <PublicLayout showMainContainer={false}>
        <RichContent
          mode='html'
          htmlVariant='isolated'
          content={content}
          className='custom-home-content'
        />
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className='mx-auto max-w-6xl px-4 py-8'>
        <RichContent
          mode='markdown'
          content={content}
          className='custom-home-content'
        />
      </div>
    </PublicLayout>
  )
}
