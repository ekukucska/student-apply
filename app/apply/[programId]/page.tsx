import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { connectToMongoDB } from '@/lib/mongoose'
import { DynamicForm as DynamicFormModel } from '@/models/DynamicForm'
import DynamicFormComponent from '@/components/DynamicForm'

interface Props {
  params: Promise<{ programId: string }>
}

export default async function ApplyPage({ params }: Props) {
  const { programId } = await params

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) notFound()

  await connectToMongoDB()
  const formDoc = await DynamicFormModel.findOne({ programId }).lean()

  const typeColors: Record<string, string> = {
    BACHELOR: 'bg-blue-100 text-blue-800',
    MASTER: 'bg-purple-100 text-purple-800',
    CERTIFICATE: 'bg-emerald-100 text-emerald-800',
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          ← Back to Programs
        </Link>

        <div className="mb-6">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[program.type] ?? 'bg-gray-100 text-gray-700'}`}>
            {program.type}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">{program.name}</h1>
          <p className="text-gray-500 mt-1">{program.university}</p>
          <p className="text-sm text-gray-600 mt-3">{program.description}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Application Form</h2>

          {formDoc ? (
            <DynamicFormComponent programId={program.id} fields={formDoc.fields} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No application form has been configured for this program yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
