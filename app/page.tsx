import Link from 'next/link'
import { getAllVisualizations, getAllCollections } from '@/lib/data'

export default function Home() {
  const visualizations = getAllVisualizations()
  const collections = getAllCollections()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Main content - Son Görselleştirmeler Horizontal Grid (2 columns) */}
      <div className="mb-20">
        <h1 className="text-2xl font-semibold mb-12 tracking-tight">Son Görselleştirmeler</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {visualizations.slice(0, 6).map((viz) => (
            <article key={viz.slug}>
              <Link
                href={`/viz/${viz.slug}`}
                className="block group"
              >
                <h2 className="text-xl font-semibold mb-3 group-hover:underline">
                  {viz.title}
                </h2>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {viz.takeaway}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(viz.lastUpdated).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Minimal bottom information section */}
      <div className="pt-8">
        <p className="text-sm text-gray-600 mb-6">
          Datum, Türkiye için editöryel veri görselleştirmeleri sunar.
        </p>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Koleksiyonlar</p>
              <ul className="space-y-1">
                {collections.map((collection) => (
                  <li key={collection.slug}>
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <Link
                href="/kurumsal"
                className="block text-sm text-gray-600 hover:underline"
              >
                Kurumsal
              </Link>
              <Link
                href="/about"
                className="block text-sm text-gray-600 hover:underline"
              >
                Hakkında
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
