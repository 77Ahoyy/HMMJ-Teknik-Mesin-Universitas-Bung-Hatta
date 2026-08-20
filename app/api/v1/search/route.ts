import { NextRequest, NextResponse } from 'next/server'
import { getMembers } from '@/lib/data'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: q })
  }

  const members = await getMembers()
  const results: any[] = []

  // Search members
  members.filter(m => m.active).forEach(m => {
    const name = (m.name || '').toLowerCase()
    const npm = (m.npm || '').toLowerCase()
    const jabatan = (m.jabatan || '').toLowerCase()
    const division = (m.division_name || '').toLowerCase()

    if (name.includes(q) || npm.includes(q) || jabatan.includes(q) || division.includes(q)) {
      results.push({
        type: 'Pengurus',
        title: m.name,
        subtitle: `${m.jabatan} — ${m.division_name}`,
        url: `/pengurus/${m.id}`,
      })
    }
  })

  return NextResponse.json({ results: results.slice(0, 10), query: q })
}

