import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Serverless in-memory store for instant cross-device broadcast
const globalCloudStore = globalThis as unknown as {
  _cloudMembers?: any[]
  _cloudSettings?: any
  _cloudBackgrounds?: any[]
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const type = searchParams.get('type') || 'all'

  if (type === 'members') {
    return NextResponse.json({ members: globalCloudStore._cloudMembers || null })
  }
  if (type === 'settings') {
    return NextResponse.json({ settings: globalCloudStore._cloudSettings || null })
  }
  if (type === 'backgrounds') {
    return NextResponse.json({ backgrounds: globalCloudStore._cloudBackgrounds || null })
  }

  return NextResponse.json({
    members: globalCloudStore._cloudMembers || null,
    settings: globalCloudStore._cloudSettings || null,
    backgrounds: globalCloudStore._cloudBackgrounds || null,
  })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  try {
    const { type, data } = await req.json()
    if (!type || data === undefined) {
      return NextResponse.json({ error: 'Type and data required' }, { status: 400 })
    }

    if (type === 'members') {
      globalCloudStore._cloudMembers = data
    } else if (type === 'settings') {
      globalCloudStore._cloudSettings = data
    } else if (type === 'backgrounds') {
      globalCloudStore._cloudBackgrounds = data
    }

    return NextResponse.json({ success: true, type, count: Array.isArray(data) ? data.length : 1 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyinkronkan data ke cloud' }, { status: 500 })
  }
}
