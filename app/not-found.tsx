import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4">404</h1>
        <p className="text-gray-600 mb-8">Sayfa bulunamadı.</p>
        <Link
          href="/"
          className="text-sm text-gray-600 hover:underline"
        >
          Ana sayfaya dön →
        </Link>
      </div>
    </div>
  )
}
