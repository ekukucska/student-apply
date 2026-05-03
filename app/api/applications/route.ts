import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { connectToMongoDB } from '@/lib/mongoose'
import { SubmissionData } from '@/models/SubmissionData'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, programId, answers, documents } = body

    if (!userId || !programId) {
      return NextResponse.json({ error: 'userId and programId are required' }, { status: 400 })
    }

    // 1. Upsert ApplicationStatus in PostgreSQL (relational integrity)
    const applicationStatus = await prisma.applicationStatus.upsert({
      where: { userId_programId: { userId, programId } },
      create: { userId, programId, status: 'SUBMITTED' },
      update: { status: 'SUBMITTED' },
    })

    // 2. Save submission data in MongoDB (flexible document storage)
    await connectToMongoDB()
    const submission = await SubmissionData.create({
      applicationStatusId: applicationStatus.id,
      userId,
      programId,
      answers: answers ?? {},
      documents: documents ?? [],
      submittedAt: new Date(),
    })

    return NextResponse.json(
      {
        applicationStatusId: applicationStatus.id,
        submissionId: submission._id,
        status: applicationStatus.status,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/applications]', err)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId query param is required' }, { status: 400 })
    }

    const applications = await prisma.applicationStatus.findMany({
      where: { userId },
      include: { program: true },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}
