import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'
import { put } from '@vercel/blob'
import path from 'path'
import fs from 'fs/promises'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) || 'member'

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    const mimeType = file.type || 'image/jpeg'
    const ext = file.name ? (file.name.split('.').pop()?.toLowerCase() || 'jpg') : 'jpg'
    const filename = `${type}-${Date.now()}.${ext}`

    let url = ''

    // 1. Priority: Vercel Blob Storage (Production-ready CDN)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`hmmj/${type}/${filename}`, file, {
          access: 'public',
          contentType: mimeType,
        })
        url = blob.url
        return NextResponse.json({ url, filename, storage: 'vercel-blob' })
      } catch (blobErr) {
        console.warn('Vercel Blob upload warning, falling back:', blobErr)
      }
    }

    // 2. Local Disk Write (in localhost development environment)
    if (!process.env.VERCEL) {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        let uploadDir: string
        let urlBase: string

        if (type === 'member') {
          uploadDir = path.join(process.cwd(), 'public', 'uploads', 'members')
          urlBase = '/uploads/members'
        } else if (type === 'news') {
          uploadDir = path.join(process.cwd(), 'public', 'uploads', 'news')
          urlBase = '/uploads/news'
        } else if (type === 'gallery') {
          uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
          urlBase = '/uploads/gallery'
        } else {
          uploadDir = path.join(process.cwd(), 'public', 'uploads', 'misc')
          urlBase = '/uploads/misc'
        }

        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(path.join(uploadDir, filename), buffer)
        url = `${urlBase}/${filename}`
        return NextResponse.json({ url, filename, storage: 'local-disk' })
      } catch {
        // Fallback to base64 if disk write fails
      }
    }

    // 3. Fallback: Base64 Data URL (Self-contained, 100% resilient across serverless)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')
    url = `data:${mimeType};base64,${base64String}`

    return NextResponse.json({ url, filename, storage: 'base64-fallback' })
  } catch (err: any) {
    console.error('Upload handler error:', err)
    return NextResponse.json({ error: err.message || 'Gagal mengunggah foto' }, { status: 500 })
  }
}
