'use client'
import { useState, useEffect } from 'react'

export default function SocialSettingsPage() {
  const [form, setForm] = useState({ instagram_hmmj: '', instagram_hmmj_url: '', instagram_creator: '', instagram_creator_url: '', creator_name: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/v1/settings/general').then(r => r.json()).then(d => {
      setForm({ instagram_hmmj: d.instagram_hmmj || '', instagram_hmmj_url: d.instagram_hmmj_url || '', instagram_creator: d.instagram_creator || '', instagram_creator_url: d.instagram_creator_url || '', creator_name: d.creator_name || '' })
      setLoading(false)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/v1/settings/general', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setMsg(data.success ? '✅ Berhasil disimpan!' : '❌ Gagal menyimpan')
    setSaving(false); setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>📱 Media Sosial</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Pengaturan akun media sosial HMMJ dan Creator</p>
      {msg && <div style={{ padding: '12px 18px', borderRadius: 10, background: msg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.includes('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.includes('✅') ? '#34D399' : '#F87171', marginBottom: '1.5rem', fontSize: '0.88rem' }}>{msg}</div>}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 680 }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', borderRadius: 20, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>🏢 Instagram Organisasi HMMJ</h3>
          {[{ key: 'instagram_hmmj', label: 'Username Instagram HMMJ', placeholder: '@himpunan_mesin_ubh' }, { key: 'instagram_hmmj_url', label: 'URL Instagram HMMJ', placeholder: 'https://www.instagram.com/himpunan_mesin_ubh/' }].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              <input type="text" className="input" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} id={`social-${f.key}`} />
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', borderRadius: 20, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-dim)', marginBottom: '1rem' }}>🎨 Instagram Creator (Watermark)</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Ditampilkan hanya pada watermark "Creator by Kifli" di footer</p>
          {[{ key: 'creator_name', label: 'Nama Creator', placeholder: 'Kifli' }, { key: 'instagram_creator', label: 'Username Creator', placeholder: '@zalkii.syhrll6' }, { key: 'instagram_creator_url', label: 'URL Instagram Creator', placeholder: 'https://www.instagram.com/zalkii.syhrll6/' }].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
              <input type="text" className="input" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} id={`social-${f.key}`} />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving} id="social-save-btn" style={{ alignSelf: 'flex-start' }}>
          {saving ? '⏳ Menyimpan...' : '💾 Simpan Pengaturan'}
        </button>
      </form>
    </div>
  )
}
