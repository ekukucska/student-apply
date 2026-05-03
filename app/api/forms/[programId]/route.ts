import { NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongoose'
import { DynamicForm } from '@/models/DynamicForm'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ programId: string }> }
) {
  try {
    const { programId } = await params
    await connectToMongoDB()
    const form = await DynamicForm.findOne({ programId }).lean()

    if (!form) {
      return NextResponse.json({ error: 'Form not found for this program' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch form schema' }, { status: 500 })
  }
}
