// Simple admin authentication
import { cookies } from 'next/headers'

const ADMIN_COOKIE_NAME = 'datum-admin-auth'
const ADMIN_COOKIE_VALUE = 'authenticated'

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  const authCookie = cookieStore.get(ADMIN_COOKIE_NAME)
  return authCookie?.value === ADMIN_COOKIE_VALUE
}

export function setAdminAuth() {
  const cookieStore = cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export function clearAdminAuth() {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}
