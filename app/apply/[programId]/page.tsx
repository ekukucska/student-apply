import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { connectToMongoDB } from '@/lib/mongoose'
import { DynamicForm as DynamicFormModel } from '@/models/DynamicForm'
import DynamicFormComponent from '@/components/DynamicForm'

interface Props {
  params: Promise<{ programId: string }>
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  BACHELOR:    { bg: 'bg-tag-bachelor', text: 'text-ibm-text-inverse' },
  MASTER:      { bg: 'bg-tag-master',   text: 'text-ibm-text-inverse' },
  CERTIFICATE: { bg: 'bg-tag-cert',     text: 'text-ibm-text-inverse' },
}

export default async function ApplyPage({ params }: Props) {
  const { programId } = await params

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) notFound()

  // Fetch demo user — provides a real FK-valid userId until auth is added
  const demoUser = await prisma.user.findFirst({ where: { email: 'student@example.com' } })

  await connectToMongoDB()
  const formDoc = await DynamicFormModel.findOne({ programId }).lean()

  const tagColor = TYPE_COLORS[program.type] ?? { bg: 'bg-ibm-overlay', text: 'text-ibm-text-primary' }

  return (
    <main className="min-h-screen bg-ibm-canvas">

      {/* ── Page header ── */}
      <div className="bg-ibm-nav text-ibm-text-inverse px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1 text-xs text-ibm-text-muted hover:text-ibm-text-inverse mb-4 transition-colors"
          >
            ← Programs
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 ${tagColor.bg} ${tagColor.text}`}>
              {program.type}
            </span>
          </div>
          <h1 className="text-3xl font-light">{program.name}</h1>
          <p className="text-ibm-text-muted text-sm mt-1">{program.university}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Program info sidebar ── */}
        <aside className="lg:col-span-1">
          <div className="bg-ibm-card border border-ibm-border p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted mb-3">
              About this program
            </h3>
            <p className="text-sm text-ibm-text-secondary leading-relaxed">
              {program.description}
            </p>
          </div>
        </aside>

        {/* ── Application form ── */}
        <div className="lg:col-span-2">
          <div className="bg-ibm-card border border-ibm-border p-6">
            <h2 className="text-base font-semibold text-ibm-text-primary mb-6 pb-3 border-b border-ibm-border">
              Application Form
            </h2>

            {formDoc ? (
              <DynamicFormComponent
                programId={program.id}
                fields={formDoc.fields}
                userId={demoUser?.id}
              />
            ) : (
              <div className="py-10 text-center text-ibm-text-muted text-sm">
                No application form configured for this program yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
