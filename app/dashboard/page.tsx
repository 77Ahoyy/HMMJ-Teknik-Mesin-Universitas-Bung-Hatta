import { getAuthFromCookies } from '@/lib/auth'
import { getMembers, getDivisions } from '@/lib/data'
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const [auth, members, divisions] = await Promise.all([
    getAuthFromCookies(),
    getMembers(),
    getDivisions(),
  ])

  return (
    <DashboardOverviewClient
      authName={auth?.name || 'Pengurus'}
      authRole={auth?.role || 'admin'}
      initialMembers={members}
      initialDivisions={divisions}
    />
  )
}
