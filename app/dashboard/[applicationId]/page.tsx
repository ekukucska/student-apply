import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { connectToMongoDB } from '@/lib/mongoose'
import { SubmissionData } from '@/models/SubmissionData'
import { DynamicForm } from '@/models/DynamicForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ applicationId: string }>
}

const STATUS_CFG = {
  DRAFT:        { label: 'Draft',        badge: 'bg-ibm-overlay text-ibm-text-secondary', btn: 'border border-ibm-border text-ibm-text-secondary hover:bg-ibm-overlay' },
  SUBMITTED:    { label: 'Submitted',    badge: 'bg-ibm-blue text-ibm-text-inverse',      btn: 'bg-ibm-blue text-ibm-text-inverse hover:bg-ibm-blue-hover' },
  UNDER_REVIEW: { label: 'Under Review', badge: 'bg-ibm-warning text-ibm-text-primary',   btn: 'bg-ibm-warning text-ibm-text-primary hover:opacity-90' },
  ACCEPTED:     { label: 'Accepted',     badge: 'bg-ibm-success text-ibm-text-inverse',   btn: 'bg-ibm-success text-ibm-text-inverse hover:opacity-90' },
  REJECTED:     { label: 'Rejected',     badge: 'bg-ibm-error text-ibm-text-inverse',     btn: 'bg-ibm-error text-ibm-text-inverse hover:opacity-90' },
} as const

type StatusKey = keyof typeof STATUS_CFG

const TYPE_CFG = {
  BACHELOR:    'bg-tag-bachelor text-ibm-text-inverse',
  MASTER:      'bg-tag-master text-ibm-text-inverse',
  CERTIFICATE: 'bg-tag-cert text-ibm-text-inverse',
} as const

