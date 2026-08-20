'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Settings, Background } from '@/lib/data'
import styles from './AboutSection.module.css'

interface AboutSectionProps {
  settings: Settings
  background?: Background
}

export default function AboutSection({ settings, background }: AboutSectionProps) {
  const [currentBg, setCurrentBg] = useState<Background | undefined>(background)

  useEffect(() => {
    try {
      const local = localStorage.getItem('hmmj_custom_backgrounds')
      if (local) {
        const parsed = JSON.parse(local)
        if (Array.isArray(parsed)) {
          const found = parsed.find((b: Background) => b.section === 'about')
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
  const overlay = currentBg?.overlay ?? 0.7

  const vision = settings.about_vision || 'Menjadi himpunan mahasiswa jurusan yang unggul, profesional, dan berintegritas tinggi dalam mencetak mahasiswa Teknik Mesin yang berdaya saing nasional maupun internasional.'
  const mission = settings.about_mission || `1. Membangun solidaritas dan kekeluargaan yang erat antar sesama mahasiswa Teknik Mesin.\n2. Mengembangkan potensi kepemimpinan, riset teknologi, dan soft skill anggota.\n3. Menjalin kerja sama yang harmonis dengan institusi, alumni, dan industri.`

  const missionItems = mission
    .split('\n')
    .map(m => m.trim())
    .filter(Boolean)
    .map(m => m.replace(/^\d+[\.\)]\s*/, '')) // clean leading numbers for styled list

  return (
    <section className={styles.about} id="tentang">
      {bgUrl && (
        <>
          <img
            src={bgUrl}
            alt="About Background"
            className={styles.bgImage}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <div
            className={styles.overlay}
            style={{ background: `rgba(10,22,40,${overlay})` }}
          />
        </>
      )}

      <div className={`container ${styles.inner}`}>
        {/* Top Two Columns: Identity & Description */}
        <div className={styles.topGrid}>
          {/* Left Column: Logos & Info Box */}
          <div className={styles.left}>
            <div className={styles.logoGroup}>
              <div className={styles.logoCard} title="Logo Utama HMMJTM Teknik Mesin">
                <Image
                  src="/images/logo-hmmj.png"
                  alt="Logo HMMJTM"
                  width={88}
                  height={88}
                  className={styles.logo}
                />
              </div>
              <div className={styles.logoCard} title="Logo M Solver">
                <Image
                  src="/images/logo-msolver.png"
                  alt="Logo M Solver"
                  width={88}
                  height={88}
                  className={styles.logo}
                />
              </div>
              <div className={styles.logoCard} title="Logo Universitas Bung Hatta">
                <Image
                  src="/images/logo-ubh.png"
                  alt="Logo UBH"
                  width={88}
                  height={88}
                  className={styles.logo}
                />
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Organisasi</span>
                <span className={styles.infoValue}>{settings.full_organization_name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Fakultas</span>
                <span className={styles.infoValue}>{settings.faculty}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Universitas</span>
                <span className={styles.infoValue}>{settings.university}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Periode</span>
                <span className={`${styles.infoValue} ${styles.periodValue}`}>{settings.period}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions & Pillars */}
          <div className={styles.right}>
            <span className="section-tag">{settings.about_subtitle || 'Tentang Kami'}</span>
            <h2 className="section-title" style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>
              {settings.about_title || 'Mengenal \nHMMJTM Teknik Mesin'}
            </h2>
            <div className="divider divider-left" />

            {settings.about_description_1 && (
              <p className={styles.desc}>{settings.about_description_1}</p>
            )}
            {settings.about_description_2 && (
              <p className={styles.desc}>{settings.about_description_2}</p>
            )}
            {settings.about_description_3 && (
              <p className={styles.desc}>{settings.about_description_3}</p>
            )}

            {(settings.about_pillars && settings.about_pillars.length > 0) ? (
              <div className={styles.pillGroup}>
                {settings.about_pillars.map(p => (
                  <span key={p} className={styles.pill}>{p}</span>
                ))}
              </div>
            ) : (
              <div className={styles.pillGroup}>
                {['Solidaritas', 'Integritas', 'Inovasi', 'Kepemimpinan', 'Profesionalisme'].map(p => (
                  <span key={p} className={styles.pill}>{p}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            VISI & MISI SECTION (SANGAT PROMINEN & JELAS TERLIHAT)
            ======================================================== */}
        <div className={styles.visionMissionSection}>
          <div className={styles.vmHeader}>
            <span className="section-tag">Arah & Tujuan Organisasi</span>
            <h3 className={styles.vmMainTitle}>Visi & Misi Kepengurusan</h3>
            <p className={styles.vmSubTitle}>Landasan gerak dan cita-cita HMMJTM Teknik Mesin Universitas Bung Hatta</p>
          </div>

          <div className={styles.vmGrid}>
            {/* CARD 1: VISI */}
            <div className={`${styles.vmCard} ${styles.visionCard}`}>
              <div className={styles.vmCardHeader}>
                <div className={styles.vmIconBadge}>🎯</div>
                <div>
                  <span className={styles.vmTag}>Visi Organisasi</span>
                  <h4 className={styles.vmCardTitle}>VISI</h4>
                </div>
              </div>
              <div className={styles.visionBody}>
                <div className={styles.quoteMark}>“</div>
                <p className={styles.visionText}>{vision}</p>
              </div>
            </div>

            {/* CARD 2: MISI */}
            <div className={`${styles.vmCard} ${styles.missionCard}`}>
              <div className={styles.vmCardHeader}>
                <div className={styles.vmIconBadge}>🚀</div>
                <div>
                  <span className={styles.vmTag}>Misi Pelaksanaan</span>
                  <h4 className={styles.vmCardTitle}>MISI</h4>
                </div>
              </div>
              <ul className={styles.missionList}>
                {missionItems.map((item, idx) => (
                  <li key={idx} className={styles.missionItem}>
                    <span className={styles.missionNum}>{idx + 1}</span>
                    <span className={styles.missionText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
