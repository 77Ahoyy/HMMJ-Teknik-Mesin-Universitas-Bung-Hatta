'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Settings, Background } from '@/lib/data'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  settings: Settings
  background?: Background
}

export default function HeroSection({ settings, background }: HeroSectionProps) {
  const [currentBg, setCurrentBg] = useState<Background | undefined>(background)

  useEffect(() => {
    try {
      const local = localStorage.getItem('hmmj_custom_backgrounds')
      if (local) {
        const parsed = JSON.parse(local)
        if (Array.isArray(parsed)) {
          const found = parsed.find((b: Background) => b.section === 'hero')
          if (found) {
            setCurrentBg(found)
            return
          }
        }
      }
    } catch {}
    setCurrentBg(background)
  }, [background])

  const bgUrl = currentBg?.image_url || ''
  const overlay = currentBg?.overlay ?? 0.55
  const position = currentBg?.position || 'center'

  return (
    <section className={styles.hero} id="beranda">
      {/* Background */}
      {bgUrl ? (
        <img
          src={bgUrl}
          alt="Hero Background"
          className={styles.bgImage}
          style={{ objectPosition: position, width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
      ) : (
        <div className={styles.bgDefault} />
      )}

      {/* Overlay */}
      <div
        className={styles.overlay}
        style={{ background: `rgba(10, 22, 40, ${overlay})` }}
      />

      {/* Animated particles */}
      <div className={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.particle} style={{ animationDelay: `${i * 0.8}s` }} />
        ))}
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.logoWrap}>
          <div className={styles.logoGroup}>
            <div className={styles.logoCard} title="HMMJ Teknik Mesin">
              <Image
                src="/images/logo-hmmj.png"
                alt="Logo HMMJ Teknik Mesin"
                width={80}
                height={80}
                className={styles.heroLogo}
                priority
              />
            </div>
            <div className={styles.logoCard} title="Solidarity M Forever">
              <Image
                src="/images/logo-msolver.png"
                alt="Logo Solidarity M Forever"
                width={80}
                height={80}
                className={styles.heroLogo}
                priority
              />
            </div>
            <div className={styles.logoCard} title="Universitas Bung Hatta">
              <Image
                src="/images/logo-ubh.png"
                alt="Logo Universitas Bung Hatta"
                width={80}
                height={80}
                className={styles.heroLogo}
                priority
              />
            </div>
          </div>
        </div>

        <div className={styles.tag}>
          <span>Periode {settings.period}</span>
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine1}>HIMPUNAN MASYARAKAT MAHASISWA</span>
          <span className={styles.titleLine2}>JURUSAN TEKNIK MESIN</span>
        </h1>

        <p className={styles.subtitle}>
          {settings.faculty}
          <span className={styles.dot}>·</span>
          {settings.university}
        </p>

        {settings.tagline && (
          <p className={styles.tagline}>"{settings.tagline}"</p>
        )}

        <div className={styles.cta}>
          <Link href="/struktur" className="btn btn-primary btn-lg" id="hero-cta-struktur">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Lihat Struktur
          </Link>
          <Link href="/tentang" className="btn btn-outline btn-lg" id="hero-cta-tentang">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Tentang HMMJTM
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>28+</span>
            <span className={styles.statLabel}>Pengurus</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>6</span>
            <span className={styles.statLabel}>Divisi</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNum}>2026</span>
            <span className={styles.statLabel}>Tahun Aktif</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  )
}
