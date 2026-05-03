import { prisma } from '@/lib/prisma'
import ProgramsFilter from '@/components/ProgramsFilter'

export const dynamic = 'force-dynamic'

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { name: 'asc' },
  })

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
          <ProgramsFilter programs={programs} />
        )}
      </div>

    </main>
  )
}
