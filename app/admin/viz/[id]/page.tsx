import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import VizForm from '@/components/admin/VizForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminVizDetail({ params }: PageProps) {
  const supabase = await createSupabaseServerClient()
  
  // If id is 'new', create mode - no database lookup needed
  const isNew = params.id === 'new'
  
  let visualization = null
  if (!isNew) {
    const { data, error } = await supabase
      .from('visualizations')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      notFound()
    }
    visualization = data
  }

  const { data: collectionsData } = await supabase
    .from('collections')
    .select('id, title')
    .order('title')

  const collections = (collectionsData || []).map(col => ({
    id: col.id,
    title: col.title,
    slug: '',
    description: '',
    visualization_ids: [],
    created_at: '',
    updated_at: ''
  }))

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/viz"
          className="text-sm text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Görselleştirmelere dön
        </Link>
        <h1 className="text-3xl font-semibold mb-2">
          {isNew ? 'Yeni Görselleştirme' : visualization?.title}
        </h1>
      </div>

      <VizForm visualization={visualization} collections={collections} />
    </div>
  )
}
