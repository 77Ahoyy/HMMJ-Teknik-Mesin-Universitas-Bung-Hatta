import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/data'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir, silakan login ulang.' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const updated = await updateSettings(data)
    return NextResponse.json({ success: true, settings: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan pengaturan kontak' }, { status: 500 })
  }
}
