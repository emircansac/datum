import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollectionBySlug, getVisualizationsByCollection } from '@/lib/data'

interface PageProps {
  params: {
    slug: string
  }
}

export default function AdminCollectionDetail({ params }: PageProps) {
  const collection = getCollectionBySlug(params.slug)
  const visualizations = getVisualizationsByCollection(params.slug)

  if (!collection) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/collections"
          className="text-sm text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Koleksiyonlara dön
        </Link>
        <h1 className="text-3xl font-semibold mb-2">{collection.title}</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Slug</h2>
          <p className="text-sm">{collection.slug}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Açıklama</h2>
          <p className="text-sm">{collection.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Görselleştirmeler ({visualizations.length})</h2>
          <div className="space-y-2 mt-2">
            {visualizations.length === 0 ? (
              <p className="text-sm text-gray-500">Bu koleksiyonda görselleştirme yok.</p>
            ) : (
              visualizations.map((viz) => (
                <Link
                  key={viz.slug}
                  href={`/admin/viz/${viz.slug}`}
                  className="block text-sm text-gray-600 hover:underline"
                >
                  {viz.title}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <Link
            href={`/collections/${collection.slug}`}
            target="_blank"
            className="text-sm text-gray-600 hover:underline mr-4"
          >
            Görüntüle →
          </Link>
          <button className="text-sm text-gray-600 hover:underline">
            Düzenle (Yakında)
          </button>
        </div>
      </div>
    </div>
  )
}
