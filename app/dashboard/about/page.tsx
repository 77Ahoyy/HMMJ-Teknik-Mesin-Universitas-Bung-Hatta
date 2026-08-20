'use client'
import { useState, useEffect } from 'react'
import styles from './AboutAdmin.module.css'

export default function AboutAdminPage() {
  const [form, setForm] = useState({
    about_title: '',
    about_subtitle: '',
    about_description_1: '',
    about_description_2: '',
    about_description_3: '',
    about_pillars_str: '',
    about_vision: '',
    about_mission: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [toastOk, setToastOk] = useState(true)

  useEffect(() => {
    fetch('/api/v1/settings/general')
      .then(r => r.json())
      .then(d => {
        setForm({
          about_title: d.about_title || 'Mengenal HMMJ Teknik Mesin',
          about_subtitle: d.about_subtitle || 'Tentang Kami',
          about_description_1: d.about_description_1 || '',
          about_description_2: d.about_description_2 || '',
          about_description_3: d.about_description_3 || '',
          about_pillars_str: Array.isArray(d.about_pillars) ? d.about_pillars.join(', ') : 'Kepemimpinan, Kreativitas, Akademik, Solidaritas, Inovasi',
          about_vision: d.about_vision || '',
          about_mission: d.about_mission || '',
        })
        setLoading(false)
      })
  }, [])

  function showToast(msg: string, ok = true) {
    setToast(msg)
    setToastOk(ok)
    setTimeout(() => setToast(''), 3500)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const pillars = form.about_pillars_str
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      about_title: form.about_title,
      about_subtitle: form.about_subtitle,
      about_description_1: form.about_description_1,
      about_description_2: form.about_description_2,
      about_description_3: form.about_description_3,
      about_pillars: pillars,
      about_vision: form.about_vision,
      about_mission: form.about_mission,
    }

    try {
      const res = await fetch('/api/v1/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        showToast('✅ Konten Tentang Kami berhasil disimpan!')
      } else {
        showToast('❌ ' + (data.error || 'Gagal menyimpan'), false)
      }
    } catch {
      showToast('❌ Gagal menghubungi server', false)
    }
    setSaving(false)
  }

  if (loading) return <div className="flex-center" style={{ padding: '4rem' }}><div className="spinner" /></div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📖 Edit Tentang Kami</h1>
          <p className={styles.sub}>Sesuaikan teks profil, deskripsi, nilai pilar, serta visi & misi organisasi</p>
        </div>
      </div>

      {toast && (
        <div className={`${styles.toast} ${toastOk ? styles.toastOk : styles.toastErr}`}>
          {toast}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form}>
        {/* Card 1: Judul & Subtitle */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>🏷️ Header & Tagline</h3>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Sub-Judul (Badge)</label>
              <input
                type="text"
                className="input"
                placeholder="Contoh: Tentang Kami"
                value={form.about_subtitle}
                onChange={e => setForm(f => ({ ...f, about_subtitle: e.target.value }))}
                id="field-about-subtitle"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Judul Utama</label>
              <input
                type="text"
                className="input"
                placeholder="Contoh: Mengenal HMMJ Teknik Mesin"
                value={form.about_title}
                onChange={e => setForm(f => ({ ...f, about_title: e.target.value }))}
                id="field-about-title"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Paragraf Deskripsi */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>📝 Paragraf Deskripsi Organisasi</h3>
          <div className={styles.field}>
            <label className={styles.label}>Paragraf 1 (Pengenalan Singkat)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Jelaskan mengenai HMMJ secara umum..."
              value={form.about_description_1}
              onChange={e => setForm(f => ({ ...f, about_description_1: e.target.value }))}
              id="field-about-desc1"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Paragraf 2 (Fungsi & Komitmen)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Jelaskan wadah pengembangan, visi lulusan, program kerja..."
              value={form.about_description_2}
              onChange={e => setForm(f => ({ ...f, about_description_2: e.target.value }))}
              id="field-about-desc2"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Paragraf 3 (Semangat & Slogan)</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Jelaskan semangat kepengurusan / moto..."
              value={form.about_description_3}
              onChange={e => setForm(f => ({ ...f, about_description_3: e.target.value }))}
              id="field-about-desc3"
            />
          </div>
        </div>

        {/* Card 3: Nilai Pilar */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>💎 Pilar Nilai Organisasi</h3>
          <div className={styles.field}>
            <label className={styles.label}>Daftar Nilai (Pisahkan dengan Koma)</label>
            <input
              type="text"
              className="input"
              placeholder="Kepemimpinan, Kreativitas, Akademik, Solidaritas, Inovasi"
              value={form.about_pillars_str}
              onChange={e => setForm(f => ({ ...f, about_pillars_str: e.target.value }))}
              id="field-about-pillars"
            />
            <span className={styles.hint}>Akan ditampilkan sebagai tag/pill kapsul di bawah deskripsi Tentang Kami.</span>
          </div>
        </div>

        {/* Card 4: Visi & Misi */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>🎯 Visi & Misi (Opsional)</h3>
          <div className={styles.field}>
            <label className={styles.label}>Visi</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Tulis visi organisasi..."
              value={form.about_vision}
              onChange={e => setForm(f => ({ ...f, about_vision: e.target.value }))}
              id="field-about-vision"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Misi</label>
            <textarea
              className="input"
              rows={4}
              placeholder="1. Misi pertama&#10;2. Misi kedua..."
              value={form.about_mission}
              onChange={e => setForm(f => ({ ...f, about_mission: e.target.value }))}
              id="field-about-mission"
            />
          </div>
        </div>

        {/* Submit */}
        <div className={styles.actions}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            id="btn-save-about"
          >
            {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan Tentang Kami'}
          </button>
        </div>
      </form>
    </div>
  )
}
