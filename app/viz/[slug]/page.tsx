import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVisualizationBySlug, getCollections } from '@/lib/supabase/queries'
import Chart from '@/components/Chart'
import EmbedCode from '@/components/EmbedCode'
import { createSupabaseClient } from '@/lib/supabase/client'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function VisualizationPage({ params }: PageProps) {
  const visualization = await getVisualizationBySlug(params.slug)
  if (!visualization) notFound()

  const supabase = createSupabaseClient()
  let chartData = null

  if (visualization.dataset_file) {
    const { data } = await supabase.storage
      .from('datasets')
      .download(visualization.dataset_file)
    if (data) {
      const text = await data.text()
      chartData = JSON.parse(text)
    }
  }

  const chartSpec = {
    ...visualization.chart_spec,
    data: chartData || visualization.chart_spec.data
  }

  const allCollections = await getCollections()
  const relatedCollections = allCollections.filter(col =>
    col.visualization_ids.includes(visualization.id)
  )

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
          <p className="text-lg text-gray-700 font-medium">{visualization.summary}</p>
        </div>

        <div className="mb-12 border border-gray-200 rounded-lg p-8 bg-white">
          <Chart spec={chartSpec} />
        </div>

        <div className="prose max-w-none space-y-8 mb-12">
          {visualization.tags.length > 0 && (
            <section>
              <div className="flex flex-wrap gap-2">
                {visualization.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold mb-4">Kaynaklar</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {visualization.sources.map((source, index) => {
                // Parse source link if exists (format: "text|url")
                if (source.includes('|')) {
                  const [text, url] = source.split('|')
                  return (
                    <li key={index}>
                      <a 
                        href={url.trim()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {text.trim()}
                      </a>
                    </li>
                  )
                }
                return <li key={index}>{source}</li>
              })}
            </ul>
          </section>

          <section>
            <p className="text-sm text-gray-500">
              Son güncelleme: {new Date(visualization.last_updated).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </section>
        </div>

        <EmbedCode slug={visualization.slug} version={visualization.embed_version} siteUrl={siteUrl} />

        {relatedCollections.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-semibold mb-4 text-gray-600">Bu görselleştirme şu koleksiyonlarda:</h2>
            <div className="flex flex-wrap gap-2">
              {relatedCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/koleksiyonlar/${collection.slug}`}
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
