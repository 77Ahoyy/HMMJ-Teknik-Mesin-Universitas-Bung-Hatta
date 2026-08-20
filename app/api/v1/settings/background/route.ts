import { NextRequest, NextResponse } from 'next/server'
import { getBackgrounds, updateBackground } from '@/lib/data'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'
import { put } from '@vercel/blob'
import path from 'path'
import fs from 'fs/promises'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const bgs = await getBackgrounds()
  return NextResponse.json(bgs)
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const { id, ...updates } = data
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const bgs = await updateBackground(id, updates)
    return NextResponse.json({ success: true, backgrounds: bgs })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan background' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const section = (formData.get('section') as string) || 'hero'
    const file = formData.get('file') as File | null
    const directUrl = formData.get('image_url') as string | null

    let imageUrl = ''

    if (directUrl && directUrl.startsWith('data:image/')) {
      imageUrl = directUrl
    } else if (file) {
      const ext = file.name ? file.name.split('.').pop() || 'jpg' : 'jpg'
      const filename = `bg-${section}-${Date.now()}.${ext}`

      // 1. Try Vercel Blob Storage if token is available
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const blob = await put(`hmmj/backgrounds/${filename}`, file, {
            access: 'public',
            contentType: file.type || 'image/jpeg',
          })
          imageUrl = blob.url
        } catch {
          // Fallback to local or base64
        }
      }

      // 2. Try writing to local public/uploads/ (local development only)
      if (!imageUrl && !process.env.VERCEL && !process.env.NETLIFY) {
        try {
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'backgrounds')
          await fs.mkdir(uploadDir, { recursive: true })
          await fs.writeFile(path.join(uploadDir, filename), buffer)
          imageUrl = `/uploads/backgrounds/${filename}`
        } catch {
          // Fallback to base64
        }
      }

      // 3. Robust fallback: convert buffer to base64 data URL
      if (!imageUrl) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const mime = file.type || 'image/jpeg'
        imageUrl = `data:${mime};base64,${buffer.toString('base64')}`
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'File atau gambar tidak valid' }, { status: 400 })
    }

    const bgs = await updateBackground(`bg-${section}`, { image_url: imageUrl })
    return NextResponse.json({ success: true, image_url: imageUrl, backgrounds: bgs })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal memproses upload' }, { status: 500 })
  }
}
