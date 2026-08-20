'use client'
import { useState, useEffect } from 'react'

export default function GeneralSettingsPage() {
  const [form, setForm] = useState({ organization_name: '', full_organization_name: '', faculty: '', university: '', period: '', tagline: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/v1/settings/general').then(r => r.json()).then(d => {
      setForm({ organization_name: d.organization_name, full_organization_name: d.full_organization_name, faculty: d.faculty, university: d.university, period: d.period, tagline: d.tagline || '' })
      setLoading(false)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/v1/settings/general', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    setMsg(data.success ? '✅ Pengaturan berhasil disimpan!' : '❌ Gagal menyimpan')
    setSaving(false); setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>

  const fields = [
    { key: 'organization_name', label: 'Nama Singkat Organisasi', placeholder: 'HMMJ Teknik Mesin' },
    { key: 'full_organization_name', label: 'Nama Lengkap Organisasi', placeholder: 'HIMPUNAN MASYARAKAT...' },
    { key: 'faculty', label: 'Fakultas', placeholder: 'Fakultas Teknologi Industri' },
    { key: 'university', label: 'Universitas', placeholder: 'Universitas Bung Hatta' },
    { key: 'period', label: 'Periode', placeholder: '2026/2027' },
    { key: 'tagline', label: 'Tagline', placeholder: 'Bersatu, Berkarya, Berprestasi' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>⚙️ Pengaturan Umum</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Informasi dasar organisasi yang ditampilkan di seluruh website</p>
      {msg && <div style={{ padding: '12px 18px', borderRadius: 10, background: msg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.includes('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msg.includes('✅') ? '#34D399' : '#F87171', marginBottom: '1.5rem', fontSize: '0.88rem' }}>{msg}</div>}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 680, background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', borderRadius: 20, padding: '2rem' }}>
        {fields.map(f => (
          <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
            <input type="text" className="input" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} id={`general-${f.key}`} />
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={saving} id="general-save-btn" style={{ alignSelf: 'flex-start' }}>
          {saving ? '⏳ Menyimpan...' : '💾 Simpan Pengaturan'}
        </button>
      </form>
    </div>
  )
}
