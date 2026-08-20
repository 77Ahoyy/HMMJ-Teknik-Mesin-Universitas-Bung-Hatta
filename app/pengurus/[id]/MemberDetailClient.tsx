'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Member, Settings } from '@/lib/data'
import styles from './MemberDetail.module.css'

interface MemberDetailClientProps {
  member: Member
  settings: Settings
}

export default function MemberDetailClient({ member, settings }: MemberDetailClientProps) {
  const [curMember, setCurMember] = useState<Member>(member)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    let hasLocal = false
    try {
      const custom = localStorage.getItem('hmmj_custom_members')
      if (custom) {
        const parsed = JSON.parse(custom)
        const found = parsed.find((m: Member) => m.id === member.id)
        if (found) {
          setCurMember(found)
          hasLocal = true
        }
      }
    } catch {}

    // Fetch API for mobile devices (iPhone / Android)
    fetch('/api/v1/members?all=true')
      .then(r => r.json())
      .then(d => {
        if (d.members && Array.isArray(d.members)) {
          const found = d.members.find((m: Member) => m.id === member.id)
          if (found && !hasLocal) {
            setCurMember(found)
          }
        }
      })
      .catch(() => {})
  }, [member.id])

  const hasCustomPhoto = Boolean(
    curMember.photo &&
      curMember.photo !== '/images/members/default.jpg' &&
      !curMember.photo.includes('default.jpg')
  )
  const photoUrl = curMember.photo || '/images/members/default.jpg'

  const initials = curMember.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <div className={styles.card}>
        {/* Photo Column with Square/Rectangular Photo */}
        <div className={styles.photoSide}>
          <div
            className={styles.photoSquareWrap}
            onClick={() => hasCustomPhoto && setLightboxOpen(true)}
            title={hasCustomPhoto ? 'Klik untuk melihat foto ukuran penuh' : member.name}
            style={{ cursor: hasCustomPhoto ? 'pointer' : 'default' }}
          >
            {hasCustomPhoto ? (
              <>
                <img
                  src={photoUrl}
                  alt={member.name}
                  className={styles.photoSquare}
                />
                <div className={styles.photoHoverOverlay}>
                  <span className={styles.zoomIcon}>🔍</span>
                  <span className={styles.zoomText}>Lihat Foto</span>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #132238 0%, #0c1524 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #c9a84c, #e8c97e)',
                    color: '#070f1e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.2rem',
                    fontWeight: 900,
                    boxShadow: '0 8px 24px rgba(201, 168, 76, 0.3)',
                    marginBottom: '12px',
                  }}
                >
                  {initials}
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: 600,
                  }}
                >
                  HMMJ TEKNIK MESIN
                </span>
              </div>
            )}
            <div className={styles.photoBadge}>{member.role}</div>
          </div>

          {member.instagram && (
            <a
              href={
                member.instagram_url ||
                `https://www.instagram.com/${member.instagram.replace('@', '')}/`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.igBtn}
              id={`member-ig-btn-${member.id}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>{member.instagram}</span>
            </a>
          )}
        </div>

        {/* Info Column */}
        <div className={styles.infoSide}>
          <div className={styles.tag}>{curMember.division_name}</div>
          <h1 className={styles.name}>{curMember.name}</h1>
          <p className={styles.jabatan}>{curMember.jabatan}</p>
          <div className="divider divider-left" />

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>NPM</span>
              <span className={styles.detailValue}>{curMember.npm}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Alamat</span>
              <span className={styles.detailValue}>{curMember.address ? curMember.address : '-'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Instagram</span>
              <span className={styles.detailValue}>
                {curMember.instagram ? (
                  <a
                    href={
                      curMember.instagram_url ||
                      `https://www.instagram.com/${curMember.instagram.replace('@', '')}/`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#E8C97E', textDecoration: 'underline' }}
                  >
                    {curMember.instagram}
                  </a>
                ) : (
                  <span>-</span>
                )}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>WhatsApp</span>
              <span className={styles.detailValue}>
                {curMember.whatsapp ? (
                  <a
                    href={`https://wa.me/${curMember.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10B981', textDecoration: 'none', fontWeight: 600 }}
                  >
                    💬 {curMember.whatsapp}
                  </a>
                ) : (
                  <span>-</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full-Size Photo Viewing */}
      {lightboxOpen && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxOpen(false)}
              aria-label="Tutup Foto"
            >
              ✕
            </button>
            <img
              src={photoUrl}
              alt={curMember.name}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxCaption}>
              <h4>{curMember.name}</h4>
              <p>{curMember.jabatan} — {curMember.division_name}</p>
              <a
                href={photoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.lightboxDirectLink}
              >
                Buka Foto Asli ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
