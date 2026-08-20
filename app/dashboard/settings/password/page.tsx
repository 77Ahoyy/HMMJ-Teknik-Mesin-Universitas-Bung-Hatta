'use client'
import { useState } from 'react'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (form.new_password !== form.confirm_password) {
      setMsg('❌ Konfirmasi password baru tidak cocok')
      setMsgOk(false)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/v1/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setMsg('✅ ' + data.message)
        setMsgOk(true)
        setForm({ current_password: '', new_password: '', confirm_password: '' })
      } else {
        setMsg('❌ ' + (data.error || 'Gagal mengubah password'))
        setMsgOk(false)
      }
    } catch {
      setMsg('❌ Terjadi kesalahan server')
      setMsgOk(false)
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 4000)
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>
        🔐 Ganti Password
      </h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        Perbarui kata sandi akun Anda untuk keamanan yang lebih baik
      </p>

      {msg && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 10,
            background: msgOk ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${msgOk ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: msgOk ? '#34D399' : '#F87171',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            maxWidth: 540,
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
          gap: '1.25rem',
          maxWidth: 540,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-2)',
          borderRadius: 20,
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Password Saat Ini *
          </label>
          <input
            type="password"
            className="input"
            placeholder="Masukkan password lama..."
            value={form.current_password}
            onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))}
            required
            id="current-password"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Password Baru *
          </label>
          <input
            type="password"
            className="input"
            placeholder="Minimal 6 karakter unik..."
            value={form.new_password}
            onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))}
            required
            id="new-password"
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Gunakan kombinasi huruf, angka, dan simbol unik untuk menghindari peringatan kebocoran data di browser.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Konfirmasi Password Baru *
          </label>
          <input
            type="password"
            className="input"
            placeholder="Ulangi password baru..."
            value={form.confirm_password}
            onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))}
            required
            id="confirm-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          id="btn-submit-password"
          style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
        >
          {saving ? '⏳ Menyimpan...' : '💾 Perbarui Password'}
        </button>
      </form>
    </div>
  )
}
