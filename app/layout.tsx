import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/Layout'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Datum - Veri Görselleştirme Platformu',
  description: 'Türkiye için temiz, minimal ve editöryel veri görselleştirmeleri',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isEmbedPage = false
  try {
    const headersList = headers()
    const pathname = headersList.get('x-pathname') || ''
    isEmbedPage = pathname.startsWith('/embed')
  } catch {
    // Headers might not be available in all contexts
  }
  
  return (
    <html lang="tr">
      <body>
        {isEmbedPage ? children : <Layout>{children}</Layout>}
      </body>
    </html>
  )
}
