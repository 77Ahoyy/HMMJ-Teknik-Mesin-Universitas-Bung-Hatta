'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Member, Division } from '@/lib/data'
import styles from './MembersSection.module.css'

interface MembersSectionProps {
  members: Member[]
  divisions: Division[]
}

export default function MembersSection({ members, divisions }: MembersSectionProps) {
  const [search, setSearch] = useState('')
  const [activeDiv, setActiveDiv] = useState('all')
  const [activeRole, setActiveRole] = useState('all')

  const filtered = useMemo(() => {
    let result = members
    const q = search.toLowerCase().trim()
    if (q) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.npm.toLowerCase().includes(q) ||
        m.jabatan.toLowerCase().includes(q) ||
        m.division_name.toLowerCase().includes(q)
      )
    }
    if (activeDiv !== 'all') result = result.filter(m => m.division_id === activeDiv)
    if (activeRole !== 'all') result = result.filter(m => m.role === activeRole)
    return result
  }, [members, search, activeDiv, activeRole])

  const allDivisions = [
    { id: 'all', name: 'Semua Divisi' },
    ...divisions
  ]

  return (
    <section className={styles.section} id="pengurus">
      <div className="container">
        <div className={styles.header}>
          <span className="section-tag">Pengurus</span>
          <h2 className="section-title">Daftar Pengurus</h2>
          <p className="section-subtitle">Pengurus HMMJ Teknik Mesin Periode 2026/2027</p>
          <div className="divider" />
        </div>

        {/* Search & Filter */}
        <div className={styles.controls}>
          <div className={`input-group ${styles.searchWrap}`}>
            <span className="input-icon">🔍</span>
            <input
              type="text"
              className="input"
              placeholder="Cari nama, NPM, jabatan, atau divisi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="members-search"
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div className={styles.filters}>
            <div className={styles.filterRow}>
              {allDivisions.map(d => (
                <button
                  key={d.id}
                  className={`${styles.filterBtn} ${activeDiv === d.id ? styles.filterActive : ''}`}
                  onClick={() => setActiveDiv(d.id)}
                  id={`filter-div-${d.id}`}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <div className={styles.filterRow}>
              {[
                { id: 'all', label: 'Semua Peran' },
                { id: 'ketua', label: 'Ketua' },
                { id: 'wakil', label: 'Wakil' },
                { id: 'sekretaris', label: 'Sekretaris' },
                { id: 'bendahara', label: 'Bendahara' },
                { id: 'koordinator', label: 'Koordinator' },
                { id: 'anggota', label: 'Anggota' },
              ].map(r => (
                <button
                  key={r.id}
                  className={`${styles.filterBtn} ${activeRole === r.id ? styles.filterActive : ''}`}
                  onClick={() => setActiveRole(r.id)}
                  id={`filter-role-${r.id}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result count */}
        <p className={styles.resultCount}>
          Menampilkan <strong>{filtered.length}</strong> dari {members.length} pengurus
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="no-results">
            <div className="icon">🔍</div>
            <h3>Tidak ditemukan</h3>
            <p>Coba kata kunci yang berbeda</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(m => (
              <div key={m.id} className={styles.card} id={`member-card-${m.id}`}>
                {/* Photo with zoom effect & overlay */}
                <div className={styles.photoContainer}>
                  <img
                    src={m.photo || '/images/members/default.jpg'}
                    alt={m.name}
                    className={styles.photoImg}
                  />
                  {/* Top Badge & Role */}
                  <div className={styles.topOverlay}>
                    <span className={styles.divBadge}>{m.division_name}</span>
                    <span className={styles.roleTag}>{m.role}</span>
                  </div>
                  {/* Name overlay */}
                  <div className={styles.nameOverlay}>
                    <h3 className={styles.name}>{m.name}</h3>
                    <p className={styles.jabatan}>{m.jabatan}</p>
                  </div>
                </div>

                {/* Bottom interactive footer */}
                <div className={styles.cardFooter}>
                  <div className={styles.memberMeta}>
                    <div className={styles.avatarWrap}>
                      <img
                        src={m.photo || '/images/members/default.jpg'}
                        alt={m.name}
                        className={styles.avatarImg}
                      />
                    </div>
                    <div className={styles.metaText}>
                      <span className={styles.npmText}>{m.npm}</span>
                      <span className={styles.igText}>{m.instagram || '@hmmj_mesin'}</span>
                    </div>
                  </div>
                  <Link href={`/pengurus/${m.id}`} className={styles.detailBtn}>
                    Profil →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.viewAll}>
          <Link href="/pengurus" className="btn btn-outline" id="members-view-all">
            Lihat Semua Pengurus →
          </Link>
        </div>
      </div>
    </section>
  )
}
