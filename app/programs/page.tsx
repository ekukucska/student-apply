import { prisma } from '@/lib/prisma'
import ProgramCard from '@/components/ProgramCard'

export const dynamic = 'force-dynamic'

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Program Catalog</h1>
          <p className="text-gray-500 mt-1">
            Browse available Bachelor, Master, and Certificate programs
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No programs found.</p>
            <p className="text-sm mt-1">
              Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">npm run seed</code> to populate sample data.
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 mb-6 flex-wrap">
              {(['BACHELOR', 'MASTER', 'CERTIFICATE'] as const).map(type => {
                const count = programs.filter(p => p.type === type).length
                if (count === 0) return null
                return (
                  <span key={type} className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {type} ({count})
                  </span>
                )
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map(program => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
