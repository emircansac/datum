import Link from 'next/link'
import { getVisualizations } from '@/lib/supabase/queries'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminVizList() {
  const visualizations = await getVisualizations()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Görselleştirmeler</h1>
        <Link
          href="/admin/viz/new"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          Yeni Ekle
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Son Güncelleme
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visualizations.map((viz) => (
              <tr key={viz.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/viz/${viz.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {viz.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 text-xs rounded ${
                    viz.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viz.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(viz.last_updated).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {viz.status === 'published' && (
                      <Link
                        href={`/viz/${viz.slug}`}
                        target="_blank"
                        className="text-xs text-gray-600 hover:underline"
                      >
                        Görüntüle
                      </Link>
                    )}
                    <Link
                      href={`/admin/viz/${viz.id}`}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <DeleteButton
                      id={viz.id}
                      type="visualization"
                      title={viz.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
