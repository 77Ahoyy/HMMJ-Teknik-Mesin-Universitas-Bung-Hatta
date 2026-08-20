import { NextRequest, NextResponse } from 'next/server'
import { getUserByUsername, getUsers, writeJSON } from '@/lib/data'
import { signToken, getAuthFromRequest, COOKIE_OPTIONS } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// POST /api/v1/auth — Login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    const user = await getUserByUsername(username)
    if (!user || !user.active) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    let passwordValid = false
    if (user.password_hash.startsWith('$2')) {
      passwordValid = await bcrypt.compare(password, user.password_hash)
    } else {
      passwordValid = user.password_hash === password
      if (passwordValid) {
        const hash = await bcrypt.hash(password, 10)
        const users = await getUsers()
        const idx = users.findIndex(u => u.id === user.id)
        if (idx !== -1) { users[idx].password_hash = hash }
        await writeJSON('users.json', users)
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const token = await signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    })

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
    })

    response.cookies.set(COOKIE_OPTIONS.name, token, {
      httpOnly: COOKIE_OPTIONS.httpOnly,
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
      maxAge: COOKIE_OPTIONS.maxAge,
      path: COOKIE_OPTIONS.path,
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/v1/auth — Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_OPTIONS.name)
  return response
}

// GET /api/v1/auth — Check session or logout redirect
export async function GET(req: NextRequest) {
  const logout = req.nextUrl.searchParams.get('logout')
  if (logout === '1') {
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete(COOKIE_OPTIONS.name)
    return response
  }
  const auth = await getAuthFromRequest(req)
  if (!auth) return NextResponse.json({ authenticated: false }, { status: 401 })
  return NextResponse.json({
    authenticated: true,
    user: { userId: auth.userId, username: auth.username, role: auth.role, name: auth.name },
  })
}
