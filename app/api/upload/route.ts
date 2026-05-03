import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const file      = formData.get('file')      as File   | null
    const fieldName = formData.get('fieldName') as string | null
    const userId    = formData.get('userId')    as string | null
    const programId = formData.get('programId') as string | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!fieldName || !userId || !programId) {
      return NextResponse.json({ error: 'fieldName, userId, and programId are required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Sanitize each path segment so nothing can escape the uploads directory
    const safeUserId    = userId.replace(/[^a-zA-Z0-9_-]/g, '_')
    const safeProgramId = programId.replace(/[^a-zA-Z0-9_-]/g, '_')
    const safeField     = fieldName.replace(/[^a-zA-Z0-9_-]/g, '_')

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeUserId, safeProgramId, safeField)
    await mkdir(uploadDir, { recursive: true })

    const ext        = path.extname(file.name)
    const base       = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const uniqueName = `${Date.now()}-${base}${ext}`

    await writeFile(path.join(uploadDir, uniqueName), buffer)

    const fileUrl = `/uploads/${safeUserId}/${safeProgramId}/${safeField}/${uniqueName}`

    return NextResponse.json({ url: fileUrl, fileName: file.name, fieldName })
  } catch (err) {
    console.error('[POST /api/upload]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
