import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/data'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const updated = await updateSettings(data)
  return NextResponse.json({ success: true, settings: updated })
}
