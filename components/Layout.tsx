import Link from 'next/link'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-2xl font-semibold tracking-tight">
                Datum
              </Link>
              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <Link href="/" className="hover:text-[#006AD4]">
                  Ana Sayfa
                </Link>
                <Link href="/kategori/ekonomi" className="hover:text-[#006AD4]">
                  Kategoriler
                </Link>
                <Link href="/fiyatlandırma" className="hover:text-[#006AD4]">
                  Fiyatlandırma
                </Link>
                <Link href="/hakkinda" className="hover:text-[#006AD4]">
                  Hakkında
                </Link>
              </div>
            </div>
            <Link href="/giris" className="text-sm font-medium text-[#006AD4]">
              Giriş Yap
            </Link>
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
