'use client'

import Link from 'next/link'

interface Program {
  id: string
  name: string
  type: 'BACHELOR' | 'MASTER' | 'CERTIFICATE'
  university: string
  description: string
}

const typeStyles: Record<Program['type'], string> = {
  BACHELOR: 'bg-blue-100 text-blue-800',
  MASTER: 'bg-purple-100 text-purple-800',
  CERTIFICATE: 'bg-emerald-100 text-emerald-800',
}

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeStyles[program.type]}`}>
          {program.type}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
      <p className="text-sm text-gray-500">{program.university}</p>
      <p className="text-sm text-gray-600 line-clamp-3 flex-1">{program.description}</p>
      <Link
        href={`/apply/${program.id}`}
        className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Apply Now →
      </Link>
    </div>
  )
}
