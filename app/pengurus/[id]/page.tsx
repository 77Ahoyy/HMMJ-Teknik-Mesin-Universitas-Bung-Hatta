import { getMember, getSettings } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import MemberDetailClient from './MemberDetailClient'
import styles from './MemberDetail.module.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const member = await getMember(id)
  if (!member) return { title: 'Pengurus Tidak Ditemukan' }
  return {
    title: `${member.name} — ${member.jabatan}`,
    description: `Profil ${member.name}, ${member.jabatan} ${member.division_name} HMMJ Teknik Mesin Universitas Bung Hatta`,
  }
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params
  const [member, settings] = await Promise.all([getMember(id), getSettings()])
  if (!member) notFound()

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={`container ${styles.inner}`}>
        <Link href="/struktur" className={styles.backBtn}>
          ← Kembali ke Struktur Organisasi
        </Link>
        <MemberDetailClient member={member} settings={settings} />
      </div>
    </div>
  )
}
