import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

const LOCAL_DATA_DIR = path.join(process.cwd(), 'data')
const TMP_DATA_DIR = path.join('/tmp', 'data')

// Global in-memory cache to maintain state across serverless warm invocations
const memoryCache: Record<string, any> = {}

// Dynamically resolve Upstash / Vercel KV REST API credentials regardless of prefix name
function getKvConfig(): { url: string; token: string } {
  let url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.STORAGE_REST_API_URL || ''
  let token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.STORAGE_REST_API_TOKEN || ''

  if (!url || !token) {
    for (const [k, v] of Object.entries(process.env)) {
      if (!v) continue
      if ((k.endsWith('_REST_API_URL') || k.endsWith('_URL')) && v.startsWith('http')) {
        url = v
      }
      if (k.endsWith('_REST_API_TOKEN') || k.endsWith('_TOKEN')) {
        token = v
      }
    }
  }
  return { url, token }
}

async function kvGet<T>(key: string): Promise<T | null> {
  const { url, token } = getKvConfig()
  if (!url || !token) return null
  try {
    const res = await fetch(`${url}/get/hmmj_${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const data = await res.json()
    if (data && data.result !== undefined && data.result !== null) {
      return typeof data.result === 'string' ? JSON.parse(data.result) : data.result
    }
  } catch (err: any) {
    if (err?.digest === 'DYNAMIC_SERVER_USAGE' || err?.message?.includes('Dynamic server usage') || err?.message?.includes('rendered statically')) {
      return null
    }
    console.error('KV get error:', err?.message || err)
  }
  return null
}

async function kvSet<T>(key: string, value: T): Promise<boolean> {
  const { url, token } = getKvConfig()
  if (!url || !token) return false
  try {
    const res = await fetch(`${url}/set/hmmj_${key}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(typeof value === 'string' ? value : JSON.stringify(value)),
    })
    const data = await res.json()
    return data.result === 'OK'
  } catch (err) {
    console.error('KV set error:', err)
  }
  return false
}

export async function readJSON<T>(filename: string): Promise<T> {
  const key = filename.replace('.json', '')

  // 1. Try KV Cloud Database if configured
  const kvData = await kvGet<T>(key)
  if (kvData !== null && kvData !== undefined) {
    return kvData
  }

  // 2. Always read directly from local file on disk
  try {
    const localPath = path.join(LOCAL_DATA_DIR, filename)
    const content = await fs.readFile(localPath, 'utf-8')
    const parsed = JSON.parse(content) as T
    return parsed
  } catch {
    // continue
  }

  // 3. Fallback to /tmp/data in serverless runtime
  try {
    const tmpPath = path.join(TMP_DATA_DIR, filename)
    const content = await fs.readFile(tmpPath, 'utf-8')
    return JSON.parse(content) as T
  } catch {
    // continue
  }

  // 4. Memory cache fallback
  if (memoryCache[filename]) {
    return memoryCache[filename] as T
  }

  return [] as unknown as T
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const key = filename.replace('.json', '')
  memoryCache[filename] = data

  // 1. Sync to KV Cloud Database if configured
  await kvSet(key, data)

  // 2. Write to local file on disk
  try {
    const localPath = path.join(LOCAL_DATA_DIR, filename)
    await fs.writeFile(localPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch {
    // Serverless read-only filesystem fallback
  }

  // 3. Write to /tmp/data for serverless runtime
  try {
    await fs.mkdir(TMP_DATA_DIR, { recursive: true })
    const tmpPath = path.join(TMP_DATA_DIR, filename)
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8')
  } catch {
    // continue
  }
}

// ── Types ──
export interface Settings {
  id: number
  organization_name: string
  full_organization_name: string
  faculty: string
  university: string
  period: string
  tagline: string
  logo_main: string
  logo_secondary: string
  logo_university: string
  favicon: string
  instagram_hmmj: string
  instagram_hmmj_url: string
  instagram_creator: string
  instagram_creator_url: string
  creator_name: string
  address: string
  phone: string
  whatsapp: string
  email?: string
  maps_url: string
  maps_embed_url: string
  copyright: string
  about_title?: string
  about_subtitle?: string
  about_description_1?: string
  about_description_2?: string
  about_description_3?: string
  about_pillars?: string[]
  about_vision?: string
  about_mission?: string
  created_at: string
  updated_at: string
}

export interface Background {
  id: string
  section: string
  label: string
  image_url: string
  overlay: number
  position: string
  status: string
  created_at: string
  updated_at: string
}

export interface Division {
  id: string
  name: string
  slug: string
  description: string
  color: string
  order: number
}

export interface Member {
  id: string
  name: string
  npm: string
  jabatan: string
  jabatan_order: number
  division_id: string
  division_name: string
  role: string
  photo: string
  instagram?: string
  instagram_url?: string
  address?: string
  whatsapp?: string
  period: string
  active: boolean
}

export interface User {
  id: string
  username: string
  password_hash: string
  role: 'developer' | 'admin'
  name: string
  active: boolean
}

// ── Data fetchers ──
export async function getSettings(): Promise<Settings> {
  return readJSON<Settings>('settings.json')
}

export async function getBackgrounds(): Promise<Background[]> {
  return readJSON<Background[]>('backgrounds.json')
}

export async function getBackground(section: string): Promise<Background | null> {
  const bgs = await getBackgrounds()
  return bgs.find(b => b.section === section) ?? null
}

export async function getDivisions(): Promise<Division[]> {
  const divs = await readJSON<Division[]>('divisions.json')
  return divs.sort((a, b) => a.order - b.order)
}

export async function getMembers(): Promise<Member[]> {
  return readJSON<Member[]>('members.json')
}

export async function getMember(id: string): Promise<Member | null> {
  const members = await getMembers()
  return members.find(m => m.id === id) ?? null
}

export async function getUsers(): Promise<User[]> {
  return readJSON<User[]>('users.json')
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const users = await getUsers()
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) ?? null
}

function safeRevalidate(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Ignore in non-request contexts
  }
}

// ── Update helpers ──
export async function updateSettings(data: Partial<Settings>): Promise<Settings> {
  const current = await getSettings()
  const updated = { ...current, ...data, updated_at: new Date().toISOString() }
  await writeJSON('settings.json', updated)
  safeRevalidate('/')
  safeRevalidate('/tentang')
  safeRevalidate('/kontak')
  safeRevalidate('/struktur')
  return updated
}

export async function updateBackground(id: string, data: Partial<Background>): Promise<Background[]> {
  const bgs = await getBackgrounds()
  const idx = bgs.findIndex(b => b.id === id)
  if (idx !== -1) {
    bgs[idx] = { ...bgs[idx], ...data, updated_at: new Date().toISOString() }
  }
  await writeJSON('backgrounds.json', bgs)
  safeRevalidate('/')
  safeRevalidate('/tentang')
  safeRevalidate('/kontak')
  return bgs
}

export async function upsertMember(member: Member): Promise<Member[]> {
  const members = await getMembers()
  const idx = members.findIndex(m => m.id === member.id)
  if (idx !== -1) {
    members[idx] = member
  } else {
    members.push(member)
  }
  await writeJSON('members.json', members)
  safeRevalidate('/struktur')
  safeRevalidate(`/pengurus/${member.id}`)
  safeRevalidate('/')
  return members
}

export async function deleteMember(id: string): Promise<Member[]> {
  const members = await getMembers()
  const updated = members.filter(m => m.id !== id)
  await writeJSON('members.json', updated)
  safeRevalidate('/struktur')
  safeRevalidate(`/pengurus/${id}`)
  safeRevalidate('/')
  return updated
}
