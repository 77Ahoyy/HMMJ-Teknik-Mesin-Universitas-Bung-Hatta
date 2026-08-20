import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest } from '@/lib/auth'
import { getUsers, writeJSON } from '@/lib/data'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { current_password, new_password, confirm_password } = await req.json()

    if (!current_password || !new_password || !confirm_password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    if (new_password !== confirm_password) {
      return NextResponse.json({ error: 'Konfirmasi password baru tidak cocok' }, { status: 400 })
    }

    if (new_password.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 })
    }

    const users = await getUsers()
    const userIndex = users.findIndex(u => u.id === auth.userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    const user = users[userIndex]
    const isCurrentValid = await bcrypt.compare(current_password, user.password_hash)
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Password saat ini salah' }, { status: 400 })
    }

    const newHash = await bcrypt.hash(new_password, 10)
    users[userIndex].password_hash = newHash
    await writeJSON('users.json', users)

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui!' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
