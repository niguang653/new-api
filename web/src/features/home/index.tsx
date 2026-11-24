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
import { PublicLayout } from '@/components/layout'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuthStore } from '@/stores/auth-store'

import { BrandMarquee } from './BrandMarquee'
import { CustomHomeContent } from './CustomHomeContent'
import { Features } from './Features'
import { FluidOverlay } from './Fluid'
import { Footer } from './Footer'
import { Hero } from './Hero'
import { Notice } from './Notice'
import { useHomePageContent } from './hooks'
import { HOME_STYLE_SHEET } from './styles'

export function Home() {
  const { auth } = useAuthStore()
  const { content, isLoaded, isUrl } = useHomePageContent()
  const isMobile = useIsMobile()

  if (!isLoaded) {
    return (
      <PublicLayout showMainContainer={false}>
        <main className='flex min-h-screen items-center justify-center'>
          <div className='text-muted-foreground'>Loading...</div>
        </main>
      </PublicLayout>
    )
  }

  if (content) {
    return <CustomHomeContent content={content} isUrl={isUrl} />
  }

  return (
    <PublicLayout showMainContainer={false}>
      <style>{HOME_STYLE_SHEET}</style>
      {!isMobile && <FluidOverlay />}
      <Notice />
      <Hero isAuthenticated={!!auth.user} />
      <BrandMarquee />
      <Features />
      <Footer />
    </PublicLayout>
  )
}
