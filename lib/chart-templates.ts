/**
 * Chart Templates for Datum Editor
 * 8 predefined chart templates with Turkish names and Vega-Lite specs
 */

export type ChartTemplateId =
  | 'time-series-line'
  | 'time-series-area'
  | 'category-bar'
  | 'ranked-bar'
  | 'scatter'
  | 'stacked-bar'
  | 'turkey-map'
  | 'simple-table'

export interface ChartTemplate {
  id: ChartTemplateId
  name: string
  description: string
  requiredFields: Array<{
    key: string
    label: string
    description?: string
  }>
}

export const CHART_TEMPLATES: Record<ChartTemplateId, ChartTemplate> = {
  'time-series-line': {
    id: 'time-series-line',
    name: 'Zaman Serisi (Çizgi + Nokta)',
    description: 'Aylar veya yıllar içindeki değişimi göstermek için',
    requiredFields: [
      { key: 'time', label: 'Zaman sütunu', description: 'Tarih veya zaman bilgisi içeren sütun' },
      { key: 'value', label: 'Değer sütunu', description: 'Gösterilecek sayısal değer' }
    ]
  },
  'time-series-area': {
    id: 'time-series-area',
    name: 'Zaman Serisi (Alan Grafiği)',
    description: 'Zaman içindeki toplam değerleri vurgulamak için',
    requiredFields: [
      { key: 'time', label: 'Zaman sütunu', description: 'Tarih veya zaman bilgisi içeren sütun' },
      { key: 'value', label: 'Değer sütunu', description: 'Gösterilecek sayısal değer' }
    ]
  },
  'category-bar': {
    id: 'category-bar',
    name: 'Kategori Karşılaştırma (Dikey Bar)',
    description: 'Farklı kategoriler arasındaki değerleri karşılaştırmak için',
    requiredFields: [
      { key: 'category', label: 'Kategori sütunu', description: 'Kategori adlarını içeren sütun' },
      { key: 'value', label: 'Değer sütunu', description: 'Gösterilecek sayısal değer' }
    ]
  },
  'ranked-bar': {
    id: 'ranked-bar',
    name: 'Sıralı Karşılaştırma (Top / Bottom Bar)',
    description: 'En yüksek veya en düşük değerleri vurgulamak için',
    requiredFields: [
      { key: 'category', label: 'Kategori sütunu', description: 'Kategori adlarını içeren sütun' },
      { key: 'value', label: 'Değer sütunu', description: 'Gösterilecek sayısal değer' }
    ]
  },
  'scatter': {
    id: 'scatter',
    name: 'Dağılım Grafiği (Nokta / Scatter)',
    description: 'İki değişken arasındaki ilişkiyi göstermek için',
    requiredFields: [
      { key: 'x', label: 'X ekseni sütunu', description: 'Yatay eksen için sayısal değer' },
      { key: 'y', label: 'Y ekseni sütunu', description: 'Dikey eksen için sayısal değer' }
    ]
  },
  'stacked-bar': {
    id: 'stacked-bar',
    name: 'Yığılmış Bar (Oran Dağılımı)',
    description: 'Toplam içindeki oranları ve kategorileri göstermek için',
    requiredFields: [
      { key: 'category', label: 'Kategori sütunu', description: 'Ana kategori adlarını içeren sütun' },
      { key: 'subcategory', label: 'Alt kategori sütunu', description: 'Alt kategorileri içeren sütun' },
      { key: 'value', label: 'Değer sütunu', description: 'Gösterilecek sayısal değer' }
    ]
  },
  'turkey-map': {
    id: 'turkey-map',
    name: 'Türkiye Haritası (İl Bazlı)',
    description: 'Türkiye\'nin illerine göre veri dağılımını göstermek için',
    requiredFields: [
      { key: 'province', label: 'İl adı sütunu', description: 'İl adlarını içeren sütun (örn: İstanbul, Ankara)' },
      { key: 'value', label: 'Değer sütunu', description: 'Gösterilecek sayısal değer' }
    ]
  },
  'simple-table': {
    id: 'simple-table',
    name: 'Basit Tablo (Editoryal Tablo)',
    description: 'Verileri düzenli bir tablo formatında göstermek için',
    requiredFields: [
      { key: 'columns', label: 'Sütunlar', description: 'Tablodaki tüm sütunlar otomatik olarak algılanır' }
    ]
  }
}

