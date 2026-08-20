'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Settings } from '@/lib/data'
import styles from './Footer.module.css'

interface FooterProps {
  settings: Settings
}

export default function Footer({ settings }: FooterProps) {
  const pathname = usePathname()
  const [curSettings, setCurSettings] = useState<Settings>(settings)

  useEffect(() => {
    fetch('/api/v1/settings/contact')
      .then(r => r.json())
      .then(d => {
        if (d && (d.address || d.organization_name || d.copyright)) {
          setCurSettings(prev => ({ ...prev, ...d }))
        }
      })
      .catch(() => {})
  }, [settings])

  // Hide footer on dashboard pages
  if (pathname && pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brand}>
            <div className={styles.logos}>
              <div className={styles.logoCard} title="Logo HMMJ Teknik Mesin">
                <Image
                  src="/images/logo-hmmj.png"
                  alt="Logo HMMJ Teknik Mesin"
                  width={48}
                  height={48}
                  className={styles.logoImg}
                />
              </div>
              <div className={styles.logoCard} title="Logo M Solver Solidarity Forever">
                <Image
                  src="/images/logo-msolver.png"
                  alt="Logo M Solver"
                  width={48}
                  height={48}
                  className={styles.logoImg}
                />
              </div>
              <div className={styles.logoCard} title="Logo Universitas Bung Hatta">
                <Image
                  src="/images/logo-ubh.png"
                  alt="Logo Universitas Bung Hatta"
                  width={48}
                  height={48}
                  className={styles.logoImg}
                />
              </div>
            </div>
            <h3 className={styles.orgName}>{curSettings.organization_name || 'HMMJTM'}</h3>
            <p className={styles.orgFull}>{curSettings.full_organization_name}</p>
            <p className={styles.orgDetail}>{curSettings.faculty}</p>
            <p className={styles.orgDetail}>{curSettings.university}</p>
            <p className={styles.orgPeriod}>Periode {curSettings.period}</p>
          </div>

          {/* Navigation */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navigasi</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/tentang">Tentang HMMJTM</Link></li>
              <li><Link href="/struktur">Struktur Organisasi</Link></li>
              <li><Link href="/kontak">Kontak & Sekretariat</Link></li>
            </ul>
          </div>

          {/* Contact */}
          {(curSettings.address || (curSettings.email && curSettings.email !== '-') || (curSettings.phone && curSettings.phone !== '-') || (curSettings.whatsapp && curSettings.whatsapp !== '-') || curSettings.instagram_hmmj) && (
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Kontak & Sekretariat</h4>
              <ul className={styles.colLinks}>
                {curSettings.address && curSettings.address !== '-' && (
                  <li className={styles.contactItem}>
                    <span>📍</span>
                    <span>{curSettings.address}</span>
                  </li>
                )}
                {curSettings.email && curSettings.email !== '-' && curSettings.email.trim() !== '' && (
                  <li className={styles.contactItem}>
                    <span>✉️</span>
                    <a href={`mailto:${curSettings.email}`}>{curSettings.email}</a>
                  </li>
                )}
                {curSettings.phone && curSettings.phone !== '-' && curSettings.phone.trim() !== '' && (
                  <li className={styles.contactItem}>
                    <span>📞</span>
                    <a href={`tel:${curSettings.phone}`}>{curSettings.phone}</a>
                  </li>
                )}
                {curSettings.whatsapp && curSettings.whatsapp !== '-' && curSettings.whatsapp.trim() !== '' && curSettings.whatsapp.replace(/\D/g, '') !== '' && (
                  <li className={styles.contactItem}>
                    <span>💬</span>
                    <a href={`https://wa.me/${curSettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp Resmi
                    </a>
                  </li>
                )}
                {curSettings.instagram_hmmj && curSettings.instagram_hmmj !== '-' && (
                  <li className={styles.contactItem}>
                    <span>📷</span>
                    <a
                      href={curSettings.instagram_hmmj_url || 'https://www.instagram.com/himpunan_mesin_ubh/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.igLink}
                    >
                      {curSettings.instagram_hmmj}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>{settings.copyright || '© 2026 HMMJ Teknik Mesin Universitas Bung Hatta.'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/login" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', transition: 'color var(--transition)' }}>
              🔒 Akses Pengurus
            </Link>
            <a
              href={settings.instagram_creator_url || 'https://www.instagram.com/zalkii.syhrll6/'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creator}
              aria-label={`Instagram ${settings.instagram_creator}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Creator by {settings.creator_name || 'Kifli'}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
