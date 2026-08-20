'use client'

import React, { useState } from 'react'

export default function QuickSeedButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSeed() {
    if (!confirm('Apakah Anda ingin memuat data awal resmi HMMJ (Dokumentasi & Berita) ke database?')) return
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/v1/seed', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setMsg('✅ ' + data.message)
        setTimeout(() => {
          window.location.reload()
        }, 1200)
      } else {
        setMsg('❌ ' + (data.error || 'Gagal memuat data'))
      }
    } catch {
      setMsg('❌ Gagal menghubungi server')
    }
    setLoading(false)
  }

  return (
    <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-[#0F2033] to-[#162840] border border-[rgba(201,168,76,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div>
        <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
          <span>⚡</span> Sinkronisasi Data Awal Resmi
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
          Klik tombol ini jika dokumentasi & berita di web masih kosong untuk mengisi otomatis dari database resmi HMMJ.
        </p>
      </div>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] text-[#070F1E] font-bold text-xs sm:text-sm whitespace-nowrap shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Memproses...' : '🚀 Muat Data Resmi HMMJ'}
      </button>

      {msg && (
        <div className="w-full text-xs font-semibold text-center mt-2 text-[#E8C97E]">
          {msg}
        </div>
      )}
    </div>
  )
}
