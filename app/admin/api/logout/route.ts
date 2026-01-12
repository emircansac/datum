import { NextResponse } from 'next/server'
import { clearAdminAuth } from '@/lib/auth'

export async function POST() {
  clearAdminAuth()
  return NextResponse.json({ success: true })
}
