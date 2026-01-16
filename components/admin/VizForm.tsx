'use client'

/**
 * VizForm: Publication-Grade Time Series Editor
 * 
 * This component implements a COMPLETE editorial workflow for
 * "Zaman Serisi (Çizgi + Nokta)" charts ONLY.
 * 
 * Features:
 * - Multi-series support (critical for comparisons)
 * - Perfect draft persistence
 * - OWID-quality output
 * - Progressive disclosure
 * - Turkish UI throughout
 */

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'
import { Visualization } from '@/types'
import {
  CHART_TEMPLATES,
  DEFAULT_TEMPLATE_ID,
  ChartTemplateId
} from '@/lib/chart-template-registry'
import {
  generateChartSpec,
  EditorialOptions,
  ColorMode,
  LabelSize,
  NumberFormat,
  LogoSize,
  BarLabelPlacement,
  BarLabelSource
} from '@/lib/chart-templates'
import { parseCSV, getSampleCSV } from '@/lib/csv-parser'
import Chart from '@/components/Chart'

interface VizFormProps {
  visualization?: Visualization
  collections: Array<{ id: string; title: string }>
}

type ActiveTab = 'data' | 'preview'
type EmbedRatio = 'responsive' | '16:9' | '1:1'

// Editor state for draft persistence
interface EditorState {
  rawDataInput: string
  columnMappings: {
    time: string
    value: string[]
  }
  editorialSettings: EditorialOptions
}

