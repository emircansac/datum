export type VisualizationStatus = 'draft' | 'published'

export interface Visualization {
  id: string
  title: string
  slug: string
  summary: string
  tags: string[]
  collection_ids: string[]
  sources: string[]
  last_updated: string
  status: VisualizationStatus
  chart_spec: Record<string, any> // Vega-Lite spec
  dataset_file: string | null
  thumbnail_file: string | null
  social_image_file: string | null
  embed_version: number
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  title: string
  slug: string
  description: string
  visualization_ids: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'editor'
}
