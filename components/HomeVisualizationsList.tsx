'use client'

import Link from 'next/link'
import ChartPreview from './ChartPreview'

interface VisualizationWithChart {
  id: string
  title: string
  slug: string
  summary: string
  tags: string[]
  thumbnail_file: string | null
  last_updated: string
  chartSpec: Record<string, any>
}

interface HomeVisualizationsListProps {
  visualizations: VisualizationWithChart[]
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

export default function HomeVisualizationsList({ 
  visualizations = [] 
}: HomeVisualizationsListProps) {
  if (!visualizations || visualizations.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Henüz görselleştirme bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visualizations.map((viz) => (
        <Link
          key={viz.id}
          href={`/viz/${viz.slug}`}
          className="block group cursor-pointer"
        >
          <article className="border border-gray-200 rounded-lg overflow-hidden hover:border-black hover:shadow-sm transition-all flex flex-col h-full">
            {viz.thumbnail_file ? (
              <div className="w-full aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={`${SUPABASE_URL}/storage/v1/object/public/thumbs/${viz.thumbnail_file}`}
                  alt={viz.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-white p-2 flex items-center justify-center overflow-hidden relative">
                <div className="w-full h-full scale-[0.35] origin-center absolute">
                  <ChartPreview spec={viz.chartSpec} />
                </div>
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              <h2 className="text-base font-semibold mb-2.5 group-hover:underline leading-tight">
                {viz.title}
              </h2>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1 leading-relaxed">
                {viz.summary}
              </p>
              <p className="text-xs text-gray-500 mt-auto">
                {new Date(viz.last_updated).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
