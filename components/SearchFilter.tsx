'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onTagFilter: (tags: string[]) => void
  availableTags: string[]
  selectedTags: string[]
  allVisualizations: Array<{ slug: string }>
}

export default function SearchFilter({ 
  onSearch, 
  onTagFilter, 
  availableTags, 
  selectedTags,
  allVisualizations
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagFilter(selectedTags.filter(t => t !== tag))
    } else {
      onTagFilter([...selectedTags, tag])
    }
  }

  const handleRandom = () => {
    if (allVisualizations.length === 0) return
    const randomIndex = Math.floor(Math.random() * allVisualizations.length)
    const randomViz = allVisualizations[randomIndex]
    router.push(`/viz/${randomViz.slug}`)
  }

  return (
    <div className="mb-8 space-y-6">
      {/* Search Input with Random Button */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ara..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
        />
        <button
          onClick={handleRandom}
          className="px-4 py-3 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-colors relative group"
          title="Rastgele"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 1.232-.046 2.453-.138 3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3-3m16.5 0h-1.5m-16.5 0h1.5" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <circle cx="9" cy="15" r="1" fill="currentColor" />
            <circle cx="15" cy="15" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Rastgele
          </span>
        </button>
      </div>

    </div>
  )
}
