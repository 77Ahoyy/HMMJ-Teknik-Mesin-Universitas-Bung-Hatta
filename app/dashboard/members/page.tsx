'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './MembersAdmin.module.css'

interface Division {
  id: string
  name: string
  color: string
}

interface Member {
  id: string
  name: string
  npm: string
  jabatan: string
  jabatan_order: number
  division_id: string
  division_name: string
  role: string
  photo: string
  instagram: string
  instagram_url: string
  address?: string
  whatsapp?: string
  period: string
  active: boolean
}

const ROLES = [
  { value: 'ketua', label: 'Ketua Himpunan' },
  { value: 'wakil', label: 'Wakil Himpunan' },
  { value: 'sekretaris', label: 'Sekretaris' },
  { value: 'bendahara', label: 'Bendahara' },
  { value: 'koordinator', label: 'Koordinator Divisi' },
  { value: 'anggota', label: 'Anggota Divisi' },
]

const EMPTY: Omit<Member, 'id'> = {
  name: '',
  npm: '',
  jabatan: '',
  jabatan_order: 99,
  division_id: 'div-inti',
  division_name: 'Pengurus Inti',
  role: 'anggota',
  photo: '/images/members/default.jpg',
  instagram: '',
  instagram_url: '',
  address: '',
  whatsapp: '',
  period: '2026/2027',
  active: true,
}

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [divFilter, setDivFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [toast, setToast] = useState('')
  const [toastOk, setToastOk] = useState(true)

  // Modal state
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<Member | null>(null)
  const [form, setForm] = useState<Omit<Member, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/members?all=true').then(r => r.json()),
      fetch('/api/v1/divisions').then(r => r.json()),
    ]).then(([md, dd]) => {
      let serverList: Member[] = md.members || []
      try {
        const custom = localStorage.getItem('hmmj_custom_members')
        if (custom !== null) {
          const localList: Member[] = JSON.parse(custom)
          if (Array.isArray(localList)) {
            serverList = localList
          }
        }
      } catch {}
      setMembers(serverList)
      setDivisions(Array.isArray(dd) ? dd : [])
      setLoading(false)
    })
  }, [])

  function showToast(msg: string, ok = true) {
    setToast(msg)
    setToastOk(ok)
    setTimeout(() => setToast(''), 3500)
  }

  function updateLocalAndState(newMembers: Member[]) {
    setMembers(newMembers)
    try {
      localStorage.setItem('hmmj_custom_members', JSON.stringify(newMembers))
      fetch('/api/v1/cloud-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'members', data: newMembers }),
      }).catch(() => {})
    } catch {}
  }

  function exportMembersJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(members, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'members.json')
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    showToast('📥 File members.json berhasil diunduh!')
  }

  function openAdd() {
    setForm({
      ...EMPTY,
      division_name: divisions.find(d => d.id === 'div-inti')?.name || 'Pengurus Inti',
    })
    setSelected(null)
    setModal('add')
  }

  function openEdit(m: Member) {
    setSelected(m)
    setForm({
      name: m.name,
      npm: m.npm,
      jabatan: m.jabatan,
      jabatan_order: m.jabatan_order,
      division_id: m.division_id,
      division_name: m.division_name,
      role: m.role,
      photo: m.photo,
      instagram: m.instagram || '',
      instagram_url: m.instagram_url || '',
      address: m.address || '',
      whatsapp: m.whatsapp || '',
      period: m.period,
      active: m.active !== false,
    })
    setModal('edit')
  }

  function openDelete(m: Member) {
    setSelected(m)
    setModal('delete')
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
  }

  function handleDivisionChange(divId: string) {
    const div = divisions.find(d => d.id === divId)
    setForm(f => ({ ...f, division_id: divId, division_name: div?.name || '' }))
  }

  async function handlePhotoUpload(file: File) {
    setUploading(true)
    try {
      const { compressImage } = await import('@/lib/image-utils')
      const compressedDataUrl = await compressImage(file, 600, 750, 0.82)

      // Try upload to Vercel Blob / server storage
      try {
        const resBlob = await fetch(compressedDataUrl)
        const blobData = await resBlob.blob()
        const formData = new FormData()
        formData.append('file', blobData, file.name || 'member.jpg')
        formData.append('type', 'member')

        const uploadRes = await fetch('/api/v1/upload/member-photo', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (uploadData.url) {
          setForm(f => ({ ...f, photo: uploadData.url }))
          showToast('✅ Foto berhasil diunggah ke storage real-time!')
          setUploading(false)
          return
        }
      } catch {
        // Fallback to compressed base64
      }

      setForm(f => ({ ...f, photo: compressedDataUrl }))
      showToast('✅ Foto berhasil dipasang!')
    } catch {
      showToast('❌ Gagal memproses foto', false)
    }
    setUploading(false)
  }

  async function toggleActive(m: Member) {
    const nextStatus = !m.active
    const updated = { ...m, active: nextStatus }
    
    // 1. Immediately update client list & localStorage (Never loses previous changes)
    const updatedList = members.map(item => item.id === m.id ? updated : item)
    updateLocalAndState(updatedList)

    if (nextStatus) {
      showToast(`✅ ${m.name} diaktifkan! Foto & profil kembali muncul di struktur.`)
    } else {
      showToast(`⚠️ ${m.name} dinonaktifkan! Foto & profil disembunyikan dari struktur.`)
    }

    // 2. Sync to server in background
    try {
      await fetch('/api/v1/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
    } catch {}
  }

  async function handleSave() {
    setSaving(true)
    const payload: Member = modal === 'edit'
      ? { ...(form as Member), id: selected!.id }
      : { ...(form as Member), id: `mbr-${Date.now().toString(36)}` }

    // 1. Immediately merge into existing members array & save to localStorage
    const updatedList = modal === 'edit'
      ? members.map(m => m.id === payload.id ? payload : m)
      : [...members, payload]
    
    updateLocalAndState(updatedList)

    showToast(
      modal === 'edit'
        ? '✅ Data & foto pengurus berhasil diperbarui!'
        : '✅ Pengurus baru berhasil ditambahkan!'
    )
    closeModal()

    // 2. Sync to server in background
    try {
      await fetch('/api/v1/members', {
        method: modal === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch {}

    setSaving(false)
  }

  async function handleDelete() {
    setSaving(true)
    const idToDelete = selected!.id
    
    // 1. Immediately remove from client state & localStorage
    const updatedList = members.filter(m => m.id !== idToDelete)
    updateLocalAndState(updatedList)
    showToast('✅ Pengurus berhasil dihapus!')
    closeModal()

    // 2. Sync to server in background
    try {
      await fetch('/api/v1/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idToDelete }),
      })
    } catch {}

    setSaving(false)
  }

  const activeMembersCount = members.filter(m => m.active !== false).length
  const inactiveMembersCount = members.filter(m => m.active === false).length

  const filtered = members.filter(m => {
    const q = search.toLowerCase()
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.npm.toLowerCase().includes(q) ||
      m.jabatan.toLowerCase().includes(q) ||
      m.division_name.toLowerCase().includes(q)

    const matchDiv = divFilter === 'all' || m.division_id === divFilter

    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? m.active !== false
        : m.active === false

    return matchQ && matchDiv && matchStatus
  })

  if (loading) {
    return (
      <div className="flex-center" style={{ padding: '4rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>👥 Kelola Pengurus & Anggota</h1>
          <p className={styles.sub}>
            Total: {members.length} Pengurus ·{' '}
            <span style={{ color: '#10B981', fontWeight: 600 }}>{activeMembersCount} Aktif</span>{' '}
            ·{' '}
            <span style={{ color: '#EF4444', fontWeight: 600 }}>{inactiveMembersCount} Nonaktif</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={exportMembersJSON} id="btn-export-members" title="Unduh backup data members.json">
            📥 Unduh members.json
          </button>
          <button className="btn btn-primary" onClick={openAdd} id="btn-add-member">
            + Tambah Pengurus
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toastOk ? styles.toastOk : styles.toastErr}`}>
          {toast}
        </div>
      )}

      {/* Status Filter Tabs & Search */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('all')}
        >
          Semua Pengurus ({members.length})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('active')}
          style={statusFilter === 'active' ? { background: '#10B981', borderColor: '#10B981' } : {}}
        >
          ✓ Aktif ({activeMembersCount})
        </button>
        <button
          className={`btn btn-sm ${statusFilter === 'inactive' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setStatusFilter('inactive')}
          style={statusFilter === 'inactive' ? { background: '#EF4444', borderColor: '#EF4444' } : {}}
        >
          ✕ Nonaktif ({inactiveMembersCount})
        </button>
      </div>

      {/* Search & Division Filter */}
      <div className={styles.filters}>
        <div className="input-group" style={{ flex: 1 }}>
          <span className="input-icon">🔍</span>
          <input
            type="text"
            className="input"
            placeholder="Cari nama, NPM, jabatan, atau divisi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="search-member"
          />
        </div>
        <select
          className="input"
          style={{ width: 220 }}
          value={divFilter}
          onChange={e => setDivFilter(e.target.value)}
          id="filter-division"
        >
          <option value="all">Semua Divisi</option>
          {divisions.map(d => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama & Instagram</th>
              <th>NPM</th>
              <th>Jabatan</th>
              <th>Divisi</th>
              <th>Status di Struktur</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            ) : (
              filtered.map(m => {
                const isActive = m.active !== false
                return (
                  <tr
                    key={m.id}
                    style={!isActive ? { opacity: 0.7, background: 'rgba(239, 68, 68, 0.04)' } : {}}
                  >
                    <td>
                      <img
                        src={m.photo || '/images/members/default.jpg'}
                        alt={m.name}
                        className={styles.avatar}
                      />
                    </td>
                    <td>
                      <div className={styles.memberName}>{m.name}</div>
                      {m.instagram && <div className={styles.memberIg}>{m.instagram}</div>}
                    </td>
                    <td className={styles.tdMuted}>{m.npm || '-'}</td>
                    <td className={styles.tdMuted}>{m.jabatan}</td>
                    <td>
                      <span className={styles.divBadge}>{m.division_name}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleActive(m)}
                        title={
                          isActive
                            ? 'Klik untuk menonaktifkan & menyembunyikan dari struktur organisasi'
                            : 'Klik untuk mengaktifkan & menampilkan kembali ke struktur organisasi'
                        }
                        style={{
                          cursor: 'pointer',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isActive ? '#10B981' : '#EF4444',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isActive ? '✓ Aktif (Tampil)' : '✕ Nonaktif (Sembunyi)'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`btn btn-sm btn-outline ${styles.editBtn}`}
                          onClick={() => openEdit(m)}
                          id={`edit-${m.id}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className={`btn btn-sm ${styles.delBtn}`}
                          onClick={() => openDelete(m)}
                          id={`del-${m.id}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {(modal === 'add' || modal === 'edit') && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {modal === 'add' ? '+ Tambah Pengurus Baru' : '✏️ Edit Pengurus'}
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Photo upload */}
              <div className={styles.photoSection}>
                <div className={styles.photoPreviewWrap}>
                  <img
                    src={form.photo || '/images/members/default.jpg'}
                    alt="Preview"
                    className={styles.photoPreview}
                  />
                  {uploading && (
                    <div className={styles.photoOverlay}>
                      <div
                        className="spinner"
                        style={{ width: 24, height: 24, borderWidth: 2 }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <p className={styles.photoLabel}>Foto Pengurus</p>
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) handlePhotoUpload(f)
                    }}
                    id="member-photo-input"
                  />
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => photoRef.current?.click()}
                    disabled={uploading}
                    id="btn-upload-photo"
                  >
                    {uploading ? '⏳ Mengupload...' : '📤 Upload Foto'}
                  </button>
                  <p className={styles.photoHint}>JPG/PNG, maks 2MB</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                {/* Nama */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nama Lengkap *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: Novaleo Fernandes"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    id="form-name"
                  />
                </div>

                {/* NPM */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>NPM / NIM</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: 2310017211043"
                    value={form.npm}
                    onChange={e => setForm(f => ({ ...f, npm: e.target.value }))}
                    id="form-npm"
                  />
                </div>

                {/* Divisi */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Divisi *</label>
                  <select
                    className="input"
                    value={form.division_id}
                    onChange={e => handleDivisionChange(e.target.value)}
                    id="form-division"
                  >
                    {divisions.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jabatan */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Jabatan Lengkap *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: Koordinator Divisi Kominfo"
                    value={form.jabatan}
                    onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))}
                    id="form-jabatan"
                  />
                </div>

                {/* Role / Posisi */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tingkat Peran *</label>
                  <select
                    className="input"
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                    id="form-role"
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Periode */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Periode</label>
                  <input
                    type="text"
                    className="input"
                    value={form.period}
                    onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                    id="form-period"
                  />
                </div>

                {/* Alamat */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Alamat Domisili Anggota</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: Padang, Sumatera Barat"
                    value={form.address || ''}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    id="form-address"
                  />
                </div>

                {/* Instagram */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Username Instagram</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: @hmmj_mesin"
                    value={form.instagram || ''}
                    onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                    id="form-instagram"
                  />
                </div>

                {/* WhatsApp */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nomor WhatsApp Anggota</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: 082288880000"
                    value={form.whatsapp || ''}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    id="form-whatsapp"
                  />
                </div>

                {/* Status Aktif */}
                <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      Status Aktif (Tampilkan di Struktur Organisasi)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={closeModal} disabled={saving}>
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                id="btn-save-member"
              >
                {saving ? 'Menyimpan...' : 'Simpan Pengurus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {modal === 'delete' && selected && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Hapus Pengurus?</h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Apakah Anda yakin ingin menghapus data <strong>{selected.name}</strong>?
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-outline" onClick={closeModal} disabled={saving}>
                Batal
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving} id="btn-confirm-delete">
                {saving ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
