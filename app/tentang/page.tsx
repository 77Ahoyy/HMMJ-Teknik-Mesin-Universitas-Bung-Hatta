import { getSettings, getBackgrounds } from '@/lib/data'
import AboutSection from '@/components/sections/AboutSection'
import LogoPhilosophySection from '@/components/sections/LogoPhilosophySection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tentang HMMJ Teknik Mesin Universitas Bung Hatta',
  description: 'Sejarah, Visi Misi, dan Filosofi Lambang HMMJ Teknik Mesin Universitas Bung Hatta.',
}

export default async function TentangPage() {
  const [settings, backgrounds] = await Promise.all([getSettings(), getBackgrounds()])
  const aboutBg = backgrounds.find(b => b.section === 'about')

  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <AboutSection settings={settings} background={aboutBg} />
      <LogoPhilosophySection />
    </div>
  )
}
