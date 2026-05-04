import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongoose'
import { ApplicationComment } from '@/models/ApplicationComment'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  await connectToMongoDB()
  const comments = await ApplicationComment.find({ applicationStatusId: id })
    .sort({ createdAt: -1 })
    .lean()
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const { reviewerName, body: text } = body as { reviewerName: string; body: string }

  if (!reviewerName?.trim() || !text?.trim()) {
    return NextResponse.json({ error: 'reviewerName and body are required.' }, { status: 400 })
  }

  await connectToMongoDB()
  const comment = await ApplicationComment.create({
    applicationStatusId: id,
    reviewerName: reviewerName.trim(),
    body: text.trim(),
  })
  return NextResponse.json(comment, { status: 201 })
}
