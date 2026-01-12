import Link from 'next/link'
import { getAllCollections } from '@/lib/data'

export default function CollectionsPage() {
  const collections = getAllCollections()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-semibold mb-12 tracking-tight">Koleksiyonlar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="block p-8 border border-gray-200 rounded-lg hover:border-black transition-colors"
          >
            <h2 className="text-xl font-semibold mb-3">{collection.title}</h2>
            <p className="text-gray-600 mb-4">{collection.description}</p>
            <p className="text-sm text-gray-500">
              {collection.visualizations.length} görselleştirme
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
