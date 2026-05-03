import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { connectToMongoDB } from '@/lib/mongoose'
import { SubmissionData } from '@/models/SubmissionData'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // PostgreSQL — relational record (status + program info)
    const applicationStatus = await prisma.applicationStatus.findUnique({
      where: { id },
      include: { program: true, user: true },
    })

    if (!applicationStatus) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // MongoDB — flexible submission data (answers + file references)
    await connectToMongoDB()
    const submission = await SubmissionData.findOne({ applicationStatusId: id }).lean()

    return NextResponse.json({
      id: applicationStatus.id,
      status: applicationStatus.status,
      createdAt: applicationStatus.createdAt,
      updatedAt: applicationStatus.updatedAt,
      program: {
        id: applicationStatus.program.id,
        name: applicationStatus.program.name,
        type: applicationStatus.program.type,
        university: applicationStatus.program.university,
      },
      applicant: {
        id: applicationStatus.user.id,
        name: applicationStatus.user.name,
        email: applicationStatus.user.email,
      },
      submission: submission
        ? {
            answers: submission.answers,
            documents: submission.documents,
            submittedAt: submission.submittedAt,
          }
        : null,
    })
  } catch (err) {
    console.error('[GET /api/applications/[id]]', err)
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
  }
}
