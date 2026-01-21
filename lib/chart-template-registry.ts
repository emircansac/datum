export type ChartTemplateStatus = 'active' | 'coming_soon'
export type ChartTemplateId = 
  | 'line'
  | 'bar'
  | 'category-bar'
  | 'horizontal-bar'
  | 'dot-plot'
  | 'stacked-area'
  | 'stacked-bar'
  | 'slope-chart'
  | 'dumbbell'
  | 'histogram'
  | 'pie-chart'

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
    id: 'horizontal-bar',
    label: 'Yatay Bar Grafiği (Horizontal Bar)',
    description: 'Sıralama ve karşılaştırma için yatay bar grafiği.',
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
    id: 'stacked-bar',
    label: 'Yığılmış Bar Grafiği (Absolute Stacked Bar)',
    description: 'Kategorilerin toplam büyüklüğünü ve bileşimini göstermek için.',
    status: 'active'
  },
  {
    id: 'slope-chart',
    label: 'Eğim Grafiği (Slope Chart)',
    description: 'İki zaman noktası arasındaki değişimi karşılaştırmak için.',
    status: 'active'
  },
  {
    id: 'dumbbell',
    label: 'Dumbbell Grafiği (Dumbbell Chart)',
    description: 'Kategoriler için iki değeri karşılaştırmak için (ör. Erkek/Kadın, Önce/Sonra).',
    status: 'active'
  },
  {
    id: 'histogram',
    label: 'Histogram',
    description: 'Tek bir sayısal değişkenin dağılımını göstermek için.',
    status: 'active'
  },
  {
    id: 'pie-chart',
    label: 'Pasta Grafiği (Pie Chart)',
    description: 'Bir bütünün parçalarını oransal olarak göstermek için.',
    status: 'active'
  },
  
]

export const DEFAULT_TEMPLATE_ID: ChartTemplateId = 'line'
