'use client'
import { useState } from 'react'

export default function LogoSettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4 }}>🏷️ Pengaturan Logo</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Kelola logo HMMJ, M Solver, dan Universitas Bung Hatta</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { key: 'logo_main', label: 'Logo Utama HMMJ', src: '/images/logo-hmmj.png', desc: 'Digunakan pada Navbar, Hero, Struktur, Footer, Favicon' },
          { key: 'logo_secondary', label: 'Logo M Solver', src: '/images/logo-msolver.png', desc: 'Identitas pendukung / branding' },
          { key: 'logo_university', label: 'Logo Universitas Bung Hatta', src: '/images/logo-ubh.png', desc: 'Identitas institusi universitas' },
        ].map(logo => (
          <div key={logo.key} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-2)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: 160 }}>
              <img src={logo.src} alt={logo.label} style={{ maxWidth: 100, maxHeight: 100, objectFit: 'contain' }} />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{logo.label}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>{logo.desc}</p>
              <label style={{ display: 'block' }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} id={`upload-${logo.key}`} />
                <span className="btn btn-outline btn-sm" style={{ display: 'inline-flex', cursor: 'pointer' }}
                  onClick={() => document.getElementById(`upload-${logo.key}`)?.click()}>
                  📤 Ganti Logo
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
        💡 <strong style={{ color: 'var(--color-primary)' }}>Info:</strong> Untuk mengganti logo, upload file PNG transparan. Logo saat ini menggunakan file yang disalin ke folder <code>/public/images/</code>. Upload via fitur ini akan segera tersedia.
      </div>
    </div>
  )
}
