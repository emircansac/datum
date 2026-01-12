import { NextRequest, NextResponse } from 'next/server'
import { setAdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme'

  if (password === adminPassword) {
    setAdminAuth()
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
