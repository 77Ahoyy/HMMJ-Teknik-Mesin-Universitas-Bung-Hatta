'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Settings } from '@/lib/data'
import styles from './Navbar.module.css'

interface NavbarProps {
  settings: Settings
}

// Nav links sequenced exactly matching website page content order:
const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/struktur', label: 'Struktur Organisasi' },
  { href: '/kontak', label: 'Kontak' },
]

export default function Navbar({ settings }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/v1/auth')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) setUser(d.user)
        else setUser(null)
      })
      .catch(() => setUser(null))
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        let results: any[] = data.results || []
        setSearchResults(results)
      } catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])


  if (pathname && pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.brand}>
            <Image
              src="/images/logo-hmmj.png"
              alt="Logo HMMJTM Teknik Mesin"
              width={44}
              height={44}
              className={styles.logo}
              priority
            />
            <div className={styles.brandText}>
              <span className={styles.brandName}>HMMJTM</span>
              <span className={styles.brandSub}>Teknik Mesin</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className={styles.navLinks}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search */}
            <div ref={searchRef} className={styles.searchWrapper}>
              <button
                className={styles.iconBtn}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Pencarian"
                id="navbar-search-btn"
              >
                🔍
              </button>
              {searchOpen && (
                <div className={styles.searchDropdown}>
                  <div className={styles.searchInputWrap}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Cari pengurus, divisi, informasi..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className={styles.searchInput}
                      id="navbar-search-input"
                    />
                    {searchQuery && (
                      <button className={styles.clearBtn} onClick={() => { setSearchQuery(''); setSearchResults([]) }}>✕</button>
                    )}
                  </div>
                  {searching && (
                    <div className={styles.searchLoading}>
                      <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
                      <span>Mencari...</span>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <ul className={styles.searchResults}>
                      {searchResults.map((r, i) => (
                        <li key={i}>
                          <Link href={r.url} className={styles.searchResultItem} onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
                            <span className={styles.resultType}>{r.type}</span>
                            <span className={styles.resultTitle}>{r.title}</span>
                            {r.subtitle && <span className={styles.resultSub}>{r.subtitle}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchQuery && !searching && searchResults.length === 0 && (
                    <div className={styles.noResult}>Tidak ada hasil untuk "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>

            {/* Login / Dashboard Button */}
            {user ? (
              <Link
                href="/dashboard"
                className={`btn btn-primary btn-sm ${styles.loginBtn}`}
                id="navbar-dash-btn"
              >
                ⚙️ Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={`btn btn-outline btn-sm ${styles.loginBtn}`}
                id="navbar-login-btn"
              >
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              id="navbar-hamburger"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.mobileInner}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.activeMobile : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link href="/dashboard" className={`btn btn-primary ${styles.mobileLoginBtn}`}>
              ⚙️ Buka Dashboard ({user.name})
            </Link>
          ) : (
            <Link href="/login" className={`btn btn-outline ${styles.mobileLoginBtn}`}>
              Login Admin / Developer
            </Link>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
    </>
  )
}
