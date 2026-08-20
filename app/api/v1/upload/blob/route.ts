import { NextRequest, NextResponse } from 'next/server'
import { getAuthFromRequest, isAdminOrDeveloper } from '@/lib/auth'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req)
  if (!isAdminOrDeveloper(auth)) {
    return NextResponse.json({ error: 'Unauthorized. Sesi login telah berakhir.' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    const mimeType = file.type || 'image/jpeg'
    const ext = file.name ? (file.name.split('.').pop()?.toLowerCase() || 'jpg') : 'jpg'
    const filename = `${folder}-${Date.now()}.${ext}`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`hmmj/${folder}/${filename}`, file, {
        access: 'public',
        contentType: mimeType,
      })
      return NextResponse.json({ url: blob.url, filename, storage: 'vercel-blob' })
    }

    // Fallback if no token in development
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')
    const url = `data:${mimeType};base64,${base64String}`

    return NextResponse.json({ url, filename, storage: 'base64' })
  } catch (err: any) {
    console.error('Blob upload error:', err)
    return NextResponse.json({ error: err.message || 'Gagal mengunggah file' }, { status: 500 })
  }
}
