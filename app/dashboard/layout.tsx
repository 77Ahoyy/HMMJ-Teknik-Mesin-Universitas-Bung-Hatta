import { getAuthFromCookies, isAdminOrDeveloper } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import styles from './DashboardLayout.module.css'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Ringkasan', icon: '🏠', devOnly: false },
  { href: '/dashboard/members', label: 'Kelola Pengurus & Foto', icon: '👥', devOnly: false },
  { href: '/dashboard/about', label: 'Tentang Kami & Visi Misi', icon: '📖', devOnly: false },
  { href: '/dashboard/settings/general', label: 'Pengaturan Umum', icon: '⚙️', devOnly: false },
  { href: '/dashboard/settings/password', label: 'Ganti Password', icon: '🔐', devOnly: false },
  { href: '/dashboard/settings/background', label: 'Background', icon: '🖼️', devOnly: true },
  { href: '/dashboard/settings/logo', label: 'Logo', icon: '🏷️', devOnly: true },
  { href: '/dashboard/settings/contact', label: 'Kontak', icon: '📞', devOnly: true },
  { href: '/dashboard/settings/social', label: 'Media Sosial', icon: '📱', devOnly: true },
  { href: '/dashboard/settings/footer', label: 'Footer', icon: '📋', devOnly: true },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuthFromCookies()
  if (!isAdminOrDeveloper(auth)) redirect('/login')

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.brand}>
            <Image src="/images/logo-hmmj.png" alt="HMMJTM" width={36} height={36} className={styles.brandLogo} />
            <div>
              <div className={styles.brandName}>HMMJTM</div>
              <div className={styles.brandSub}>Dashboard</div>
            </div>
          </Link>
          <div className={styles.userBadge}>
            <div className={styles.userAvatar}>{auth!.name.charAt(0)}</div>
            <div>
              <div className={styles.userName}>{auth!.name}</div>
              <div className={`${styles.userRole} ${auth!.role === 'developer' ? styles.roleDev : styles.roleAdmin}`}>
                {auth!.role === 'developer' ? '🔧 Developer' : '👤 Admin'}
              </div>
            </div>
          </div>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Menu</span>
            {NAV_ITEMS.filter(item => !item.devOnly || auth!.role === 'developer').map(item => (
              <Link key={item.href} href={item.href} className={styles.navItem} id={`dash-nav-${item.href.split('/').pop()}`}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.backSite}><span>←</span><span>Lihat Website</span></Link>
          <Link href="/api/v1/auth?logout=1" className={styles.logoutBtn} id="dashboard-logout-btn" prefetch={false}>
            <span>🚪</span><span>Keluar</span>
          </Link>
        </div>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
