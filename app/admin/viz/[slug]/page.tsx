import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getVisualizationBySlug } from '@/lib/data'

interface PageProps {
  params: {
    slug: string
  }
}

export default function AdminVizDetail({ params }: PageProps) {
  const visualization = getVisualizationBySlug(params.slug)

  if (!visualization) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/viz"
          className="text-sm text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Görselleştirmelere dön
        </Link>
        <h1 className="text-3xl font-semibold mb-2">{visualization.title}</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Slug</h2>
          <p className="text-sm">{visualization.slug}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Takeaway</h2>
          <p className="text-sm">{visualization.takeaway}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Açıklama</h2>
          <p className="text-sm">{visualization.description}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Kaynaklar</h2>
          <ul className="list-disc list-inside text-sm">
            {visualization.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Metodoloji</h2>
          <p className="text-sm">{visualization.methodology}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Son Güncelleme</h2>
          <p className="text-sm">{visualization.lastUpdated}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Koleksiyonlar</h2>
          <div className="flex flex-wrap gap-2">
            {visualization.collections.map((colSlug) => (
              <span key={colSlug} className="px-2 py-1 text-xs bg-gray-100 rounded">
                {colSlug}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Grafik Tipi</h2>
          <p className="text-sm">{visualization.chartType}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Veri Noktaları</h2>
          <p className="text-sm text-gray-500">{visualization.chartData.length} veri noktası</p>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <Link
            href={`/viz/${visualization.slug}`}
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
