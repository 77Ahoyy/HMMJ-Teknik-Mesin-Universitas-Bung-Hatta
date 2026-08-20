import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/data'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: {
      default: `${settings.organization_name} — ${settings.university}`,
      template: `%s | ${settings.organization_name}`,
    },
    description: `Website resmi ${settings.full_organization_name}, ${settings.faculty}, ${settings.university}. Periode ${settings.period}.`,
    keywords: ['HMMJ', 'Teknik Mesin', 'Universitas Bung Hatta', 'Himpunan Mahasiswa', 'FTI UBH'],
    authors: [{ name: settings.creator_name }],
    icons: {
      icon: settings.favicon || '/favicon.ico',
    },
    openGraph: {
      siteName: settings.organization_name,
      type: 'website',
      locale: 'id_ID',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar settings={settings} />
        <main style={{ minHeight: '80vh' }}>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
