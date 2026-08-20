'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Member, Division } from '@/lib/data'
import styles from './OrgChartSection.module.css'

interface OrgChartSectionProps {
  members: Member[]
  divisions: Division[]
}

const DIVISION_ICONS: Record<string, string> = {
  'div-kaderisasi': '🎯',
  'div-kemahasiswaan': '🎓',
  'div-minatbakat': '🏆',
  'div-humas': '📢',
  'div-danus': '💰',
  'div-kominfo': '💻',
}

// Reusable Profile Card component for structure
function OrgProfileCard({
  member,
  highlight = false,
  badgeColor,
  isKoordinator = false,
}: {
  member: Member
  highlight?: boolean
  badgeColor?: string
  isKoordinator?: boolean
}) {
  const photoUrl = member.photo && member.photo.trim() !== '' ? member.photo : '/images/members/default.jpg'

  return (
    <div
      className={`${styles.profileCard} ${highlight ? styles.highlightCard : ''} ${isKoordinator ? styles.coordHighlight : ''}`}
      id={`org-card-${member.id}`}
    >
      {/* Image with zoom effect */}
      <div className={styles.imageContainer}>
        <img
          src={photoUrl}
          alt={member.name}
          className={styles.imageScale}
          onError={(e) => {
            const target = e.currentTarget
            if (target.src !== window.location.origin + '/images/members/default.jpg') {
              target.src = '/images/members/default.jpg'
            }
          }}
        />

        {/* Top Badges */}
        <div className={styles.topBadges}>
          <span
            className={styles.divTag}
            style={badgeColor ? { borderColor: badgeColor, color: badgeColor } : {}}
          >
            {member.division_name}
          </span>
          <span className={`${styles.roleTag} ${isKoordinator ? styles.roleTagCoord : ''}`}>
            {isKoordinator ? '👑 Koordinator' : member.role}
          </span>
        </div>
        
        {/* Name Overlay with Dark Gradient */}
        <div className={styles.nameOverlay}>
          <h3 className={styles.memberName}>{member.name}</h3>
          <p className={styles.memberJabatan}>{member.jabatan}</p>
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.metaLeft}>
          <div className={styles.miniAvatar}>
            <img
              src={photoUrl}
              alt={member.name}
              onError={(e) => {
                const target = e.currentTarget
                if (target.src !== window.location.origin + '/images/members/default.jpg') {
                  target.src = '/images/members/default.jpg'
                }
              }}
            />
          </div>
          <div className={styles.metaText}>
            <span className={styles.npmVal}>{member.npm && member.npm !== '-' ? `NPM ${member.npm}` : 'Teknik Mesin UBH'}</span>
            <span className={styles.igVal}>{member.instagram || '@himpunan_mesin_ubh'}</span>
          </div>
        </div>
        <Link href={`/pengurus/${member.id}`} className={styles.actionBtn}>
          Profil →
        </Link>
      </div>
    </div>
  )
}

