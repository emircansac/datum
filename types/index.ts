// Data models for Datum

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter'

export interface Visualization {
  slug: string
  title: string
  takeaway: string
  description: string
  sources: string[]
  methodology: string
  lastUpdated: string
  collections: string[] // Collection slugs
  chartType: ChartType
  chartData: ChartDataPoint[]
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface Collection {
  slug: string
  title: string
  description: string
  visualizations: string[] // Visualization slugs
}
