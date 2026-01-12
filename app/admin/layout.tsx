import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Skip auth check for login page - let it render without admin layout
  if (pathname === '/admin/login' || pathname.includes('/admin/login')) {
    return <>{children}</>
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-6">
              <Link href="/admin" className="text-lg font-semibold">
                Datum Admin
              </Link>
              <Link
                href="/admin/viz"
                className="text-sm text-gray-600 hover:text-black"
              >
                Görselleştirmeler
              </Link>
              <Link
                href="/admin/collections"
                className="text-sm text-gray-600 hover:text-black"
              >
                Koleksiyonlar
              </Link>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}
