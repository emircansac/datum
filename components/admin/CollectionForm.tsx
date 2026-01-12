'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Collection } from '@/types'

interface CollectionFormProps {
  collection: Collection | null
  visualizations: Array<{ id: string; title: string }>
}

export default function CollectionForm({ collection, visualizations }: CollectionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: collection?.title || '',
    slug: collection?.slug || '',
    description: collection?.description || '',
    visualization_ids: collection?.visualization_ids || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createSupabaseClient()
    const data = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      visualization_ids: formData.visualization_ids,
    }

    if (collection) {
      await supabase.from('collections').update(data).eq('id', collection.id)
    } else {
      await supabase.from('collections').insert(data)
    }

    router.push('/admin/collections')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Başlık</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Açıklama</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Görselleştirmeler</label>
        <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {visualizations.map((viz) => (
            <label key={viz.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.visualization_ids.includes(viz.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, visualization_ids: [...formData.visualization_ids, viz.id] })
                  } else {
                    setFormData({ ...formData, visualization_ids: formData.visualization_ids.filter(id => id !== viz.id) })
                  }
                }}
                className="mr-2"
              />
              {viz.title}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <a
          href="/admin/collections"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          İptal
        </a>
      </div>
    </form>
  )
}
