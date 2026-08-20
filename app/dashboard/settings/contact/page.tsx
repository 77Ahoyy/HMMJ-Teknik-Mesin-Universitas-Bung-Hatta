'use client'
import { useState, useEffect } from 'react'

export default function ContactSettingsPage() {
  const [form, setForm] = useState({
    address: '',
    email: '',
    phone: '',
    whatsapp: '',
    instagram_hmmj: '',
    instagram_hmmj_url: '',
    maps_url: '',
    maps_embed_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)

  useEffect(() => {
    fetch('/api/v1/settings/contact')
      .then(r => r.json())
      .then(d => {
        let current = {
          address: d.address || '',
          email: d.email || '',
          phone: d.phone || '',
          whatsapp: d.whatsapp || '',
          instagram_hmmj: d.instagram_hmmj || '',
          instagram_hmmj_url: d.instagram_hmmj_url || '',
          maps_url: d.maps_url || '',
          maps_embed_url: d.maps_embed_url || '',
        }

        try {
          const local = localStorage.getItem('hmmj_custom_settings')
          if (local) {
            const parsed = JSON.parse(local)
            current = { ...current, ...parsed }
          }
        } catch {}

        setForm(current)
        setLoading(false)
      })
      .catch(() => {
        try {
          const local = localStorage.getItem('hmmj_custom_settings')
          if (local) {
            const parsed = JSON.parse(local)
            setForm(f => ({ ...f, ...parsed }))
          }
        } catch {}
        setLoading(false)
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    // 1. Immediately update localStorage and Cloud Store for instant cross-device broadcast
    try {
      const local = localStorage.getItem('hmmj_custom_settings')
      const existing = local ? JSON.parse(local) : {}
      const updatedLocal = { ...existing, ...form }
      localStorage.setItem('hmmj_custom_settings', JSON.stringify(updatedLocal))
      fetch('/api/v1/cloud-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings', data: updatedLocal }),
      }).catch(() => {})
    } catch {}

    // 2. Sync to server in background
    try {
      const res = await fetch('/api/v1/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success || data.settings) {
        setIsSuccess(true)
        setMsg('✅ Pengaturan kontak dan email berhasil disimpan!')
      } else {
        setIsSuccess(true)
        setMsg('✅ Pengaturan kontak dan email berhasil disimpan di browser!')
      }
    } catch {
      setIsSuccess(true)
      setMsg('✅ Pengaturan kontak tersimpan!')
    }

    setSaving(false)
    setTimeout(() => setMsg(''), 4000)
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ padding: '4rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
          📞 Pengaturan Kontak & Email
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Kelola informasi alamat, email resmi, WhatsApp, nomor telepon, dan lokasi maps organisasi.
        </p>
      </div>

      {msg && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 12,
            background: isSuccess ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`,
            color: isSuccess ? '#34D399' : '#F87171',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {msg}
        </div>
      )}

      <form
        onSubmit={handleSave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-2)',
          borderRadius: 24,
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* SECTION 1: EMAIL & ALAMAT */}
        <div style={{ borderBottom: '1px solid var(--color-border-2)', paddingBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            📧 Kontak Utama & Alamat
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✉️ Email Resmi Organisasi
              </label>
              <input
                type="email"
                className="input"
                placeholder="hmmj.mesin@bunghatta.ac.id"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                id="contact-email"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Email resmi yang dapat dihubungi oleh pihak luar, kampus, atau mahasiswa.
              </span>
            </div>

            {/* Alamat */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📍 Alamat Sekretariat / Kampus
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="Kampus 3 Universitas Bung Hatta, Gunung Panggilun, Padang"
                value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                id="contact-address"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TELEPON & WHATSAPP */}
        <div style={{ borderBottom: '1px solid var(--color-border-2)', paddingBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            💬 Telepon & WhatsApp
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* WhatsApp */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                💬 Nomor WhatsApp (Format: 08xx / +62)
              </label>
              <input
                type="text"
                className="input"
                placeholder="081234567890"
                value={form.whatsapp}
                onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                id="contact-whatsapp"
              />
            </div>

            {/* Telepon */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📞 Nomor Telepon Kantor (Opsional)
              </label>
              <input
                type="text"
                className="input"
                placeholder="(0751) 12345"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                id="contact-phone"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: INSTAGRAM */}
        <div style={{ borderBottom: '1px solid var(--color-border-2)', paddingBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            📷 Instagram Resmi
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Username Instagram
              </label>
              <input
                type="text"
                className="input"
                placeholder="@himpunan_mesin_ubh"
                value={form.instagram_hmmj}
                onChange={e => setForm(f => ({ ...f, instagram_hmmj: e.target.value }))}
                id="contact-instagram"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                URL Profil Instagram
              </label>
              <input
                type="text"
                className="input"
                placeholder="https://www.instagram.com/himpunan_mesin_ubh/"
                value={form.instagram_hmmj_url}
                onChange={e => setForm(f => ({ ...f, instagram_hmmj_url: e.target.value }))}
                id="contact-instagram-url"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: GOOGLE MAPS */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
            🗺️ Lokasi Google Maps
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Google Maps URL (Tautan Buka Maps)
              </label>
              <input
                type="text"
                className="input"
                placeholder="https://maps.app.goo.gl/..."
                value={form.maps_url}
                onChange={e => setForm(f => ({ ...f, maps_url: e.target.value }))}
                id="contact-maps-url"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Google Maps Embed URL (Peta Interaktif)
              </label>
              <input
                type="text"
                className="input"
                placeholder="https://maps.google.com/maps?q=Universitas+Bung+Hatta...&output=embed"
                value={form.maps_embed_url}
                onChange={e => setForm(f => ({ ...f, maps_embed_url: e.target.value }))}
                id="contact-maps-embed-url"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          id="contact-save-btn"
          style={{ alignSelf: 'flex-start', padding: '12px 28px', fontSize: '0.92rem', marginTop: '0.5rem' }}
        >
          {saving ? '⏳ Menyimpan...' : '💾 Simpan Pengaturan Kontak'}
        </button>
      </form>
    </div>
  )
}
