import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import CollectionForm from '@/components/admin/CollectionForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminCollectionDetail({ params }: PageProps) {
  const supabase = await createSupabaseServerClient()
  const { data: collection, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error && params.id !== 'new') {
    notFound()
  }

  const { data: visualizations } = await supabase
    .from('visualizations')
    .select('id, title')
    .order('title')

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/collections"
          className="text-sm text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Koleksiyonlara dön
        </Link>
        <h1 className="text-3xl font-semibold mb-2">
          {params.id === 'new' ? 'Yeni Koleksiyon' : collection?.title}
        </h1>
      </div>

      <CollectionForm collection={collection || null} visualizations={visualizations || []} />
    </div>
  )
}
