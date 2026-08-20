import { getDivisions, getMembers } from '@/lib/data'

export async function GET() {
  const divisions = await getDivisions()
  return Response.json(divisions)
}
