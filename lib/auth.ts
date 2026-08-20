import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hmmj-teknik-mesin-ubh-secret-2026'
)
const COOKIE_NAME = 'hmmj_auth'

export interface AuthPayload extends JWTPayload {
  userId: string
  username: string
  role: 'developer' | 'admin'
  name: string
}

export async function signToken(payload: Omit<AuthPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as AuthPayload
  } catch {
    return null
  }
}

export async function getAuthFromCookies(): Promise<AuthPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getAuthFromRequest(req: NextRequest): Promise<AuthPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
    || req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null
  return verifyToken(token)
}

export function isDeveloper(auth: AuthPayload | null): boolean {
  return auth?.role === 'developer'
}

export function isAdminOrDeveloper(auth: AuthPayload | null): boolean {
  return auth?.role === 'developer' || auth?.role === 'admin'
}

export const COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}
