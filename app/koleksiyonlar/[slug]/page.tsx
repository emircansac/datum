import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCollectionBySlug, getVisualizationsByIds } from '@/lib/supabase/queries'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const collection = await getCollectionBySlug(params.slug)
  if (!collection) notFound()

  const visualizations = collection.visualization_ids.length > 0 
    ? await getVisualizationsByIds(collection.visualization_ids)
    : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <Link
          href="/koleksiyonlar"
          className="text-sm text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Koleksiyonlara dön
        </Link>
        <h1 className="text-4xl font-semibold mb-4 tracking-tight">{collection.title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl">{collection.description}</p>
      </div>

      <div className="space-y-6">
        {visualizations.length === 0 ? (
          <p className="text-gray-500">Bu koleksiyonda henüz görselleştirme bulunmuyor.</p>
        ) : (
          visualizations.map((viz) => (
            <Link
              key={viz.id}
              href={`/viz/${viz.slug}`}
              className="block p-8 border border-gray-200 rounded-lg hover:border-black transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{viz.title}</h2>
              <p className="text-gray-600 mb-4">{viz.summary}</p>
              <p className="text-sm text-gray-500">
                Son güncelleme: {new Date(viz.last_updated).toLocaleDateString('tr-TR')}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
