import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-semibold tracking-tight">
                Datum
              </Link>
              <p className="text-sm text-gray-600 hidden md:block max-w-md">
                Türkiye'nin veri görselleştirme platformu
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/" className="text-sm hover:underline">
                Ana Sayfa
              </Link>
              <Link href="/koleksiyonlar" className="text-sm hover:underline">
                Koleksiyonlar
              </Link>
              <Link href="/hakkinda" className="text-sm hover:underline">
                Hakkında
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-sm text-gray-600">
            © 2024 Datum. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  )
}
