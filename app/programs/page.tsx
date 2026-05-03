import { prisma } from '@/lib/prisma'
import ProgramCard from '@/components/ProgramCard'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: Record<string, string> = {
  BACHELOR: 'Bachelor',
  MASTER: 'Master',
  CERTIFICATE: 'Certificate',
}

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const types = ['BACHELOR', 'MASTER', 'CERTIFICATE'] as const

  return (
    <main className="min-h-screen bg-ibm-canvas">

      {/* ── Page header ── */}
      <div className="bg-ibm-nav text-ibm-text-inverse px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-ibm-text-muted mb-2">
            Catalog
          </p>
          <h1 className="text-3xl font-light">Program Catalog</h1>
          <p className="text-ibm-text-muted text-sm mt-2">
            {programs.length} program{programs.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {programs.length === 0 ? (
          <div className="bg-ibm-card border border-ibm-border p-12 text-center">
            <p className="text-ibm-text-secondary font-medium">No programs found.</p>
            <p className="text-ibm-text-muted text-sm mt-1">
              Run <code className="bg-ibm-canvas px-1.5 py-0.5 font-mono text-xs">npm run seed</code> to populate sample data.
            </p>
          </div>
        ) : (
          <>
            {/* ── Type group sections ── */}
            {types.map(type => {
              const group = programs.filter(p => p.type === type)
              if (group.length === 0) return null
              return (
                <section key={type} className="mb-10">
                  <div className="flex items-center gap-3 mb-4 border-b border-ibm-border pb-3">
                    <h2 className="text-sm font-semibold text-ibm-text-primary tracking-wide uppercase">
                      {TYPE_LABELS[type]}
                    </h2>
                    <span className="text-xs text-ibm-text-muted bg-ibm-overlay px-2 py-0.5">
                      {group.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.map(program => (
                      <ProgramCard key={program.id} program={program} />
                    ))}
                  </div>
                </section>
              )
            })}
          </>
        )}
      </div>
    </main>
  )
}
