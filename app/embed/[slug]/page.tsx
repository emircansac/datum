import { notFound } from 'next/navigation'
import { getVisualizationBySlug } from '@/lib/data'
import Chart from '@/components/Chart'

interface PageProps {
  params: {
    slug: string
  }
}

export default function EmbedPage({ params }: PageProps) {
  const visualization = getVisualizationBySlug(params.slug)

  if (!visualization) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">{visualization.title}</h2>
          <p className="text-sm text-gray-600">{visualization.takeaway}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <Chart visualization={visualization} embed={true} />
        </div>
        <div className="mt-4 text-center">
          <a
            href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/viz/${visualization.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:underline"
          >
            Datum üzerinde görüntüle
          </a>
        </div>
      </div>
    </div>
  )
}
