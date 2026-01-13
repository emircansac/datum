'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Visualization } from '@/types'
import { CHART_TEMPLATES, ChartTemplateId, generateChartSpec } from '@/lib/chart-templates'
import { parseCSV, getSampleCSV } from '@/lib/csv-parser'
import Chart from '@/components/Chart'

interface VizFormProps {
  visualization?: Visualization
  collections: Array<{ id: string; title: string }>
}

export default function VizForm({ visualization, collections }: VizFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  
  // Chart creation state
  const [selectedTemplate, setSelectedTemplate] = useState<ChartTemplateId | null>(null)
  const [dataInput, setDataInput] = useState('')
  const [parsedData, setParsedData] = useState<Array<Record<string, any>> | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  
  // Editorial settings (collapsible)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [editorialSettings, setEditorialSettings] = useState({
    chartTitle: '',
    chartSubtitle: '',
    xAxisLabel: '',
    yAxisLabel: '',
    unit: ''
  })
  
  // Metadata (always visible)
  const [metadata, setMetadata] = useState({
    title: visualization?.title || '',
    slug: visualization?.slug || '',
    summary: visualization?.summary || '',
    tags: visualization?.tags.join(', ') || '',
    collection_ids: visualization?.collection_ids || [],
    sources: visualization?.sources.join('\n') || '',
    methodology: '',
    status: visualization?.status || 'draft' as 'draft' | 'published',
    thumbnail_file: visualization?.thumbnail_file || '',
  })
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    visualization?.thumbnail_file ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbs/${visualization.thumbnail_file}` : null
  )

  // If editing existing visualization, try to detect template and load data
  useEffect(() => {
    if (visualization?.chart_spec && !selectedTemplate) {
      // For now, we'll start fresh - in production, you might want to detect template from existing spec
      // For editing mode, we could show a "start new chart" or "edit existing" option
    }
  }, [visualization, selectedTemplate])

  // Parse data when input changes
  useEffect(() => {
    if (!dataInput.trim()) {
      setParsedData(null)
      setColumns([])
      return
    }

    const result = parseCSV(dataInput)
    if (result.success && result.data && result.columns) {
      setParsedData(result.data)
      setColumns(result.columns)
      setWarnings(result.error ? [result.error] : [])
      
      // Auto-map columns if template is selected
      if (selectedTemplate && result.columns.length > 0) {
        const template = CHART_TEMPLATES[selectedTemplate]
        const newMappings: Record<string, string> = {}
        template.requiredFields.forEach((field, index) => {
          if (result.columns && index < result.columns.length) {
            newMappings[field.key] = result.columns[index]
          }
        })
        setColumnMappings(newMappings)
      }
    } else {
      setParsedData(null)
      setColumns([])
      if (result.error) {
        setWarnings([result.error])
      }
    }
  }, [dataInput, selectedTemplate])

  // Generate chart spec for preview
  const chartSpec = useMemo(() => {
    if (!selectedTemplate || !parsedData || parsedData.length === 0) {
      return null
    }

    const template = CHART_TEMPLATES[selectedTemplate]
    const allMapped = template.requiredFields.every(field => columnMappings[field.key])
    
    if (!allMapped) {
      return null
    }

    try {
      return generateChartSpec(
        selectedTemplate,
        parsedData,
        columnMappings,
        {
          title: editorialSettings.chartTitle || undefined,
          subtitle: editorialSettings.chartSubtitle || undefined,
          xAxisLabel: editorialSettings.xAxisLabel || undefined,
          yAxisLabel: editorialSettings.yAxisLabel || undefined,
          unit: editorialSettings.unit || undefined
        }
      )
    } catch (err) {
      console.error('Error generating chart spec:', err)
      return null
    }
  }, [selectedTemplate, parsedData, columnMappings, editorialSettings])

  // Validate before submit
  const validate = (): string[] => {
    const errors: string[] = []
    
    if (!metadata.title.trim()) {
      errors.push('Başlık gereklidir')
    }
    
    if (!metadata.summary.trim()) {
      errors.push('Özet gereklidir')
    }
    
    if (!selectedTemplate) {
      errors.push('Grafik tipi seçilmelidir')
    }
    
    if (!parsedData || parsedData.length === 0) {
      errors.push('Veri girilmelidir')
    }
    
    if (selectedTemplate) {
      const template = CHART_TEMPLATES[selectedTemplate]
      const missingFields = template.requiredFields.filter(field => !columnMappings[field.key])
      if (missingFields.length > 0) {
        errors.push(`Eksik sütun eşlemeleri: ${missingFields.map(f => f.label).join(', ')}`)
      }
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setWarnings([])

    const validationErrors = validate()
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '))
      return
    }

    if (!selectedTemplate || !chartSpec || !parsedData) {
      setError('Grafik oluşturulamadı. Lütfen tüm alanları doldurun.')
      return
    }

    setLoading(true)

    try {
      const supabase = createSupabaseClient()
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.')
        setLoading(false)
        return
      }
      
      const userRole = session.user.user_metadata?.role
      if (!userRole || !['admin', 'editor'].includes(userRole)) {
        setError(`Yetki hatası: Kullanıcı rolü '${userRole || 'yok'}'. Admin veya editor rolü gerekli.`)
        setLoading(false)
        return
      }

      const data: any = {
        title: metadata.title,
        slug: metadata.slug || metadata.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        summary: metadata.summary,
        tags: metadata.tags.split(',').map(t => t.trim()).filter(Boolean),
        collection_ids: metadata.collection_ids,
        sources: metadata.sources.split('\n').filter(Boolean),
        status: metadata.status,
        chart_spec: chartSpec,
        last_updated: new Date().toISOString(),
      }

      if (metadata.thumbnail_file) {
        data.thumbnail_file = metadata.thumbnail_file
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

  const template = selectedTemplate ? CHART_TEMPLATES[selectedTemplate] : null

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
      {/* STEP 1: Chart Type Selection */}
      {!selectedTemplate ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Grafik Tipi Seçin</h2>
          <p className="text-sm text-gray-600 mb-6">Hangi tür grafik oluşturmak istiyorsunuz?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(CHART_TEMPLATES).map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id)}
                className="p-4 border border-gray-200 rounded-lg text-left hover:border-black hover:bg-gray-50 transition-all"
              >
                <h3 className="font-semibold mb-1">{tpl.name}</h3>
                <p className="text-sm text-gray-600">{tpl.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Selected Template Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-xl font-semibold">{template?.name}</h2>
              <p className="text-sm text-gray-600">{template?.description}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(null)
                setDataInput('')
                setParsedData(null)
                setColumns([])
                setColumnMappings({})
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              Değiştir
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Form Steps */}
            <div className="space-y-8">
              {/* STEP 2: Data Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Veri Girişi (CSV veya Tab-separated)
                </label>
                <textarea
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  placeholder={getSampleCSV()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={10}
                />
                {warnings.length > 0 && (
                  <div className="mt-2 text-sm text-amber-600">
                    {warnings.map((w, i) => (
                      <p key={i}>{w}</p>
                    ))}
                  </div>
                )}
                {parsedData && columns.length > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    {parsedData.length} satır, {columns.length} sütun algılandı
                  </div>
                )}
              </div>

              {/* STEP 3: Column Mapping */}
              {template && columns.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-4">Sütun Eşleştirme</h3>
                  <div className="space-y-4">
                    {template.requiredFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium mb-2">
                          {field.label}
                          {field.description && (
                            <span className="text-xs text-gray-500 ml-2">({field.description})</span>
                          )}
                        </label>
                        <select
                          value={columnMappings[field.key] || ''}
                          onChange={(e) => {
                            setColumnMappings({
                              ...columnMappings,
                              [field.key]: e.target.value
                            })
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          required
                        >
                          <option value="">Sütun seçin...</option>
                          {columns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Editorial Controls (Collapsible) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-medium mb-4"
                >
                  <span>Gelişmiş Ayarlar</span>
                  <span>{showAdvanced ? '−' : '+'}</span>
                </button>
                {showAdvanced && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-medium mb-2">Grafik Başlığı</label>
                      <input
                        type="text"
                        value={editorialSettings.chartTitle}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, chartTitle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Opsiyonel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Alt Başlık</label>
                      <input
                        type="text"
                        value={editorialSettings.chartSubtitle}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, chartSubtitle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Opsiyonel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">X Ekseni Adı</label>
                      <input
                        type="text"
                        value={editorialSettings.xAxisLabel}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, xAxisLabel: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Opsiyonel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Y Ekseni Adı</label>
                      <input
                        type="text"
                        value={editorialSettings.yAxisLabel}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, yAxisLabel: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Opsiyonel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Birim</label>
                      <input
                        type="text"
                        value={editorialSettings.unit}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, unit: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="örn: %, kişi, TL"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata Fields */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-sm font-semibold mb-4">Yayın Bilgileri</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Başlık *</label>
                  <input
                    type="text"
                    value={metadata.title}
                    onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={metadata.slug}
                    onChange={(e) => setMetadata({ ...metadata, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Otomatik oluşturulur"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Özet *</label>
                  <textarea
                    value={metadata.summary}
                    onChange={(e) => setMetadata({ ...metadata, summary: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Etiketler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={metadata.tags}
                    onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
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
                          checked={metadata.collection_ids.includes(col.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMetadata({ ...metadata, collection_ids: [...metadata.collection_ids, col.id] })
                            } else {
                              setMetadata({ ...metadata, collection_ids: metadata.collection_ids.filter(id => id !== col.id) })
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
                    value={metadata.sources}
                    onChange={(e) => setMetadata({ ...metadata, sources: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Durum</label>
                  <select
                    value={metadata.status}
                    onChange={(e) => setMetadata({ ...metadata, status: e.target.value as 'draft' | 'published' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayında</option>
                  </select>
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
                          const fileExt = file.name.split('.').pop()
                          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                          const filePath = fileName

                          const { error: uploadError } = await supabase.storage
                            .from('thumbs')
                            .upload(filePath, file, { upsert: false })

                          if (uploadError) {
                            setError(`Yükleme hatası: ${uploadError.message}`)
                            setUploading(false)
                            return
                          }

                          const { data: { publicUrl } } = supabase.storage
                            .from('thumbs')
                            .getPublicUrl(filePath)

                          setMetadata({ ...metadata, thumbnail_file: filePath })
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
                    {metadata.thumbnail_file && (
                      <button
                        type="button"
                        onClick={() => {
                          setMetadata({ ...metadata, thumbnail_file: '' })
                          setThumbnailPreview(null)
                        }}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Thumbnail'i kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-sm font-semibold mb-4">Önizleme</h3>
                {chartSpec ? (
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <Chart spec={chartSpec} />
                  </div>
                ) : (
                  <div className="bg-white p-12 rounded border border-gray-200 text-center text-gray-400">
                    <p className="text-sm">Veri ve sütun eşleştirmesi tamamlandığında önizleme burada görünecek</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 border-t pt-6">
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
        </>
      )}
    </form>
  )
}
