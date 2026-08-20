'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Settings, Background } from '@/lib/data'
import styles from './ContactSection.module.css'

interface ContactSectionProps {
  settings: Settings
  background?: Background
}

export default function ContactSection({ settings, background }: ContactSectionProps) {
  const [currentBg, setCurrentBg] = useState<Background | undefined>(background)
  const [curSettings, setCurSettings] = useState<Settings>(settings)

  useEffect(() => {
    try {
      const local = localStorage.getItem('hmmj_custom_backgrounds')
      if (local) {
        const parsed = JSON.parse(local)
        if (Array.isArray(parsed)) {
          const found = parsed.find((b: Background) => b.section === 'contact')
          if (found) setCurrentBg(found)
        }
      }

      const localSett = localStorage.getItem('hmmj_custom_settings')
      if (localSett) {
        const parsedSett = JSON.parse(localSett)
        setCurSettings(prev => ({ ...prev, ...parsedSett }))
      }
    } catch {}
  }, [background, settings])

  const bgUrl = currentBg?.image_url || ''
  const overlay = currentBg?.overlay ?? 0.75

  return (
    <section className={styles.section} id="kontak">
      {bgUrl && (
        <>
          <img src={bgUrl} alt="Contact Background" className={styles.bgImg} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          <div className={styles.overlay} style={{ background: `rgba(10,22,40,${overlay})` }} />
        </>
      )}
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className="section-tag">Hubungi Kami</span>
          <h2 className={styles.title}>
            Tetap Terhubung<br />
            <span className={styles.titleGold}>Dengan HMMJTM</span>
          </h2>
          <div className="divider divider-left" />
          <p className={styles.desc}>
            Ingin berkolaborasi atau memiliki pertanyaan? Jangan ragu untuk menghubungi kami melalui saluran resmi HMMJTM Teknik Mesin Universitas Bung Hatta.
          </p>

          <div className={styles.contactList}>
            {curSettings.address && curSettings.address !== '-' && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📍</div>
                <div>
                  <div className={styles.contactLabel}>Alamat</div>
                  <div className={styles.contactValue}>{curSettings.address}</div>
                </div>
              </div>
            )}
            {curSettings.email && curSettings.email !== '-' && curSettings.email.trim() !== '' && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>✉️</div>
                <div>
                  <div className={styles.contactLabel}>Email Resmi</div>
                  <a href={`mailto:${curSettings.email}`} className={styles.contactValue}>
                    {curSettings.email}
                  </a>
                </div>
              </div>
            )}
            {curSettings.phone && curSettings.phone !== '-' && curSettings.phone.trim() !== '' && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📞</div>
                <div>
                  <div className={styles.contactLabel}>Telepon</div>
                  <a href={`tel:${curSettings.phone}`} className={styles.contactValue}>{curSettings.phone}</a>
                </div>
              </div>
            )}
            {curSettings.whatsapp && curSettings.whatsapp !== '-' && curSettings.whatsapp.trim() !== '' && curSettings.whatsapp.replace(/\D/g,'') !== '' && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>💬</div>
                <div>
                  <div className={styles.contactLabel}>WhatsApp</div>
                  <a href={`https://wa.me/${curSettings.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className={styles.contactValue}>{curSettings.whatsapp}</a>
                </div>
              </div>
            )}
            {curSettings.instagram_hmmj && curSettings.instagram_hmmj !== '-' && (
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📷</div>
                <div>
                  <div className={styles.contactLabel}>Instagram Resmi</div>
                  <a href={curSettings.instagram_hmmj_url || 'https://www.instagram.com/himpunan_mesin_ubh/'} target="_blank" rel="noopener noreferrer" className={`${styles.contactValue} ${styles.igValue}`}>
                    {curSettings.instagram_hmmj}
                  </a>
                </div>
              </div>
            )}
          </div>

          {curSettings.instagram_hmmj_url && (
            <a
              href={curSettings.instagram_hmmj_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-primary ${styles.igBtn}`}
              id="contact-ig-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Follow Instagram HMMJTM
            </a>
          )}
        </div>

        <div className={styles.right}>
          {/* Maps Embed */}
          <div className={styles.mapWrap}>
            <iframe
              src={
                curSettings.maps_embed_url && (curSettings.maps_embed_url.includes('output=embed') || curSettings.maps_embed_url.includes('/maps/embed'))
                  ? curSettings.maps_embed_url
                  : `https://maps.google.com/maps?q=${encodeURIComponent(curSettings.address || 'Universitas Bung Hatta Kampus 3 Gunung Panggilun Padang')}&t=&z=16&ie=UTF8&iwloc=&output=embed`
              }
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '340px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kampus 3 Universitas Bung Hatta"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
