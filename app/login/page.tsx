'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/v1/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login gagal')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <Image src="/images/logo-hmmj.png" alt="Logo HMMJ" width={72} height={72} className={styles.logo} />
        </div>
        <h1 className={styles.title}>Masuk Dashboard</h1>
        <p className={styles.sub}>HMMJ Teknik Mesin — Universitas Bung Hatta</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="login-username" className={styles.label}>Username</label>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                id="login-username"
                type="text"
                className="input"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="login-password" className={styles.label}>Password</label>
            <div className={styles.passWrap}>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '42px' }}
                />
              </div>
              <button
                type="button"
                className={styles.showPass}
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className={`btn btn-primary w-full ${styles.submitBtn}`} disabled={loading} id="login-submit-btn">
            {loading ? (
              <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#0A1628' }} /> Memuat...</>
            ) : (
              'Masuk →'
            )}
          </button>
        </form>

        <div className={styles.backLink}>
          <a href="/">← Kembali ke Website</a>
        </div>
      </div>
    </div>
  )
}
