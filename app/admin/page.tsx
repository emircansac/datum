import Link from 'next/link'
import { getAllVisualizations, getAllCollections } from '@/lib/data'

export default function AdminDashboard() {
  const visualizations = getAllVisualizations()
  const collections = getAllCollections()

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
          <p className="text-3xl font-bold mb-4">{collections.length}</p>
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
            <div key={viz.slug} className="flex items-center justify-between py-2 border-b border-gray-100">
              <Link
                href={`/admin/viz/${viz.slug}`}
                className="text-sm hover:underline"
              >
                {viz.title}
              </Link>
              <span className="text-xs text-gray-500">
                {new Date(viz.lastUpdated).toLocaleDateString('tr-TR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