export default function OrgChartSection({ members, divisions }: OrgChartSectionProps) {
  const nonIntiDivisions = divisions.filter(d => d.id !== 'div-inti')
  const [selectedDiv, setSelectedDiv] = useState<string>(nonIntiDivisions[0]?.id || 'div-kaderisasi')
  const [memberList, setMemberList] = useState<Member[]>(members)

  // Fetch latest members for ALL visitors (any device, any email)
  useEffect(() => {
    try {
      const custom = localStorage.getItem('hmmj_custom_members')
      if (custom) {
        const parsed = JSON.parse(custom)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMemberList(parsed)
        }
      }
    } catch {}

    fetch('/api/v1/cloud-store?type=members')
      .then(r => r.json())
      .then(d => {
        if (d.members && Array.isArray(d.members) && d.members.length > 0) {
          setMemberList(d.members)
        }
      })
      .catch(() => {
        fetch('/api/v1/members?all=true')
          .then(r => r.json())
          .then(d => {
            if (d.members && Array.isArray(d.members) && d.members.length > 0) {
              setMemberList(d.members)
            }
          })
          .catch(() => {})
      })
  }, [members])

  // Strictly filter only active members
  const activeMembers = memberList.filter(m => Boolean(m.active) && m.active !== false)

  const inti = activeMembers.filter(m => m.division_id === 'div-inti')
  const ketua = inti.find(m => m.role === 'ketua')
  const wakil = inti.find(m => m.role === 'wakil')
  const sek = inti.find(m => m.role === 'sekretaris')
  const bendahara = inti.find(m => m.role === 'bendahara')

  // Currently active single division
  const currentDivision = nonIntiDivisions.find(d => d.id === selectedDiv) || nonIntiDivisions[0]
  const koordinator = currentDivision ? activeMembers.find(
    m => m.division_id === currentDivision.id && m.role === 'koordinator'
  ) : null
  const anggota = currentDivision ? activeMembers.filter(
    m => m.division_id === currentDivision.id && m.role === 'anggota'
  ) : []

  return (
    <section className={styles.section} id="struktur">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <span className="section-tag">Struktur Organisasi</span>
          <h2 className="section-title">Bagan Kepengurusan HMMJTM</h2>
          <p className="section-subtitle">
            Himpunan Masyarakat Mahasiswa Jurusan Teknik Mesin Periode 2026/2027
          </p>
          <div className="divider" />
        </div>

        {/* ========================================================
            1. PENGURUS INTI (HIERARCHY CHART)
            ======================================================== */}
        <div className={styles.intiBlock}>
          <div className={styles.blockBadgeWrap}>
            <span className={styles.blockBadge}>⭐ Pengurus Inti HMMJTM</span>
          </div>

          <div className={styles.intiTree}>
            {/* Ketua */}
            {ketua && (
              <div className={styles.treeLevel}>
                <OrgProfileCard member={ketua} highlight />
              </div>
            )}

            {/* Connecting Vertical Line */}
            {ketua && wakil && <div className={styles.treeVLine} />}

            {/* Wakil Ketua */}
            {wakil && (
              <div className={styles.treeLevel}>
                <OrgProfileCard member={wakil} highlight />
              </div>
            )}

            {/* Connecting Lines to Sekretaris & Bendahara */}
            {(sek || bendahara) && (
              <>
                <div className={styles.treeVLine} />
                <div className={styles.treeHLineWrap}>
                  <div className={styles.treeHLine} />
                </div>
                <div className={styles.treePairLevel}>
                  {sek && <OrgProfileCard member={sek} />}
                  {bendahara && <OrgProfileCard member={bendahara} />}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ========================================================
            2. STRUKTUR PER-DIVISI (INTERACTIVE COMPACT VIEW)
            ======================================================== */}
        <div className={styles.divisiBlock}>
          <div className={styles.divisiSectionHeader}>
            <div className={styles.blockBadgeWrap}>
              <span className={styles.blockBadgeDiv}>🏢 Struktur 6 Divisi Kerja</span>
            </div>
            <h3 className={styles.divisiMainHeading}>Pilih Divisi Untuk Melihat Pengurus</h3>
            <p className={styles.divisiDesc}>
              Klik salah satu divisi di bawah ini untuk melihat Koordinator dan Anggota divisi terkait secara ringkas dan rapi.
            </p>

            {/* Interactive Division Cards Grid */}
            <div className={styles.divisionSelectorGrid}>
              {nonIntiDivisions.map(div => {
                const count = activeMembers.filter(m => m.division_id === div.id).length
                const isSelected = selectedDiv === div.id
                const icon = DIVISION_ICONS[div.id] || '⚙️'

                return (
                  <button
                    key={div.id}
                    onClick={() => setSelectedDiv(div.id)}
                    className={`${styles.divTabBtn} ${isSelected ? styles.divTabActive : ''}`}
                    style={{ '--div-color': div.color } as any}
                    id={`tab-div-${div.slug}`}
                  >
                    <span className={styles.tabIcon}>{icon}</span>
                    <div className={styles.tabInfo}>
                      <span className={styles.tabName}>{div.name.replace('Divisi ', '')}</span>
                      <span className={styles.tabCount}>{count} Personil</span>
                    </div>
                    {isSelected && <span className={styles.activeIndicator} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Single Active Division Panel */}
          {currentDivision && (
            <div
              key={currentDivision.id}
              className={styles.divisionCard}
              style={{ '--div-theme': currentDivision.color } as any}
            >
              {/* Division Header Banner */}
              <div className={styles.divHeader}>
                <div className={styles.divHeaderLeft}>
                  <span className={styles.divIconLarge}>
                    {DIVISION_ICONS[currentDivision.id] || '⚙️'}
                  </span>
                  <div>
                    <div className={styles.divTitleRow}>
                      <h3 className={styles.divTitle}>{currentDivision.name}</h3>
                      <span className={styles.divTagInline}>HMMJ 2026/2027</span>
                    </div>
                    <p className={styles.divSubtitle}>{currentDivision.description}</p>
                  </div>
                </div>
                <span className={styles.memberCountBadge}>
                  {(koordinator ? 1 : 0) + anggota.length} Personil Aktif
                </span>
              </div>

              <div className={styles.divContent}>
                {/* Koordinator Column */}
                {koordinator && (
                  <div className={styles.coordColumn}>
                    <span className={styles.roleSubHeader}>
                      👑 Koordinator Divisi
                    </span>
                    <div className={styles.coordCardWrap}>
                      <OrgProfileCard
                        member={koordinator}
                        highlight
                        isKoordinator
                        badgeColor={currentDivision.color}
                      />
                    </div>
                  </div>
                )}

                {/* Anggota Column */}
                {anggota.length > 0 && (
                  <div className={styles.anggotaColumn}>
                    <span className={styles.roleSubHeader}>
                      👥 Anggota Divisi ({anggota.length})
                    </span>
                    <div className={styles.anggotaCardsGrid}>
                      {anggota.map(m => (
                        <OrgProfileCard
                          key={m.id}
                          member={m}
                          badgeColor={currentDivision.color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {!koordinator && anggota.length === 0 && (
                  <div className={styles.emptyDiv}>
                    <span>Belum ada data pengurus di divisi ini.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Link to Full Struktur */}
        <div className={styles.viewAll}>
          <Link href="/kontak" className="btn btn-primary" id="org-view-kontak">
            Hubungi Pengurus HMMJTM →
          </Link>
        </div>
      </div>
    </section>
  )
}
