'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Member, Division } from '@/lib/data'
import styles from '@/app/dashboard/Dashboard.module.css'

interface DashboardOverviewClientProps {
  authName: string
  authRole: string
  initialMembers: Member[]
  initialDivisions: Division[]
}

export default function DashboardOverviewClient({
  authName,
  authRole,
  initialMembers,
  initialDivisions,
}: DashboardOverviewClientProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [divisions] = useState<Division[]>(initialDivisions)

  useEffect(() => {
    try {
      const localMembers = localStorage.getItem('hmmj_custom_members')
      if (localMembers !== null) {
        const parsedM = JSON.parse(localMembers)
        if (Array.isArray(parsedM)) {
          setMembers(parsedM)
        }
      }
    } catch {}
  }, [])

  const activeMembersCount = members.filter(m => m.active !== false).length
  const totalMembersCount = members.length

  const stats = [
    { label: 'Total Pengurus Aktif', value: activeMembersCount, icon: '👥', href: '/dashboard/members' },
    { label: 'Total Divisi Kerja', value: divisions.filter(d => d.id !== 'div-inti').length, icon: '🏢', href: '/dashboard/members' },
    { label: 'Keseluruhan Anggota', value: totalMembersCount, icon: '📋', href: '/dashboard/members' },
  ]

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Selamat datang, {authName}! 👋</h1>
          <p className={styles.sub}>
            {authRole === 'developer'
              ? '🔧 Developer — Akses penuh ke semua pengaturan sistem & tampilan'
              : '👤 Admin Pengurus — Kelola struktur organisasi, foto profil, & informasi'}
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(s => (
          <Link key={s.label} href={s.href} className={styles.statCard}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div className={styles.shortcuts}>
        <h2 className={styles.sectionTitle}>Aksi Utama</h2>
        <div className={styles.shortcutGrid}>
          <Link href="/dashboard/members" className={styles.shortcut} id="dash-quick-members">
            <span className={styles.shortcutIcon}>👥</span>
            <div>
              <div className={styles.shortcutTitle}>Kelola Pengurus & Edit Foto</div>
              <div className={styles.shortcutSub}>Upload foto profil, ganti data, tambah/hapus anggota</div>
            </div>
            <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/dashboard/about" className={styles.shortcut} id="dash-quick-about">
            <span className={styles.shortcutIcon}>📖</span>
            <div>
              <div className={styles.shortcutTitle}>Edit Tentang Kami</div>
              <div className={styles.shortcutSub}>Ubah deskripsi, visi misi, & slogan organisasi</div>
            </div>
            <span className={styles.arrow}>→</span>
          </Link>
          {authRole === 'developer' && (
            <>
              <Link href="/dashboard/settings/background" className={styles.shortcut} id="dash-quick-bg">
                <span className={styles.shortcutIcon}>🖼️</span>
                <div>
                  <div className={styles.shortcutTitle}>Ganti Background</div>
                  <div className={styles.shortcutSub}>Upload foto background banner website</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>
              <Link href="/dashboard/settings/contact" className={styles.shortcut} id="dash-quick-contact">
                <span className={styles.shortcutIcon}>📞</span>
                <div>
                  <div className={styles.shortcutTitle}>Pengaturan Kontak</div>
                  <div className={styles.shortcutSub}>Alamat sekretariat, WhatsApp, IG, & Maps</div>
                </div>
                <span className={styles.arrow}>→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
