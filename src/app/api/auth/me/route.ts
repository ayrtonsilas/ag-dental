import { NextResponse } from 'next/server'
import { validateAuth } from '@/lib/auth'

export async function GET() {
  const user = await validateAuth()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(user)
} 