/**
 * Generate Vega-Lite spec from template, data, and column mappings
 */
export function generateChartSpec(
  templateId: ChartTemplateId,
  data: Array<Record<string, any>>,
  columnMappings: Record<string, string>,
  editorialSettings?: {
    title?: string
    subtitle?: string
    xAxisLabel?: string
    yAxisLabel?: string
    unit?: string
  }
): Record<string, any> {
  // Map column names to chart fields
  const mappedData = data.map(row => {
    const mapped: Record<string, any> = {}
    for (const [chartField, dataColumn] of Object.entries(columnMappings)) {
      mapped[chartField] = row[dataColumn]
    }
    return mapped
  })

  const baseSpec: Record<string, any> = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: mappedData },
    width: 'container',
    height: 400
  }

  switch (templateId) {
    case 'time-series-line': {
      return {
        ...baseSpec,
        mark: { type: 'line', point: true },
        encoding: {
          x: {
            field: 'time',
            type: 'temporal',
            title: editorialSettings?.xAxisLabel || 'Zaman',
            axis: { labelAngle: -45 }
          },
          y: {
            field: 'value',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Değer',
            ...(editorialSettings?.unit && { format: `.1f${editorialSettings.unit}` })
          }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'time-series-area': {
      return {
        ...baseSpec,
        mark: { type: 'area', line: true },
        encoding: {
          x: {
            field: 'time',
            type: 'temporal',
            title: editorialSettings?.xAxisLabel || 'Zaman',
            axis: { labelAngle: -45 }
          },
          y: {
            field: 'value',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Değer',
            ...(editorialSettings?.unit && { format: `.1f${editorialSettings.unit}` })
          }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'category-bar': {
      return {
        ...baseSpec,
        mark: 'bar',
        encoding: {
          x: {
            field: 'category',
            type: 'nominal',
            title: editorialSettings?.xAxisLabel || 'Kategori',
            axis: { labelAngle: -45 }
          },
          y: {
            field: 'value',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Değer',
            ...(editorialSettings?.unit && { format: `.1f${editorialSettings.unit}` })
          }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'ranked-bar': {
      return {
        ...baseSpec,
        mark: 'bar',
        encoding: {
          x: {
            field: 'value',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Değer',
            ...(editorialSettings?.unit && { format: `.1f${editorialSettings.unit}` })
          },
          y: {
            field: 'category',
            type: 'nominal',
            title: editorialSettings?.xAxisLabel || 'Kategori',
            sort: '-x'
          }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'scatter': {
      return {
        ...baseSpec,
        mark: 'circle',
        encoding: {
          x: {
            field: 'x',
            type: 'quantitative',
            title: editorialSettings?.xAxisLabel || 'X Değeri'
          },
          y: {
            field: 'y',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Y Değeri'
          },
          size: { value: 60 }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'stacked-bar': {
      return {
        ...baseSpec,
        mark: 'bar',
        encoding: {
          x: {
            field: 'category',
            type: 'nominal',
            title: editorialSettings?.xAxisLabel || 'Kategori'
          },
          y: {
            field: 'value',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Değer',
            stack: 'normalize',
            ...(editorialSettings?.unit && { format: `.1%` })
          },
          color: {
            field: 'subcategory',
            type: 'nominal',
            title: 'Alt Kategori'
          }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'turkey-map': {
      // Note: Turkey map requires GeoJSON data and a more complex spec
      // This is a simplified version - in production, you'd need actual GeoJSON
      return {
        ...baseSpec,
        mark: 'bar', // Fallback to bar chart if GeoJSON not available
        encoding: {
          x: {
            field: 'province',
            type: 'nominal',
            title: 'İl',
            axis: { labelAngle: -45 }
          },
          y: {
            field: 'value',
            type: 'quantitative',
            title: editorialSettings?.yAxisLabel || 'Değer',
            ...(editorialSettings?.unit && { format: `.1f${editorialSettings.unit}` })
          }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title }),
        ...(editorialSettings?.subtitle && { subtitle: editorialSettings.subtitle })
      }
    }

    case 'simple-table': {
      // Simple table representation
      return {
        ...baseSpec,
        mark: 'text',
        encoding: {
          text: { field: Object.keys(data[0] || {})[0] || 'value', type: 'nominal' }
        },
        ...(editorialSettings?.title && { title: editorialSettings.title })
      }
    }

    default:
      return baseSpec
  }
}
