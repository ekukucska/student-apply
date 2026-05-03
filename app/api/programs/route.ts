import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(programs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 })
  }
}
