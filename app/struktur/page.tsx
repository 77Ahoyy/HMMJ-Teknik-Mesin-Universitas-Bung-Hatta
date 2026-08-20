import { getMembers, getDivisions } from '@/lib/data'
import OrgChartSection from '@/components/sections/OrgChartSection'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Struktur Organisasi',
  description: 'Struktur organisasi HMMJ Teknik Mesin Universitas Bung Hatta Periode 2026/2027',
}

export default async function StrukturPage() {
  const [members, divisions] = await Promise.all([getMembers(), getDivisions()])
  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <OrgChartSection members={members.filter(m => m.active)} divisions={divisions} />
    </div>
  )
}
