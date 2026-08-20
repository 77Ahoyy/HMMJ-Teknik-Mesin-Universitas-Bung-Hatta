import { NextRequest, NextResponse } from 'next/server'
import { getMembers, upsertMember, deleteMember } from '@/lib/data'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.toLowerCase() || ''
  const division = searchParams.get('division') || ''
  const role = searchParams.get('role') || ''
  const all = searchParams.get('all') === 'true'

  let members = await getMembers()

  // If not requesting all (public view), only show active members
  if (!all) {
    members = members.filter(m => m.active !== false)
  }

  if (q) {
    members = members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.npm.toLowerCase().includes(q) ||
      m.jabatan.toLowerCase().includes(q) ||
      m.division_name.toLowerCase().includes(q)
    )
  }
  if (division) {
    members = members.filter(
      m => m.division_id === division || m.division_name.toLowerCase() === division.toLowerCase()
    )
  }
  if (role) {
    members = members.filter(m => m.role === role)
  }

  return NextResponse.json({ members, total: members.length })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  const data = await req.json()
  const member = {
    ...data,
    id: data.id || `mbr-${Date.now().toString(36)}`,
    active: data.active !== undefined ? data.active : true,
  }
  const members = await upsertMember(member)
  return NextResponse.json({ success: true, members })
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  const data = await req.json()
  if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const members = await upsertMember(data)
  return NextResponse.json({ success: true, members })
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const members = await deleteMember(id)
  return NextResponse.json({ success: true, members })
}
