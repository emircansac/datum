import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getVisualizations } from '@/lib/supabase/queries'

export default async function AdminDashboard() {
  const visualizations = await getVisualizations()
  const supabase = await createSupabaseServerClient()
  const { data: collections } = await supabase.from('collections').select('id')

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Admin Paneli</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Görselleştirmeler</h2>
          <p className="text-3xl font-bold mb-4">{visualizations.length}</p>
          <Link
            href="/admin/viz"
            className="text-sm text-gray-600 hover:underline"
          >
            Yönet →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Koleksiyonlar</h2>
          <p className="text-3xl font-bold mb-4">{collections?.length || 0}</p>
          <Link
            href="/admin/collections"
            className="text-sm text-gray-600 hover:underline"
          >
            Yönet →
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Son Görselleştirmeler</h2>
        <div className="space-y-2">
          {visualizations.slice(0, 5).map((viz) => (
            <div key={viz.id} className="flex items-center justify-between py-2 border-b border-gray-100">
              <Link
                href={`/admin/viz/${viz.id}`}
                className="text-sm hover:underline"
              >
                {viz.title}
              </Link>
              <span className="text-xs text-gray-500">
                {viz.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
