'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './BackgroundSettings.module.css'

interface Background {
  id: string
  section: string
  label: string
  image_url: string
  overlay: number
  position: string
}

export default function BackgroundSettingsPage() {
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/v1/settings/background')
      .then(r => r.json())
      .then(data => {
        let list: Background[] = Array.isArray(data) ? data : []
        try {
          const local = localStorage.getItem('hmmj_custom_backgrounds')
          if (local) {
            const parsed = JSON.parse(local)
            if (Array.isArray(parsed) && parsed.length > 0) {
              list = list.map(b => {
                const found = parsed.find((p: Background) => p.id === b.id)
                return found ? { ...b, ...found } : b
              })
            }
          }
        } catch {}
        // Filter only active sections (hero, about, contact)
        const relevant = list.filter(b => ['hero', 'about', 'contact'].includes(b.section))
        setBackgrounds(relevant.length > 0 ? relevant : list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function showToast(text: string, ok = true) {
    setMsg(text)
    setMsgOk(ok)
    setTimeout(() => setMsg(''), 3500)
  }

  function updateLocalAndState(newBgs: Background[]) {
    setBackgrounds(newBgs)
    try {
      localStorage.setItem('hmmj_custom_backgrounds', JSON.stringify(newBgs))
    } catch {}
  }

  async function handleUpload(section: string, file: File) {
    setUploading(section)
    try {
      // 1. Fast client-side image compression
      const { compressImage } = await import('@/lib/image-utils')
      const compressedDataUrl = await compressImage(file, 1600, 1000, 0.82)

      const targetBg = backgrounds.find(b => b.section === section)
      if (targetBg) {
        const updated = { ...targetBg, image_url: compressedDataUrl }
        const updatedList = backgrounds.map(b => b.section === section ? updated : b)
        updateLocalAndState(updatedList)
      }

      // 2. Upload to server API
      try {
        const fd = new FormData()
        fd.append('section', section)
        fd.append('image_url', compressedDataUrl)
        
        const resBlob = await fetch(compressedDataUrl)
        const blobData = await resBlob.blob()
        fd.append('file', blobData, file.name || `bg-${section}.jpg`)

        const res = await fetch('/api/v1/settings/background', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.success && data.backgrounds) {
          updateLocalAndState(data.backgrounds.filter((b: Background) => ['hero', 'about', 'contact'].includes(b.section)))
        }
      } catch {
        // Fallback already saved in localStorage
      }

      showToast('✅ Foto background berhasil dipasang!')
    } catch (err: any) {
      showToast('❌ Gagal memproses foto background', false)
    } finally {
      setUploading(null)
    }
  }

  async function handleUpdate(bg: Background) {
    setSaving(bg.id)
    const updatedList = backgrounds.map(b => b.id === bg.id ? bg : b)
    updateLocalAndState(updatedList)

    try {
      const res = await fetch('/api/v1/settings/background', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bg),
      })
      const data = await res.json()
      if (data.success && data.backgrounds) {
        updateLocalAndState(data.backgrounds.filter((b: Background) => ['hero', 'about', 'contact'].includes(b.section)))
        showToast('✅ Pengaturan background berhasil disimpan!')
      } else {
        showToast('✅ Pengaturan background tersimpan di browser!')
      }
    } catch {
      showToast('✅ Pengaturan background tersimpan di browser!')
    } finally {
      setSaving(null)
    }
  }

  async function handleReset(bg: Background) {
    const defaultOverlays: Record<string, number> = { hero: 0.55, about: 0.7, contact: 0.75 }
    const updated: Background = {
      ...bg,
      image_url: '',
      overlay: defaultOverlays[bg.section] ?? 0.6,
      position: 'center',
    }

    const updatedList = backgrounds.map(b => b.id === bg.id ? updated : b)
    updateLocalAndState(updatedList)
    showToast(`🔄 Background ${bg.label} berhasil di-reset ke default!`)

    try {
      await fetch('/api/v1/settings/background', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ padding: '4rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🖼️ Pengaturan Background</h1>
          <p className={styles.sub}>Upload dan kelola foto background untuk setiap bagian website</p>
        </div>
      </div>

      {msg && (
        <div className={`${styles.toast} ${!msgOk ? styles.toastError : styles.toastSuccess}`}>
          {msg}
        </div>
      )}

      <div className={styles.grid}>
        {backgrounds.map(bg => (
          <div key={bg.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{bg.label}</h3>
              <span className={styles.sectionTag}>{bg.section.toUpperCase()}</span>
            </div>

            {/* Preview */}
            <div className={styles.preview}>
              {bg.image_url ? (
                <div
                  className={styles.previewImg}
                  style={{
                    backgroundImage: `url(${bg.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: bg.position,
                  }}
                >
                  <div className={styles.previewOverlay} style={{ opacity: bg.overlay }} />
                  <span className={styles.previewLabel}>Preview Aktif</span>
                </div>
              ) : (
                <div className={styles.previewEmpty}>
                  <span style={{ fontSize: '2.5rem' }}>🖼️</span>
                  <span>Menggunakan Background Default (Polos Elegan)</span>
                </div>
              )}
            </div>

            {/* Upload & Reset Buttons */}
            <div className={styles.actions} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                ref={el => { fileRefs.current[bg.id] = el }}
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(bg.section, file)
                  e.target.value = ''
                }}
                id={`upload-${bg.id}`}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => fileRefs.current[bg.id]?.click()}
                disabled={uploading === bg.section}
                id={`btn-upload-${bg.id}`}
              >
                {uploading === bg.section ? '⏳ Memproses...' : '📤 Upload Foto'}
              </button>
              
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleReset(bg)}
                id={`btn-reset-${bg.id}`}
                title="Kembalikan background ke tampilan default"
              >
                🔄 Reset Background
              </button>
            </div>

            {/* Settings */}
            <div className={styles.settings}>
              <div className={styles.settingRow}>
                <label className={styles.settingLabel}>
                  Overlay Gelap: <strong>{Math.round(bg.overlay * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bg.overlay}
                  onChange={e =>
                    setBackgrounds(bgs =>
                      bgs.map(b => (b.id === bg.id ? { ...b, overlay: parseFloat(e.target.value) } : b))
                    )
                  }
                  className={styles.slider}
                />
              </div>
              <div className={styles.settingRow}>
                <label className={styles.settingLabel}>Posisi Background</label>
                <select
                  value={bg.position}
                  onChange={e =>
                    setBackgrounds(bgs =>
                      bgs.map(b => (b.id === bg.id ? { ...b, position: e.target.value } : b))
                    )
                  }
                  className="input"
                  style={{ padding: '8px 12px' }}
                >
                  {['center', 'top', 'bottom', 'left', 'right', 'center top', 'center bottom'].map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleUpdate(bg)}
                disabled={saving === bg.id}
                id={`btn-save-${bg.id}`}
                style={{ width: '100%' }}
              >
                {saving === bg.id ? '⏳ Menyimpan...' : '💾 Simpan Pengaturan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
