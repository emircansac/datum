'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import SearchFilter from './SearchFilter'
import ChartPreview from './ChartPreview'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

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

interface VisualizationsListProps {
  initialVisualizations: VisualizationWithChart[]
  availableTags: string[]
}

export default function VisualizationsList({ 
  initialVisualizations = [], 
  availableTags = [] 
}: VisualizationsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredVisualizations = useMemo(() => {
    if (!initialVisualizations || initialVisualizations.length === 0) {
      return []
    }
    let filtered = initialVisualizations

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(viz =>
        viz.title.toLowerCase().includes(query) ||
        viz.summary.toLowerCase().includes(query)
      )
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(viz =>
        selectedTags.every(tag => viz.tags.includes(tag))
      )
    }

    return filtered
  }, [initialVisualizations, searchQuery, selectedTags])

  return (
    <>
      <SearchFilter
        onSearch={setSearchQuery}
        onTagFilter={setSelectedTags}
        availableTags={availableTags}
        selectedTags={selectedTags}
        allVisualizations={initialVisualizations}
      />

      {filteredVisualizations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-2">Sonuç bulunamadı</p>
          <p className="text-sm text-gray-500">
            Farklı arama terimleri veya filtreler deneyin
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-6">
            {filteredVisualizations.length} görselleştirme gösteriliyor
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVisualizations.map((viz) => (
              <Link
                key={viz.id}
                href={`/viz/${viz.slug}`}
                className="block group"
              >
                <article className="border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors flex flex-col">
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
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold mb-3 group-hover:underline leading-tight">
                      {viz.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
                      {viz.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {viz.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
        </>
      )}
    </>
  )
}
