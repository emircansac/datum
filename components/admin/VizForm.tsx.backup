'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Visualization, Collection } from '@/types'

interface VizFormProps {
  visualization?: Visualization
  collections: Array<{ id: string; title: string }>
}

export default function VizForm({ visualization, collections }: VizFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    visualization?.thumbnail_file ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbs/${visualization.thumbnail_file}` : null
  )
  const [formData, setFormData] = useState({
    title: visualization?.title || '',
    slug: visualization?.slug || '',
    summary: visualization?.summary || '',
    tags: visualization?.tags.join(', ') || '',
    collection_ids: visualization?.collection_ids || [],
    sources: visualization?.sources.join('\n') || '',
    status: visualization?.status || 'draft',
    chart_spec: JSON.stringify(visualization?.chart_spec || { data: {}, mark: 'bar' }, null, 2),
    thumbnail_file: visualization?.thumbnail_file || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createSupabaseClient()
      
      // Check session and role for debugging
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.')
        setLoading(false)
        return
      }
      
      // Check if user has admin/editor role
      const userRole = session.user.user_metadata?.role
      if (!userRole || !['admin', 'editor'].includes(userRole)) {
        setError(`Yetki hatası: Kullanıcı rolü '${userRole || 'yok'}'. Admin veya editor rolü gerekli.`)
        setLoading(false)
        return
      }
      
      // Parse chart_spec JSON
      let chartSpec
      try {
        chartSpec = JSON.parse(formData.chart_spec)
      } catch (err) {
        setError('Chart Spec JSON formatı geçersiz. Lütfen düzeltin.')
        setLoading(false)
        return
      }

      const data: any = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        summary: formData.summary,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        collection_ids: formData.collection_ids,
        sources: formData.sources.split('\n').filter(Boolean),
        status: formData.status,
        chart_spec: chartSpec,
        last_updated: new Date().toISOString(),
      }

      // Only include thumbnail_file if it's set
      if (formData.thumbnail_file) {
        data.thumbnail_file = formData.thumbnail_file
      }

      let result
      if (visualization) {
        result = await supabase.from('visualizations').update(data).eq('id', visualization.id)
      } else {
        result = await supabase.from('visualizations').insert({ ...data, embed_version: 1 })
      }

      if (result.error) {
        setError(`Hata: ${result.error.message}`)
        setLoading(false)
        return
      }

      router.push('/admin/viz')
      router.refresh()
    } catch (err: any) {
      setError(`Beklenmeyen hata: ${err.message}`)
      setLoading(false)
    }
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
        <label className="block text-sm font-medium mb-2">Özet</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Etiketler (virgülle ayırın)</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Koleksiyonlar</label>
        <div className="space-y-2">
          {collections.map((col) => (
            <label key={col.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.collection_ids.includes(col.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({ ...formData, collection_ids: [...formData.collection_ids, col.id] })
                  } else {
                    setFormData({ ...formData, collection_ids: formData.collection_ids.filter(id => id !== col.id) })
                  }
                }}
                className="mr-2"
              />
              {col.title}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Kaynaklar (her satıra bir kaynak)</label>
        <textarea
          value={formData.sources}
          onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Durum</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Chart Spec (Vega-Lite JSON)</label>
        <textarea
          value={formData.chart_spec}
          onChange={(e) => setFormData({ ...formData, chart_spec: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
          rows={15}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Thumbnail Görsel</label>
        <div className="space-y-3">
          {thumbnailPreview && (
            <div className="relative w-48 h-32 border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              setUploading(true)
              try {
                const supabase = createSupabaseClient()
                
                // Generate unique filename
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                const filePath = fileName

                // Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                  .from('thumbs')
                  .upload(filePath, file, { upsert: false })

                if (uploadError) {
                  setError(`Yükleme hatası: ${uploadError.message}`)
                  setUploading(false)
                  return
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                  .from('thumbs')
                  .getPublicUrl(filePath)

                setFormData({ ...formData, thumbnail_file: filePath })
                setThumbnailPreview(publicUrl)
                setUploading(false)
              } catch (err: any) {
                setError(`Hata: ${err.message}`)
                setUploading(false)
              }
            }}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500">Yükleniyor...</p>}
          {formData.thumbnail_file && (
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, thumbnail_file: '' })
                setThumbnailPreview(null)
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Thumbnail'i kaldır
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <Link
          href="/admin/viz"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          İptal
        </Link>
      </div>
    </form>
  )
}