export default function VizForm({ visualization, collections }: VizFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])
  
  // Chart template selection (new visualizations only)
  const [selectedTemplateId, setSelectedTemplateId] = useState<ChartTemplateId | ''>(() => {
    const existingTemplateId = (visualization?.chart_spec as any)?._templateId as ChartTemplateId | undefined
    if (existingTemplateId) return existingTemplateId
    if (visualization) return DEFAULT_TEMPLATE_ID
    return ''
  })
  const [hasChosenTemplate, setHasChosenTemplate] = useState<boolean>(() => !!visualization)

  const isBarTemplate = selectedTemplateId === 'bar'
  const isDotPlotTemplate = selectedTemplateId === 'dot-plot'
  const isStackedAreaTemplate = selectedTemplateId === 'stacked-area'
  const isSlopeChartTemplate = selectedTemplateId === 'slope-chart'
  const isHistogramTemplate = selectedTemplateId === 'histogram'
  const activeTemplateId = isBarTemplate 
    ? 'category-bar' 
    : isDotPlotTemplate 
    ? 'dot-plot'
    : isStackedAreaTemplate
    ? 'stacked-area'
    : isSlopeChartTemplate
    ? 'slope-chart'
    : isHistogramTemplate
    ? 'histogram'
    : 'time-series-line'

  // Active tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('data')
  
  // Data state
  const [dataInput, setDataInput] = useState('')
  const [parsedData, setParsedData] = useState<Array<Record<string, any>> | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [detectedTimeColumn, setDetectedTimeColumn] = useState<string | null>(null)
  
  // Column mappings (specific to time series)
  const [timeColumn, setTimeColumn] = useState<string>('')
  const [valueColumns, setValueColumns] = useState<string[]>([])
  const [barGroupByColumn, setBarGroupByColumn] = useState<string>('')
  
  // Editorial settings
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [editorialSettings, setEditorialSettings] = useState<EditorialOptions>({
    title: '',
    subtitle: '',
    topNote: '',
    bottomNote: '',
    xAxisLabel: '',
    yAxisLabel: '',
    unit: '',
    numberFormat: 'comma',
    colorMode: 'multi-color',
    showLabels: true,
    labelSize: 'medium',
    showLegend: true,
    showDatumLogo: false,
    datumLogoSize: 'small',
    accessibilityDescription: '',
    barLabelPlacement: 'off',
    barLabelSource: 'none',
    barYAxisMode: 'auto',
    lineEndLabels: false
  })
  
  // Metadata (parse source link if exists)
  const parsedSourceData = useMemo(() => {
    if (!visualization?.sources || visualization.sources.length === 0) {
      return { sourcesText: '', sourceLink: '' }
    }
    
    const sourcesArray = [...visualization.sources]
    const firstSource = sourcesArray[0] || ''
    
    // Check if first source has link (format: "text|url")
    if (firstSource.includes('|')) {
      const [text, link] = firstSource.split('|')
      sourcesArray[0] = text.trim()
      return {
        sourcesText: sourcesArray.join('\n'),
        sourceLink: link.trim()
      }
    }
    
    return {
      sourcesText: sourcesArray.join('\n'),
      sourceLink: ''
    }
  }, [visualization?.sources])
  
  const [metadata, setMetadata] = useState({
    title: visualization?.title || '',
    slug: visualization?.slug || '',
    slugManuallyEdited: false,
    summary: visualization?.summary || '',
    tags: visualization?.tags.join(', ') || '',
    collection_ids: visualization?.collection_ids || [],
    sources: parsedSourceData.sourcesText,
    sourceLink: parsedSourceData.sourceLink,
    status: visualization?.status || 'draft' as 'draft' | 'published',
    thumbnail_file: visualization?.thumbnail_file || '',
  })
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    visualization?.thumbnail_file 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbs/${visualization.thumbnail_file}` 
      : null
  )
  
  // Embed code generator state
  const [embedRatio, setEmbedRatio] = useState<EmbedRatio>('responsive')
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false)

  // RESTORE DRAFT STATE
  useEffect(() => {
    if (visualization && visualization.chart_spec && typeof visualization.chart_spec === 'object') {
      const spec = visualization.chart_spec as any
      
      if (spec._editorState) {
        const state = spec._editorState as EditorState
        
        // Restore raw data
        if (state.rawDataInput) {
          setDataInput(state.rawDataInput)
        }
        
        // Restore column mappings
        if (state.columnMappings) {
          setTimeColumn(state.columnMappings.time || '')
          setValueColumns(state.columnMappings.value || [])
        }
        
        // Restore editorial settings
        if (state.editorialSettings) {
          setEditorialSettings(state.editorialSettings)
        }
        // Restore bar group-by (optional)
        const storedGroupBy = (state as any).barGroupBy as string | undefined
        if (storedGroupBy) {
          setBarGroupByColumn(storedGroupBy)
        }
      }
    }
  }, [visualization])

  // AUTO-GENERATE SLUG
  useEffect(() => {
    if (!metadata.slugManuallyEdited && metadata.title) {
      const autoSlug = metadata.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\süığçöş-]/g, '')
        .replace(/[üü]/g, 'u')
        .replace(/[ıi]/g, 'i')
        .replace(/[ğg]/g, 'g')
        .replace(/[çc]/g, 'c')
        .replace(/[öo]/g, 'o')
        .replace(/[şs]/g, 's')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 100)
      
      setMetadata(prev => ({ ...prev, slug: autoSlug }))
    }
  }, [metadata.title, metadata.slugManuallyEdited])

  // DETECT TIME COLUMN
  useEffect(() => {
    if (columns.length > 0) {
      const timeKeywords = ['yıl', 'year', 'tarih', 'date', 'ay', 'month', 'zaman', 'time', 'sene']
      const detected = columns.find(col => 
        timeKeywords.some(keyword => col.toLowerCase().includes(keyword))
      )
      setDetectedTimeColumn(detected || null)
      
      // Auto-suggest time column
      if (detected && !timeColumn) {
        setTimeColumn(detected)
      }
    }
  }, [columns, timeColumn])

  // CRITICAL: Remove timeColumn from valueColumns if accidentally included
  useEffect(() => {
    if (timeColumn && valueColumns.includes(timeColumn)) {
      setValueColumns(valueColumns.filter(col => col !== timeColumn))
    }
  }, [timeColumn, valueColumns])

  // CRITICAL FIX: Auto-detect and assign single numeric column for histogram
  useEffect(() => {
    if (!isHistogramTemplate || !parsedData || parsedData.length === 0 || columns.length === 0) {
      return
    }

    // If histogram and no value column selected yet, try to auto-detect
    if (valueColumns.length === 0) {
      // For histogram: if exactly one column exists, treat it as the value column
      if (columns.length === 1) {
        const singleColumn = columns[0]
        // Check if the column contains numeric data
        const sampleValues = parsedData.slice(0, 10).map(row => row[singleColumn]).filter(v => v !== null && v !== undefined && v !== '')
        const isNumeric = sampleValues.length > 0 && sampleValues.every(v => {
          const num = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : Number(v)
          return !isNaN(num) && isFinite(num)
        })
        
        if (isNumeric) {
          // Auto-assign single numeric column to valueColumns
          setValueColumns([singleColumn])
        }
      } else if (columns.length > 1) {
        // Multiple columns: find first numeric column that's not the time column
        const numericColumn = columns.find(col => {
          if (col === timeColumn) return false
          const sampleValues = parsedData.slice(0, 10).map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '')
          if (sampleValues.length === 0) return false
          return sampleValues.every(v => {
            const num = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : Number(v)
            return !isNaN(num) && isFinite(num)
          })
        })
        
        if (numericColumn) {
          setValueColumns([numericColumn])
        }
      }
    }
  }, [isHistogramTemplate, parsedData, columns, valueColumns.length, timeColumn])
  
  // Keep bar group-by valid
  useEffect(() => {
    if (!isBarTemplate) return
    if (barGroupByColumn && (barGroupByColumn === timeColumn || !columns.includes(barGroupByColumn))) {
      setBarGroupByColumn('')
    }
  }, [isBarTemplate, barGroupByColumn, timeColumn, columns])

  // PARSE DATA
  useEffect(() => {
    if (!dataInput.trim()) {
      setParsedData(null)
      setColumns([])
      setWarnings([])
      return
    }

    const result = parseCSV(dataInput)
    if (result.success && result.data && result.columns) {
      setParsedData(result.data)
      setColumns(result.columns)
      setWarnings(result.error ? [result.error] : [])
      
      // Auto-suggest value columns (numeric columns, excluding time)
      if (result.columns.length > 0 && valueColumns.length === 0) {
        const numericColumns = result.columns.filter((col, idx) => {
          if (col === detectedTimeColumn) return false
          if (result.data && result.data.length > 0) {
            const firstValue = result.data[0][col]
            return typeof firstValue === 'number' || !isNaN(Number(firstValue))
          }
          return idx > 0
        })
        
        if (numericColumns.length > 0) {
          setValueColumns([numericColumns[0]])
        }
      }
    } else {
      setParsedData(null)
      setColumns([])
      if (result.error) {
        setWarnings([result.error])
      }
    }
  }, [dataInput, detectedTimeColumn, valueColumns.length])

  // GENERATE CHART SPEC
  // CRITICAL: Always return a valid spec to prevent preview unmounting
  // Use fallback safe spec when data is invalid instead of null
  const chartSpec = useMemo(() => {
    // CRITICAL FIX: For histogram, single numeric column is valid (no timeColumn required)
    // Check if we have valid data for chart generation
    const hasValidData = parsedData && parsedData.length > 0
    // For histogram: only need valueColumns (timeColumn is optional)
    // For other charts: need timeColumn
    const hasRequiredColumns = isHistogramTemplate 
      ? valueColumns.length > 0  // Histogram only needs value column
      : timeColumn  // Other charts need time column
    
    // Create a fallback safe spec for invalid states (prevents unmounting)
    // CRITICAL: This must be a valid Vega-Lite spec that renders without errors
    const createFallbackSpec = (message: string) => ({
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 400,
      padding: { left: 60, right: 20, top: 30, bottom: 40 },
      background: 'white',
      data: { values: [{ message }] },
      mark: {
        type: 'text',
        fontSize: 14,
        color: '#666',
        align: 'center',
        baseline: 'middle',
        dy: 200 // Center vertically
      },
      encoding: {
        text: { field: 'message', type: 'nominal' }
      },
      // Mark as invalid for UI warning display
      _isInvalid: true,
      _invalidReason: message
    })

    // CRITICAL FIX BUG 1: For histogram, keep histogram spec structure even when incomplete
    // Replace only data values with empty array - do NOT switch to generic bar spec
    // CRITICAL: Single numeric column is valid for histogram - only check if valueColumns exists
    if (isHistogramTemplate && (!parsedData || parsedData.length === 0 || valueColumns.length === 0)) {
      // Create histogram spec structure with empty data (prevents component remount)
      const valueColumn = valueColumns[0] || 'value'
      const labelSize = 12
      const numberFormat = editorialSettings.numberFormat === 'dot' ? '.2f' : ',.2f'
      
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 'container',
        height: 400,
        padding: { left: 60, right: 20, top: 30, bottom: 40 },
        background: 'white',
        data: { values: [] }, // Empty data, but histogram structure maintained
        mark: {
          type: 'bar',
          cornerRadius: 0,
          color: '#3b82f6',
          stroke: '#3b82f6',
          strokeWidth: 0
        },
        encoding: {
          x: {
            field: valueColumn,
            type: 'quantitative',
            bin: { maxbins: 15, nice: true },
            title: valueColumn,
            scale: { nice: true, padding: 0 }
          },
          y: {
            aggregate: 'count',
            type: 'quantitative',
            title: 'Frekans',
            scale: { zero: true, nice: true }
          }
        },
        _isInvalid: true,
        _invalidReason: 'Histogram için veri ve değer sütunu gereklidir.'
      }
    }

    // Return fallback if data/columns are missing (non-histogram charts)
    if (!hasValidData || !hasRequiredColumns) {
      if (!isHistogramTemplate && !timeColumn) {
        return createFallbackSpec('Zaman sütunu seçilmelidir.')
      }
      if (valueColumns.length === 0) {
        return createFallbackSpec('En az bir değer sütunu seçilmelidir.')
      }
      return createFallbackSpec('Grafik verisi hazırlanıyor...')
    }

    try {
      const spec = generateChartSpec(
        activeTemplateId,
        parsedData,
        {
          time: timeColumn,
          value: valueColumns,
          ...((isBarTemplate || isDotPlotTemplate) && barGroupByColumn ? { groupBy: barGroupByColumn } : {})
        },
        editorialSettings
      )

      // Add editor state for persistence
      const specWithState = {
        ...spec,
        _templateId: selectedTemplateId || DEFAULT_TEMPLATE_ID,
        _editorState: {
          rawDataInput: dataInput,
          columnMappings: {
            time: timeColumn,
            value: valueColumns
          },
          editorialSettings
        } as EditorState,
        // Mark as valid
        _isInvalid: false
      }
      if (isBarTemplate && barGroupByColumn) {
        ;(specWithState._editorState as any).barGroupBy = barGroupByColumn
      }
      return specWithState
    } catch (err) {
      console.error('Chart generation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Grafik oluşturulurken bir hata oluştu.'
      return createFallbackSpec(errorMessage)
    }
    // CRITICAL FIX ISSUE 1: Stabilize dependencies to prevent spec recreation
    // Only recreate spec when actual data/content changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Use stable primitives: only recreate when actual values change
    parsedData?.length, // Use length as proxy for data presence
    parsedData?.[0] ? JSON.stringify(Object.keys(parsedData[0])) : '', // Column names
    timeColumn,
    valueColumns.length ? valueColumns.join(',') : '', // Convert array to stable string
    editorialSettings.title,
    editorialSettings.subtitle,
    editorialSettings.xAxisLabel,
    editorialSettings.yAxisLabel,
    editorialSettings.histogramBinCount,
    editorialSettings.showDatumLogo,
    editorialSettings.datumLogoSize,
    editorialSettings.numberFormat,
    dataInput.length, // Use length as proxy
    selectedTemplateId,
    activeTemplateId,
    isBarTemplate,
    isHistogramTemplate,
    barGroupByColumn
  ])

  // DATA SUMMARY
  const dataSummary = useMemo(() => {
    if (!parsedData || parsedData.length === 0) return null
    
    const usedColumns = new Set([timeColumn, ...valueColumns])
    const unusedColumns = columns.filter(col => !usedColumns.has(col))
    
    return {
      rows: parsedData.length,
      columns: columns.length,
      detectedTime: detectedTimeColumn,
      unusedColumns
    }
  }, [parsedData, columns, timeColumn, valueColumns, detectedTimeColumn])

  // VALIDATE
  const validate = (): { errors: string[]; warnings: string[] } => {
    const errors: string[] = []
    const validationWarnings: string[] = []
    const categoryCount = timeColumn && parsedData
      ? new Set(parsedData.map(row => row[timeColumn]).filter(Boolean)).size
      : 0
    
    // Required fields
    if (!metadata.title.trim()) {
      errors.push('Başlık gereklidir')
    }
    
    if (!metadata.sources.trim()) {
      errors.push('Kaynak gereklidir')
    }
    
    if (!parsedData || parsedData.length === 0) {
      errors.push('Veri girilmelidir')
    } else {
      // Check for empty values
      const hasEmptyValues = parsedData.some(row => {
        const timeValue = row[timeColumn]
        const valueValues = valueColumns.map(col => row[col])
        return !timeValue || valueValues.some(v => v === '' || v === null || v === undefined)
      })
      
      if (hasEmptyValues) {
        validationWarnings.push('Bazı değerler eksik - grafikte boşluk görünecek')
      }
    }
    
    // CRITICAL: Histogram does not require timeColumn (it's optional for filtering only)
    if (!timeColumn && !isHistogramTemplate) {
      errors.push((isBarTemplate || isDotPlotTemplate) ? 'Kategori sütunu seçilmelidir' : (isStackedAreaTemplate ? 'Zaman sütunu seçilmelidir' : 'Zaman sütunu seçilmelidir'))
    }
    
    if (isDotPlotTemplate) {
      if (valueColumns.length === 0) {
        errors.push('En az bir değer sütunu seçilmelidir')
      }
      const categoryCount = parsedData 
        ? new Set(parsedData.map(row => row[timeColumn]).filter(Boolean)).size
        : 0
      if (categoryCount > 0 && categoryCount < 2) {
        errors.push('Nokta grafiği için en az 2 kategori gereklidir')
      }
    } else if (isBarTemplate) {
      const seriesCount = barGroupByColumn && parsedData
        ? new Set(parsedData.map(row => row[barGroupByColumn]).filter(Boolean)).size
        : valueColumns.length

      if (valueColumns.length === 0) {
        errors.push('En az bir değer sütunu seçilmelidir')
      }
      if (seriesCount > 0 && seriesCount < 3) {
        validationWarnings.push('Editöryel olarak 3 veya daha fazla seri önerilir.')
      }
      if (barGroupByColumn && valueColumns.length > 1) {
        validationWarnings.push('Grup boyutu seçiliyken tek değer sütunu önerilir.')
      }
      if (categoryCount > 0 && categoryCount < 3) {
        errors.push('Kategori sütununda en az 3 farklı değer olmalıdır')
      }
    } else {
      if (valueColumns.length === 0) {
        errors.push('En az bir değer sütunu seçilmelidir')
      }
      
      // Slope chart specific validation
      // CRITICAL: For slope charts, time points come from VALUE COLUMN HEADERS, not from data rows
      // Count value columns, not unique time values in rows
      if (isSlopeChartTemplate) {
        if (valueColumns.length === 0) {
          errors.push('Eğim grafiği için en az 2 değer sütunu (zaman noktası) gereklidir.')
        } else if (valueColumns.length < 2) {
          validationWarnings.push('Eğim grafiği için en az 2 değer sütunu gereklidir. Her sütun bir zaman noktasını temsil eder.')
        } else if (valueColumns.length > 2) {
          // Only show as informational note, not a blocking warning
          // This will be shown in the UI helper area
        }
      }
      
      // Histogram specific validation
      // CRITICAL: Histogram uses exactly ONE numeric value column
      // Additional numeric columns are ignored (editor chooses ONE)
      if (isHistogramTemplate) {
        if (valueColumns.length === 0) {
          errors.push('Histogram için en az bir sayısal değer sütunu seçilmelidir.')
        } else if (valueColumns.length > 1) {
          validationWarnings.push('Histogram için birden fazla değer sütunu seçildi. İlk sütun kullanılacak, diğerleri yok sayılacak.')
        }
      }
    }
    
    // Unused columns warning
    if (dataSummary && dataSummary.unusedColumns.length > 0 && dataSummary.unusedColumns.length < columns.length) {
      validationWarnings.push(`Kullanılmayan ${dataSummary.unusedColumns.length} sütun var: ${dataSummary.unusedColumns.slice(0, 3).join(', ')}${dataSummary.unusedColumns.length > 3 ? '...' : ''}`)
    }
    
    return { errors, warnings: validationWarnings }
  }

  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setWarnings([])

    const validation = validate()
    if (validation.errors.length > 0) {
      setError(validation.errors.join('. '))
      return
    }
    
    if (validation.warnings.length > 0) {
      setWarnings(validation.warnings)
    }

    if (!chartSpec) {
      setError('Grafik oluşturulamadı. Lütfen tüm alanları kontrol edin.')
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
        setError(`Yetki hatası: '${userRole || 'yok'}' rolü ile yayın yapamazsınız.`)
        setLoading(false)
        return
      }

      // Prepare sources with optional link (format: "text|url")
      const sourcesArray = metadata.sources.split('\n').filter(Boolean)
      if (metadata.sourceLink && metadata.sourceLink.trim()) {
        // Append link to first source
        if (sourcesArray.length > 0) {
          sourcesArray[0] = `${sourcesArray[0]}|${metadata.sourceLink.trim()}`
        }
      }
      
      const data: any = {
        title: metadata.title,
        slug: metadata.slug || metadata.title.toLowerCase().replace(/\s+/g, '-'),
        summary: metadata.summary || '',
        tags: metadata.tags.split(',').map(t => t.trim()).filter(Boolean),
        collection_ids: metadata.collection_ids,
        sources: sourcesArray,
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
        setError(`Veritabanı hatası: ${result.error.message}`)
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

  if (!visualization && !hasChosenTemplate) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Grafik Türünü Seç</h2>
          <p className="text-sm text-gray-600">
            Oluşturmak istediğiniz görselleştirme türünü seçin.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {CHART_TEMPLATES.map((template) => {
            const isDisabled = template.status !== 'active'
            return (
              <button
                key={template.id}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled) {
                    setSelectedTemplateId(template.id)
                    setHasChosenTemplate(true)
                  }
                }}
                className={`border rounded-lg p-5 text-left transition-colors ${
                  isDisabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-black hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold">{template.label}</span>
                  {isDisabled && (
                    <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Yakında
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold mb-2">
          {isBarTemplate 
            ? 'Kategori Karşılaştırma (Dikey Bar)' 
            : isDotPlotTemplate 
            ? 'Nokta Grafiği (Dot Plot)'
            : isStackedAreaTemplate
            ? 'Yığılmış Alan Grafiği (Stacked Area)'
            : isSlopeChartTemplate
            ? 'Eğim Grafiği (Slope Chart)'
            : isHistogramTemplate
            ? 'Histogram'
            : 'Zaman Serisi (Çizgi + Nokta)'}
        </h1>
        <p className="text-sm text-gray-600">
          {isBarTemplate
            ? 'Kategorileri karşılaştırmak için. Yıllar gibi birden fazla değeri yan yana gösterebilirsiniz.'
            : isDotPlotTemplate
            ? 'Tek bir zaman noktasında birden fazla varlığı karşılaştırmak için.'
            : isStackedAreaTemplate
            ? 'Zaman içinde serilerin kümülatif katkısını göstermek için. Her seri toplam yığına katkıda bulunur.'
            : isSlopeChartTemplate
            ? 'İki zaman noktası arasındaki değişimi karşılaştırmak için. Her varlık için başlangıç ve bitiş noktaları arasında bir çizgi gösterilir.'
            : isHistogramTemplate
            ? 'Tek bir sayısal değişkenin dağılımını göstermek için. Verilerin aralıklar halinde frekansını gösterir.'
            : 'Aylar veya yıllar içindeki değişimi göstermek için. Birden fazla veriyi karşılaştırabilirsiniz.'}
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'data'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Veri
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Önizleme
          </button>
        </nav>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'data' ? (
        <div className="space-y-10">
          {/* DATA INPUT */}
          <section>
            <div className="mb-4">
              <label className="block text-base font-semibold mb-2">
                Veri Girişi
              </label>
              <p className="text-sm text-gray-600">
                Excel veya Google Sheets'ten kopyalayıp yapıştırın. İlk satır sütun başlıkları olmalı.
              </p>
            </div>
            
            <textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder={getSampleCSV()}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-y"
              rows={14}
            />
            
            {/* DATA SUMMARY */}
            {dataSummary && (
              <div className="mt-4 p-5 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-semibold mb-3">✓ Veri başarıyla algılandı</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Satır sayısı:</span>
                    <span className="ml-2 font-medium text-green-900">{dataSummary.rows}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Sütun sayısı:</span>
                    <span className="ml-2 font-medium text-green-900">{dataSummary.columns}</span>
                  </div>
                  {dataSummary.detectedTime && (
                    <div className="col-span-2">
                      <span className="text-green-700">Algılanan zaman sütunu:</span>
                      <span className="ml-2 font-medium text-green-900">{dataSummary.detectedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {warnings.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                {warnings.map((w, i) => (
                  <p key={i} className="text-sm text-amber-800">{w}</p>
                ))}
              </div>
            )}
          </section>

          {/* COLUMN MAPPING */}
          {columns.length > 0 && (
            <section className="border-t pt-8">
              <div className="mb-6">
                <h2 className="text-base font-semibold mb-2">Sütun Eşleştirme</h2>
                <p className="text-sm text-gray-600">
                  Hangi sütunların kullanılacağını seçin. Önerilen seçimler otomatik işaretlenmiştir.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* TIME COLUMN */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <label className="block text-sm font-semibold mb-3">
                    {isBarTemplate || isDotPlotTemplate 
                      ? 'Kategori Sütunu *' 
                      : 'Zaman Sütunu *'}
                    <span className="block text-xs font-normal text-gray-600 mt-1">
                      {isBarTemplate
                        ? 'Kategori adı içeren sütun (ör. Ülke, Şehir)'
                        : isDotPlotTemplate
                        ? 'Varlık adı içeren sütun (ör. Ülke, Kurum)'
                        : isStackedAreaTemplate
                        ? 'Tarih veya yıl bilgisi içeren sütun (zaman ekseni)'
                        : 'Tarih veya yıl bilgisi içeren sütun'}
                    </span>
                  </label>
                  <select
                    value={timeColumn}
                    onChange={(e) => setTimeColumn(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    required
                  >
                    <option value="">Sütun seçin...</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col} {col === detectedTimeColumn && '(önerilen)'}
                      </option>
                    ))}
                  </select>
                </div>

                {(isBarTemplate || isDotPlotTemplate) && (
                  <div className="bg-gray-50 p-5 rounded-lg">
                    <label className="block text-sm font-semibold mb-3">
                      {isDotPlotTemplate ? 'Zaman Filtresi (Opsiyonel)' : 'Grup Boyutu (Opsiyonel)'}
                      <span className="block text-xs font-normal text-gray-600 mt-1">
                        {isDotPlotTemplate
                          ? 'Tek bir zaman noktasını seçmek için (ör. Yıl, Ay)'
                          : 'Zaman veya dönem sütunu (ör. Yıl, Ay)'}
                      </span>
                    </label>
                    <select
                      value={barGroupByColumn}
                      onChange={(e) => setBarGroupByColumn(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    >
                      <option value="">Seçim yok</option>
                      {columns.filter(col => col !== timeColumn).map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* VALUE COLUMNS (MULTI-SELECT) */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <label className="block text-sm font-semibold mb-3">
                    Değer Sütunları *
                    <span className="block text-xs font-normal text-gray-600 mt-1">
                      {isDotPlotTemplate
                        ? 'Ölçüm sütunu (ilk seçilen sütun kullanılır)'
                        : isBarTemplate
                        ? (barGroupByColumn
                          ? 'Seçilen ölçüm sütunu (tek sütun önerilir)'
                          : 'Karşılaştırılacak sayısal değerler - Birden fazla seçebilirsiniz')
                        : 'Karşılaştırılacak sayısal değerler - Birden fazla seçebilirsiniz'}
                    </span>
                  </label>
                  
                  {timeColumn && (
                    <p className="text-xs text-gray-500 mb-3 italic">
                      💡 {(isBarTemplate || isDotPlotTemplate) ? 'Kategori sütunu karşılaştırmaya dahil edilemez.' : (isStackedAreaTemplate ? 'Zaman sütunu seri olarak görünemez. Her seri yığına katkıda bulunur.' : 'Zaman sütunu karşılaştırmaya dahil edilemez.')}
                    </p>
                  )}
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {columns.filter(col => col !== timeColumn).map((col) => (
                      <label
                        key={col}
                        className="flex items-center p-3 hover:bg-white rounded border border-transparent hover:border-gray-200 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={valueColumns.includes(col)}
                          onChange={(e) => {
                            // CRITICAL: Never allow timeColumn to be added as a value column
                            if (col === timeColumn) return
                            
                            if (e.target.checked) {
                              setValueColumns([...valueColumns, col])
                            } else {
                              setValueColumns(valueColumns.filter(c => c !== col))
                            }
                          }}
                          className="mr-3 h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm flex-1">{col}</span>
                        {valueColumns.length === 1 && valueColumns[0] === col && (
                          <span className="text-xs text-green-600 font-medium">(önerilen)</span>
                        )}
                      </label>
                    ))}
                  </div>
                  
                  {valueColumns.length > 1 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                      <strong>{valueColumns.length} seri</strong> seçildi. {isBarTemplate ? 'Her seri farklı bir bar grubu olarak görünecek.' : isStackedAreaTemplate ? 'Her seri yığına katkıda bulunacak.' : isSlopeChartTemplate ? `Her sütun bir zaman noktasını temsil eder. İlk (${valueColumns[0]}) ve son (${valueColumns[valueColumns.length - 1]}) sütunlar kullanılacak.` : 'Her seri farklı bir çizgi olarak görünecek.'}
                    </div>
                  )}
                  {isSlopeChartTemplate && valueColumns.length > 2 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      ℹ️ Eğim grafiği için tam olarak 2 zaman noktası önerilir. {valueColumns.length} sütun seçildi. İlk ve son sütunlar kullanılacak.
                    </div>
                  )}
                  
                  {/* READABILITY WARNING FOR > 4 SERIES */}
                  {!isBarTemplate && !isStackedAreaTemplate && valueColumns.length > 4 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      ⚠️ Çok fazla seri okunabilirliği azaltabilir.
                    </div>
                  )}
                  {/* Stacked area specific warning */}
                  {isStackedAreaTemplate && valueColumns.length > 6 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      ⚠️ Çok fazla seri yığılmış alan grafiğinde okunabilirliği azaltabilir.
                    </div>
                  )}

                  {isBarTemplate && !barGroupByColumn && valueColumns.length > 0 && valueColumns.length < 3 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      ⚠️ Editöryel olarak 3 veya daha fazla seri önerilir.
                    </div>
                  )}
                  {isBarTemplate && barGroupByColumn && parsedData && (
                    (() => {
                      const seriesCount = new Set(parsedData.map(row => row[barGroupByColumn]).filter(Boolean)).size
                      return seriesCount > 0 && seriesCount < 3 ? (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                          ⚠️ Editöryel olarak 3 veya daha fazla seri önerilir.
                        </div>
                      ) : null
                    })()
                  )}
                  {isBarTemplate && barGroupByColumn && valueColumns.length > 1 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                      ℹ️ Grup boyutu seçiliyken tek değer sütunu önerilir.
                    </div>
                  )}
                  {isBarTemplate && timeColumn && parsedData && (
                    (() => {
                      const categoryCount = new Set(parsedData.map(row => row[timeColumn]).filter(Boolean)).size
                      return categoryCount > 0 && categoryCount < 3 ? (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                          ⚠️ Kategori sütununda en az 3 farklı değer olmalıdır.
                        </div>
                      ) : null
                    })()
                  )}
                </div>
              </div>
            </section>
          )}

          {/* EDITORIAL SETTINGS */}
          <section className="border-t pt-8">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-base font-semibold mb-6 hover:text-black"
            >
              <span>Gelişmiş Ayarlar (Opsiyonel)</span>
              <span className="text-xl">{showAdvanced ? '−' : '+'}</span>
            </button>
            
            {showAdvanced && (
              <div className="space-y-6 pl-6 border-l-2 border-gray-200">
                <div>
                  <label className="block text-sm font-medium mb-2">Grafik Başlığı</label>
                  <input
                    type="text"
                    value={editorialSettings.title || ''}
                    onChange={(e) => setEditorialSettings({ ...editorialSettings, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Opsiyonel - grafik içinde gösterilecek başlık"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Alt Başlık</label>
                  <input
                    type="text"
                    value={editorialSettings.subtitle || ''}
                    onChange={(e) => setEditorialSettings({ ...editorialSettings, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Opsiyonel"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Renk Modu</label>
                    <select
                      value={editorialSettings.colorMode || 'multi-color'}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, colorMode: e.target.value as ColorMode })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="monochrome">Siyah-beyaz</option>
                      <option value="single-color">Tek renk tonları</option>
                      <option value="multi-color">Çoklu renkler</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Sayı Formatı</label>
                    <select
                      value={editorialSettings.numberFormat || 'comma'}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, numberFormat: e.target.value as NumberFormat })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="comma">1,234 (virgülle)</option>
                      <option value="dot">1.234 (noktayla)</option>
                    </select>
                  </div>
                </div>
                
                {valueColumns.length > 1 && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showLegend"
                      checked={editorialSettings.showLegend !== false}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, showLegend: e.target.checked })}
                      className="mr-3 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="showLegend" className="text-sm font-medium">
                      Legend Göster (Seri adlarını göster)
                    </label>
                  </div>
                )}

                {!isBarTemplate && !isStackedAreaTemplate && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="lineEndLabels"
                      checked={editorialSettings.lineEndLabels === true}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, lineEndLabels: e.target.checked })}
                      className="mr-3 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="lineEndLabels" className="text-sm font-medium">
                      Çizgi sonunda etiket göster
                    </label>
                  </div>
                )}
                {isStackedAreaTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Eksen Yönlendirmesi</label>
                    <select
                      value={editorialSettings.stackedAreaOrientation || 'horizontal'}
                      onChange={(e) => setEditorialSettings({
                        ...editorialSettings,
                        stackedAreaOrientation: e.target.value as 'horizontal' | 'vertical'
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="horizontal">Yatay (X = Zaman, Y = Değer)</option>
                      <option value="vertical">Dikey (X = Değer, Y = Zaman)</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      Grafiğin yönlendirmesini seçin. Varsayılan: Yatay.
                    </p>
                  </div>
                )}
                {isStackedAreaTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">X Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.xAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, xAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Yıl"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      X ekseni başlığını özelleştirin. Boş bırakılırsa zaman sütunu adı kullanılır.
                    </p>
                  </div>
                )}
                {isStackedAreaTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Y Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.yAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, yAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Enerji Üretimi (TWh)"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Y ekseni başlığını özelleştirin. Boş bırakılırsa 'Değer' veya birim kullanılır. Seri adları asla kullanılmaz.
                    </p>
                  </div>
                )}
                {isStackedAreaTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Etiketler (V1 - Sınırlı)</label>
                    <select
                      value={editorialSettings.barLabelSource || 'none'}
                      onChange={(e) => {
                        const newSource = e.target.value as 'none' | 'value'
                        setEditorialSettings({
                          ...editorialSettings,
                          barLabelSource: newSource,
                          barLabelPlacement: newSource === 'none' ? 'off' : 'auto'
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="none">Kapalı (V1 önerilir)</option>
                      <option value="value">Değerleri göster</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      V1'de yığılmış alan grafikleri için etiket sistemi sınırlıdır. Legend birincil tanımlama mekanizmasıdır.
                    </p>
                  </div>
                )}
                {isSlopeChartTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Eksen Yönlendirmesi</label>
                    <select
                      value={editorialSettings.slopeChartOrientation || 'horizontal'}
                      onChange={(e) => setEditorialSettings({
                        ...editorialSettings,
                        slopeChartOrientation: e.target.value as 'horizontal' | 'vertical'
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="horizontal">Yatay (X = Zaman, Y = Değer)</option>
                      <option value="vertical">Dikey (X = Değer, Y = Zaman)</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      Grafiğin yönlendirmesini seçin. Varsayılan: Yatay.
                    </p>
                  </div>
                )}
                {isSlopeChartTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">X Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.xAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, xAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Yıl"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      X ekseni başlığını özelleştirin. Boş bırakılırsa zaman sütunu adı kullanılır.
                    </p>
                  </div>
                )}
                {isSlopeChartTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Y Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.yAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, yAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Enerji Üretimi (TWh)"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Y ekseni başlığını özelleştirin. Boş bırakılırsa 'Değer' veya birim kullanılır. Seri adları asla kullanılmaz.
                    </p>
                  </div>
                )}
                {isSlopeChartTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Etiketler</label>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        id="slopeChartShowValueLabels"
                        checked={editorialSettings.slopeChartShowValueLabels === true}
                        onChange={(e) => setEditorialSettings({
                          ...editorialSettings,
                          slopeChartShowValueLabels: e.target.checked
                        })}
                        className="mr-3 h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="slopeChartShowValueLabels" className="text-sm font-medium">
                        Değerleri etiketlerde göster
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Etiketler her zaman seri adını gösterir. Bu seçenek ile değerler de eklenir.
                    </p>
                  </div>
                )}
                {isHistogramTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Bin Sayısı (Opsiyonel)</label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={editorialSettings.histogramBinCount || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
                        setEditorialSettings({
                          ...editorialSettings,
                          histogramBinCount: value && value > 0 ? value : undefined
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Varsayılan: 15"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Histogram için bin sayısını belirleyin. Boş bırakılırsa otomatik binning kullanılır (varsayılan: 15).
                    </p>
                  </div>
                )}
                {isHistogramTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">X Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.xAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, xAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Yaş"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      X ekseni başlığını özelleştirin. Boş bırakılırsa değer sütunu adı kullanılır.
                    </p>
                  </div>
                )}
                {isHistogramTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Y Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.yAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, yAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Frekans"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Y ekseni başlığını özelleştirin. Boş bırakılırsa 'Frekans' kullanılır.
                    </p>
                  </div>
                )}

                {isBarTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Label Modu</label>
                    <select
                      value={editorialSettings.barLabelSource || 'none'}
                      onChange={(e) => {
                        const newSource = e.target.value as BarLabelSource
                        setEditorialSettings({
                          ...editorialSettings,
                          barLabelSource: newSource,
                          barLabelPlacement: newSource === 'none' ? 'off' : 'auto'
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="none">Kapalı</option>
                      <option value="value">Değerleri göster</option>
                      <option value="series">Seri adlarını göster</option>
                      <option value="category">Kategori etiketleri</option>
                      <option value="value+series">Değer + seri adı</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      Etiketler her zaman gösterilir, grafik yoğunluğa göre uyarlanır.
                    </p>
                  </div>
                )}
                {isDotPlotTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Etiketler</label>
                    <select
                      value={editorialSettings.barLabelSource || 'none'}
                      onChange={(e) => {
                        const newSource = e.target.value as 'none' | 'value' | 'category'
                        setEditorialSettings({
                          ...editorialSettings,
                          barLabelSource: newSource,
                          barLabelPlacement: (newSource === 'none' ? 'off' : 'right') as BarLabelPlacement
                        })
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mb-3"
                    >
                      <option value="none">Kapalı</option>
                      <option value="value">Değerleri göster</option>
                      <option value="category">Kategori adlarını göster</option>
                    </select>
                    {editorialSettings.barLabelSource !== 'none' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Etiket Konumu</label>
                        <select
                          value={editorialSettings.barLabelPlacement || 'right'}
                          onChange={(e) => setEditorialSettings({
                            ...editorialSettings,
                            barLabelPlacement: e.target.value as BarLabelPlacement
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="right">Noktanın sağında</option>
                          <option value="left">Noktanın solunda</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
                {isDotPlotTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Eksen Yönlendirmesi</label>
                    <select
                      value={editorialSettings.dotPlotOrientation || 'horizontal'}
                      onChange={(e) => setEditorialSettings({
                        ...editorialSettings,
                        dotPlotOrientation: e.target.value as 'horizontal' | 'vertical'
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="horizontal">Yatay (X = Değer, Y = Kategori)</option>
                      <option value="vertical">Dikey (X = Kategori, Y = Değer)</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500">
                      Grafiğin yönlendirmesini seçin. Varsayılan: Yatay.
                    </p>
                  </div>
                )}
                {isDotPlotTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">X Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.xAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, xAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Nüfus (milyon)"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      X ekseni başlığını özelleştirin. Boş bırakılırsa varsayılan kullanılır.
                    </p>
                  </div>
                )}
                {isDotPlotTemplate && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Y Ekseni Başlığı (Opsiyonel)</label>
                    <input
                      type="text"
                      value={editorialSettings.yAxisLabel || ''}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, yAxisLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Örn: Bölge"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Y ekseni başlığını özelleştirin. Boş bırakılırsa kategori sütunu adı kullanılır.
                    </p>
                  </div>
                )}
                {isBarTemplate && (
                  <div>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="customYAxisLabel"
                        checked={editorialSettings.barYAxisMode === 'custom'}
                        onChange={(e) => setEditorialSettings({
                          ...editorialSettings,
                          barYAxisMode: e.target.checked ? 'custom' : 'auto'
                        })}
                        className="mr-3 h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="customYAxisLabel" className="text-sm font-medium">
                        Y ekseni başlığını özel olarak adlandır
                      </label>
                    </div>
                    {editorialSettings.barYAxisMode === 'custom' && (
                      <input
                        type="text"
                        value={editorialSettings.yAxisLabel || ''}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, yAxisLabel: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Örn: Enflasyon (%)"
                      />
                    )}
                  </div>
                )}
                
                {/* DATUM LOGO (FOOTER BRANDING) */}
                <div className="pt-4 border-t">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="showDatumLogo"
                      checked={editorialSettings.showDatumLogo || false}
                      onChange={(e) => setEditorialSettings({ ...editorialSettings, showDatumLogo: e.target.checked })}
                      className="mr-3 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="showDatumLogo" className="text-sm font-medium">
                      Datum logosunu göster
                    </label>
                  </div>
                  
                  {editorialSettings.showDatumLogo && (
                    <div className="ml-7">
                      <label className="block text-sm font-medium mb-2">Logo Boyutu</label>
                      <select
                        value={editorialSettings.datumLogoSize || 'small'}
                        onChange={(e) => setEditorialSettings({ ...editorialSettings, datumLogoSize: e.target.value as LogoSize })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        <option value="small">Küçük</option>
                        <option value="medium">Orta</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500">Logo grafiğin sağ alt köşesinde görünür</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Erişilebilirlik Açıklaması
                    <span className="block text-xs text-gray-500 mt-0.5">Ekran okuyucular için kısa açıklama</span>
                  </label>
                  <textarea
                    value={editorialSettings.accessibilityDescription || ''}
                    onChange={(e) => setEditorialSettings({ ...editorialSettings, accessibilityDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="Örn: 2020'den 2024'e Türkiye ve Almanya nüfus artışını gösteren çizgi grafik"
                  />
                </div>
              </div>
            )}
          </section>

          {/* PUBLICATION METADATA */}
          <section className="border-t pt-8">
            <h2 className="text-base font-semibold mb-6">Yayın Bilgileri</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Başlık *</label>
                <input
                  type="text"
                  value={metadata.title}
                  onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  placeholder="Görselleştirmenin başlığı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug
                  <span className="block text-xs text-gray-500 mt-0.5">URL'de görünecek benzersiz isim</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={metadata.slug}
                    onChange={(e) => setMetadata({ ...metadata, slug: e.target.value, slugManuallyEdited: true })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setMetadata({ ...metadata, slugManuallyEdited: false })}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                    title="Başlıktan tekrar oluştur"
                  >
                    ↻ Yeniden oluştur
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Özet
                  <span className="block text-xs text-gray-500 mt-0.5">Bu grafik ne anlatıyor? 1–2 cümle.</span>
                </label>
                <textarea
                  value={metadata.summary}
                  onChange={(e) => setMetadata({ ...metadata, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="Örn: 2020'den 2024'e kadar Türkiye ve Almanya'nın nüfus artışını karşılaştırır"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kaynak *
                  <span className="block text-xs text-gray-500 mt-0.5">Her satıra bir kaynak</span>
                </label>
                <textarea
                  value={metadata.sources}
                  onChange={(e) => setMetadata({ ...metadata, sources: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  required
                  placeholder="Örn: TÜİK, 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kaynak Bağlantısı (Opsiyonel)
                  <span className="block text-xs text-gray-500 mt-0.5">Kaynağa tıklanabilir link eklemek için URL girin</span>
                </label>
                <input
                  type="url"
                  value={metadata.sourceLink}
                  onChange={(e) => setMetadata({ ...metadata, sourceLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Örn: https://data.tuik.gov.tr"
                />
                {metadata.sourceLink && (
                  <p className="mt-2 text-xs text-gray-600">
                    ✓ Kaynak tıklanabilir link olarak gösterilecek
                  </p>
                )}
              </div>
              
              {/* KOLEKSIYON MULTI-SELECT */}
              {collections && collections.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Koleksiyonlar
                    <span className="block text-xs text-gray-500 mt-0.5">Bu grafik hangi koleksiyonlarda yer alsın?</span>
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {collections.map((col) => (
                      <label key={col.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
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
                          className="mr-3 h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{col.title}</span>
                      </label>
                    ))}
                  </div>
                  {metadata.collection_ids.length > 0 && (
                    <p className="mt-2 text-xs text-gray-600">
                      {metadata.collection_ids.length} koleksiyon seçildi
                    </p>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">Yayın Durumu</label>
                <select
                  value={metadata.status}
                  onChange={(e) => setMetadata({ ...metadata, status: e.target.value as 'draft' | 'published' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
                <p className="mt-2 text-xs text-gray-600">
                  Taslak olarak kaydettiğinizde tüm veriler ve ayarlar korunur. İstediğiniz zaman düzenlemeye devam edebilirsiniz.
                </p>
              </div>
            </div>
          </section>
          
          {/* EMBED CODE GENERATOR (Published only) */}
          {metadata.status === 'published' && visualization && (
            <section className="border-t pt-8">
              <h2 className="text-base font-semibold mb-4">Embed Kodu</h2>
              <p className="text-sm text-gray-600 mb-6">
                Bu kodu sitenize ekleyerek grafiği embed edebilirsiniz.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Embed Boyutu</label>
                  <div className="flex gap-3">
                    {(['responsive', '16:9', '1:1'] as EmbedRatio[]).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setEmbedRatio(ratio)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                          embedRatio === ratio
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {ratio === 'responsive' ? 'Responsive' : ratio}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">iframe Kodu</label>
                    <button
                      type="button"
                      onClick={() => {
                        const embedCode = `<iframe src="${window.location.origin}/embed/${metadata.slug}?v=${visualization.embed_version}" ${
                          embedRatio === 'responsive' 
                            ? 'width="100%" height="600"' 
                            : embedRatio === '16:9'
                            ? 'width="800" height="450"'
                            : 'width="600" height="600"'
                        } frameborder="0" scrolling="no"></iframe>`
                        
                        navigator.clipboard.writeText(embedCode)
                        setEmbedCodeCopied(true)
                        setTimeout(() => setEmbedCodeCopied(false), 2000)
                      }}
                      className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                    >
                      {embedCodeCopied ? '✓ Kopyalandı' : 'Kopyala'}
                    </button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs font-mono overflow-x-auto">
                    {`<iframe src="${window.location.origin}/embed/${metadata.slug}?v=${visualization.embed_version}" ${
                      embedRatio === 'responsive' 
                        ? 'width="100%" height="600"' 
                        : embedRatio === '16:9'
                        ? 'width="800" height="450"'
                        : 'width="600" height="600"'
                    } frameborder="0" scrolling="no"></iframe>`}
                  </pre>
                </div>
              </div>
            </section>
          )}
        </div>
      ) : (
        // PREVIEW TAB
        <section className="min-h-[600px]">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <p className="text-base font-semibold text-gray-800">Yayında Görünecek Grafik</p>
            <p className="text-sm text-gray-600 mt-1">
              Bu önizleme, site ve embed'de birebir aynı görünür.
            </p>
          </div>
          
          {/* CRITICAL: Always render Chart component to prevent unmounting/flickering */}
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200">
            {chartSpec && (chartSpec as any)._isInvalid && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Uyarı:</strong> {(chartSpec as any)._invalidReason || 'Histogram yapılandırması geçici olarak geçersiz. Lütfen ayarları kontrol edin.'}
                </p>
              </div>
            )}
            {/* CRITICAL: Always render Chart with valid spec (never null) to prevent unmounting */}
            <Chart spec={chartSpec} />
          </div>
        </section>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg">
          <p className="font-semibold text-sm mb-1">Hata</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 border-t pt-8">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          {loading ? 'Kaydediliyor...' : visualization ? 'Güncelle' : 'Kaydet'}
        </button>
        <Link
          href="/admin/viz"
          className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold inline-flex items-center justify-center transition-colors"
        >
          İptal
        </Link>
      </div>
    </form>
  )
}
