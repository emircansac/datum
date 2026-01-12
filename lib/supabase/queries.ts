import { createSupabaseServerClient } from './server'
import { Visualization, Collection } from '@/types'

export async function getVisualizations(filters?: {
  status?: 'draft' | 'published'
  collection_id?: string
  tags?: string[]
  search?: string
}) {
  const supabase = await createSupabaseServerClient()
  let query = supabase
    .from('visualizations')
    .select('*')
    .order('last_updated', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.collection_id) {
    query = query.contains('collection_ids', [filters.collection_id])
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Visualization[]
}

export async function getVisualizationBySlug(slug: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('visualizations')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw error
  return data as Visualization
}

export async function getCollections() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('title', { ascending: true })

  if (error) throw error
  return data as Collection[]
}

export async function getCollectionBySlug(slug: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Collection
}

export async function getVisualizationsByIds(ids: string[]) {
  if (ids.length === 0) return []
  
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('visualizations')
    .select('*')
    .in('id', ids)
    .eq('status', 'published')

  if (error) throw error
  return (data || []) as Visualization[]
}
