import { getSettings, getBackgrounds, getMembers, getDivisions } from '@/lib/data'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import OrgChartSection from '@/components/sections/OrgChartSection'
import ContactSection from '@/components/sections/ContactSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [settings, backgrounds, members, divisions] = await Promise.all([
    getSettings(),
    getBackgrounds(),
    getMembers(),
    getDivisions(),
  ])

  const heroBg = backgrounds.find(b => b.section === 'hero')
  const aboutBg = backgrounds.find(b => b.section === 'about')
  const contactBg = backgrounds.find(b => b.section === 'contact')

  return (
    <>
      <HeroSection settings={settings} background={heroBg} />
      <AboutSection settings={settings} background={aboutBg} />
      <OrgChartSection members={members.filter(m => Boolean(m.active))} divisions={divisions} />
      <ContactSection settings={settings} background={contactBg} />
    </>
  )
}
