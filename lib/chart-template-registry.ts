export type ChartTemplateStatus = 'active' | 'coming_soon'
export type ChartTemplateId = 'line' | 'bar' | 'dot-plot' | 'stacked-area' | 'slope-chart'

export interface ChartTemplateDefinition {
  id: ChartTemplateId
  label: string
  description: string
  status: ChartTemplateStatus
}

export const CHART_TEMPLATES: ChartTemplateDefinition[] = [
  {
    id: 'line',
    label: 'Zaman Serisi (Çizgi + Nokta)',
    description: 'Yıllar veya aylar içindeki değişimi göstermek için.',
    status: 'active'
  },
  {
    id: 'bar',
    label: 'Kategori Karşılaştırma (Dikey Bar)',
    description: 'Kategorileri karşılaştırmak için.',
    status: 'active'
  },
  {
    id: 'dot-plot',
    label: 'Nokta Grafiği (Dot Plot)',
    description: 'Tek bir zaman noktasında birden fazla varlığı karşılaştırmak için.',
    status: 'active'
  },
  {
    id: 'stacked-area',
    label: 'Yığılmış Alan Grafiği (Stacked Area)',
    description: 'Zaman içinde serilerin kümülatif katkısını göstermek için.',
    status: 'active'
  },
  {
    id: 'slope-chart',
    label: 'Eğim Grafiği (Slope Chart)',
    description: 'İki zaman noktası arasındaki değişimi karşılaştırmak için.',
    status: 'active'
  }
]

export const DEFAULT_TEMPLATE_ID: ChartTemplateId = 'line'
