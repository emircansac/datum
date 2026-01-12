import Link from 'next/link'
import { getAllCollections } from '@/lib/data'

export default function AdminCollectionsList() {
  const collections = getAllCollections()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Koleksiyonlar</h1>
        <Link
          href="/admin/collections/new"
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
                Açıklama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Görselleştirmeler
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collections.map((collection) => (
              <tr key={collection.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/collections/${collection.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {collection.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                  {collection.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {collection.visualizations.length}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/collections/${collection.slug}`}
                      target="_blank"
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Görüntüle
                    </Link>
                    <Link
                      href={`/admin/collections/${collection.slug}`}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Düzenle
                    </Link>
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
