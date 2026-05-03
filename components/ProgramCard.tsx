'use client'

import Link from 'next/link'

interface Program {
  id: string
  name: string
  type: 'BACHELOR' | 'MASTER' | 'CERTIFICATE'
  university: string
  description: string
}

const tagStyles: Record<Program['type'], string> = {
  BACHELOR:    'bg-tag-bachelor text-ibm-text-inverse',
  MASTER:      'bg-tag-master text-ibm-text-inverse',
  CERTIFICATE: 'bg-tag-cert text-ibm-text-inverse',
}

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="bg-ibm-card border border-ibm-border flex flex-col p-6 hover:bg-ibm-blue-light transition-colors group">

      <div className="mb-4">
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 ${tagStyles[program.type]}`}>
          {program.type}
        </span>
      </div>

      <h3 className="text-base font-semibold text-ibm-text-primary mb-1 group-hover:text-ibm-blue transition-colors">
        {program.name}
      </h3>

      <p className="text-xs font-medium text-ibm-text-muted mb-3 uppercase tracking-wide">
        {program.university}
      </p>

      <p className="text-sm text-ibm-text-secondary leading-relaxed flex-1 line-clamp-3 mb-5">
        {program.description}
      </p>

      <Link
        href={`/apply/${program.id}`}
        className="inline-flex items-center gap-2 self-start bg-ibm-blue hover:bg-ibm-blue-hover text-ibm-text-inverse text-xs font-semibold px-4 py-2 transition-colors"
      >
        Apply Now
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>

    </div>
  )
}