export default async function ApplicationDetailPage({ params }: Props) {
  const { applicationId } = await params

  const application = await prisma.applicationStatus.findUnique({
    where: { id: applicationId },
    include: { program: true, user: true },
  })
  if (!application) notFound()

  await connectToMongoDB()
  const [submission, formSchema] = await Promise.all([
    SubmissionData.findOne({ applicationStatusId: applicationId }).lean(),
    DynamicForm.findOne({ programId: application.programId }).lean(),
  ])

  const fieldMeta: { name: string; label: string; type: string }[] =
    formSchema?.fields ?? []
  const labelOf = (name: string) =>
    fieldMeta.find(f => f.name === name)?.label ?? name

  const answers = (submission?.answers ?? {}) as Record<string, unknown>
  const documents = submission?.documents ?? []

  const currentStatus = application.status as StatusKey
  const statusCfg     = STATUS_CFG[currentStatus]
  const typeCfg       = TYPE_CFG[application.program.type as keyof typeof TYPE_CFG]

  // ── Server Action: change application status ─────────────────────────────
  async function changeStatus(formData: FormData) {
    'use server'
    const id        = formData.get('id') as string
    const newStatus = formData.get('status') as string
    await prisma.applicationStatus.update({
      where: { id },
      data: { status: newStatus as StatusKey },
    })
    revalidatePath(`/dashboard/${id}`)
    revalidatePath('/dashboard')
  }

  return (
    <main className="min-h-screen bg-ibm-canvas">

      {/* ── Page header ── */}
      <div className="bg-ibm-nav text-ibm-text-inverse px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs text-ibm-text-muted hover:text-ibm-text-inverse mb-4 transition-colors"
          >
            ← Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 ${typeCfg}`}>
              {application.program.type}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 ${statusCfg.badge}`}>
              {statusCfg.label}
            </span>
          </div>
          <h1 className="text-3xl font-light">{application.program.name}</h1>
          <p className="text-ibm-text-muted text-sm mt-1">
            {application.user.name} · {application.user.email}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Top info row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Program info */}
          <div className="bg-ibm-card border border-ibm-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted mb-3">Program</p>
            <p className="font-semibold text-ibm-text-primary">{application.program.name}</p>
            <p className="text-sm text-ibm-text-secondary mt-0.5">{application.program.university}</p>
            <p className="text-xs text-ibm-text-muted mt-3">
              <span className="font-medium">Submitted:</span>{' '}
              {new Date(application.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xs text-ibm-text-muted mt-1">
              <span className="font-medium">Last updated:</span>{' '}
              {new Date(application.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Applicant info */}
          <div className="bg-ibm-card border border-ibm-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted mb-3">Applicant</p>
            <p className="font-semibold text-ibm-text-primary">{application.user.name}</p>
            <p className="text-sm text-ibm-text-secondary mt-0.5">{application.user.email}</p>
            <p className="text-xs text-ibm-text-muted mt-3">
              <span className="font-medium">User ID:</span>{' '}
              <code className="text-xs bg-ibm-canvas px-1">{application.user.id}</code>
            </p>
          </div>

          {/* Status management */}
          <div className="bg-ibm-card border border-ibm-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted mb-3">
              Change Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STATUS_CFG) as [StatusKey, typeof STATUS_CFG[StatusKey]][]).map(([status, cfg]) => (
                <form key={status} action={changeStatus}>
                  <input type="hidden" name="id" value={applicationId} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={currentStatus === status}
                    className={`text-xs font-semibold px-3 py-1.5 transition-opacity disabled:opacity-40 disabled:cursor-default ${cfg.btn}`}
                  >
                    {cfg.label}
                  </button>
                </form>
              ))}
            </div>
            <p className="text-xs text-ibm-text-muted mt-3">
              Current: <span className="font-semibold">{statusCfg.label}</span>
            </p>
          </div>

        </div>

        {/* ── Form answers ── */}
        <div className="bg-ibm-card border border-ibm-border">
          <div className="px-5 py-4 border-b border-ibm-border">
            <h2 className="text-sm font-semibold text-ibm-text-primary uppercase tracking-wider">
              Form Answers
            </h2>
          </div>

          {Object.keys(answers).length === 0 ? (
            <p className="px-5 py-8 text-sm text-ibm-text-muted text-center">No answers recorded.</p>
          ) : (
            <div className="divide-y divide-ibm-border">
              {/* Render in schema order first */}
              {fieldMeta
                .filter(f => f.type !== 'file' && answers[f.name] !== undefined && answers[f.name] !== '')
                .map(field => (
                  <div key={field.name} className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ibm-text-muted sm:pt-0.5">
                      {field.label}
                    </p>
                    <p className="sm:col-span-2 text-sm text-ibm-text-primary whitespace-pre-wrap">
                      {String(answers[field.name])}
                    </p>
                  </div>
                ))}
              {/* Any answers not in schema */}
              {Object.entries(answers)
                .filter(([key]) => !fieldMeta.some(f => f.name === key))
                .map(([key, value]) => (
                  <div key={key} className="px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ibm-text-muted">{key}</p>
                    <p className="sm:col-span-2 text-sm text-ibm-text-primary">{String(value)}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* ── Uploaded documents ── */}
        <div className="bg-ibm-card border border-ibm-border">
          <div className="px-5 py-4 border-b border-ibm-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ibm-text-primary uppercase tracking-wider">
              Uploaded Documents
              {documents.length > 0 && (
                <span className="ml-2 text-xs font-normal text-ibm-text-muted">({documents.length} file{documents.length !== 1 ? 's' : ''})</span>
              )}
            </h2>
            {documents.length > 0 && (
              <a
                href={`/api/applications/${applicationId}/download`}
                className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-ibm-text-inverse text-xs font-semibold px-4 py-2 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Full Application (.zip)
              </a>
            )}
          </div>

          {documents.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ibm-text-muted text-center">No files uploaded.</p>
          ) : (
            <div className="divide-y divide-ibm-border">
              {documents.map((doc, i) => (
                <div key={i} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-ibm-canvas border border-ibm-border flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-ibm-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ibm-text-primary truncate">{doc.fileName}</p>
                      <p className="text-xs text-ibm-text-muted">
                        {labelOf(doc.fieldName)}
                        {doc.uploadedAt && (
                          <> · {new Date(doc.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    download={doc.fileName}
                    className="shrink-0 text-xs font-semibold text-ibm-blue hover:text-ibm-blue-hover transition-colors whitespace-nowrap"
                  >
                    ↓ Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
