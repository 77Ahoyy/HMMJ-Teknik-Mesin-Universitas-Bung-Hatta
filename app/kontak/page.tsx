import { getSettings, getBackgrounds } from '@/lib/data'
import ContactSection from '@/components/sections/ContactSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi HMMJ Teknik Mesin Universitas Bung Hatta',
}

export default async function KontakPage() {
  const [settings, backgrounds] = await Promise.all([getSettings(), getBackgrounds()])
  const contactBg = backgrounds.find(b => b.section === 'contact')
  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <ContactSection settings={settings} background={contactBg} />
    </div>
  )
}
