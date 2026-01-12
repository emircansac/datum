import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVisualizationBySlug, getCollectionsByVisualization } from '@/lib/data'
import Chart from '@/components/Chart'
import EmbedCode from '@/components/EmbedCode'

interface PageProps {
  params: {
    slug: string
  }
}

export default function VisualizationPage({ params }: PageProps) {
  const visualization = getVisualizationBySlug(params.slug)
  const collections = getCollectionsByVisualization(params.slug)

  if (!visualization) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Ana sayfaya dön
        </Link>
      </div>

      <article>
        <h1 className="text-4xl font-semibold mb-4 tracking-tight">{visualization.title}</h1>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-700 font-medium">{visualization.takeaway}</p>
        </div>

        <div className="mb-12 border border-gray-200 rounded-lg p-8 bg-white">
          <Chart visualization={visualization} />
        </div>

        <div className="prose max-w-none space-y-8 mb-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Ne Gösteriyor / Neden Önemli</h2>
            <p className="text-gray-700 leading-relaxed">{visualization.description}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Kaynaklar</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {visualization.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Metodoloji / Notlar</h2>
            <p className="text-gray-700 leading-relaxed">{visualization.methodology}</p>
          </section>

          <section>
            <p className="text-sm text-gray-500">
              Son güncelleme: {new Date(visualization.lastUpdated).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </section>
        </div>

        <EmbedCode slug={visualization.slug} siteUrl={siteUrl} />

        {collections.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-semibold mb-4 text-gray-600">Bu görselleştirme şu koleksiyonlarda:</h2>
            <div className="flex flex-wrap gap-2">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/collections/${collection.slug}`}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-black transition-colors"
                >
                  {collection.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
