import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Add pathname to headers for use in layouts
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Whitelist: These routes are exempt from auth checks
  const publicAdminRoutes = ['/admin/login', '/admin/auth/callback']
  if (publicAdminRoutes.includes(pathname)) {
    // Allow these routes to pass through without auth check
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // For all other /admin routes, check authentication
  if (pathname.startsWith('/admin')) {
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  // For non-admin routes, just pass through
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
