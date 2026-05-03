'use client'

import { useMemo, useState } from 'react'
import ProgramCard from './ProgramCard'

interface Program {
  id: string
  name: string
  type: 'BACHELOR' | 'MASTER' | 'CERTIFICATE'
  studyField: string
  university: string
  description: string
}

const TYPES = ['BACHELOR', 'MASTER', 'CERTIFICATE'] as const

export default function ProgramsFilter({ programs }: { programs: Program[] }) {
  const [activeTypes,  setActiveTypes]  = useState<Set<string>>(new Set())
  const [activeFields, setActiveFields] = useState<Set<string>>(new Set())

  const studyFields = useMemo(
    () => [...new Set(programs.map(p => p.studyField).filter(Boolean))].sort(),
    [programs]
  )

  const filtered = useMemo(() => programs.filter(p => {
    const typeOk  = activeTypes.size  === 0 || activeTypes.has(p.type)
    const fieldOk = activeFields.size === 0 || activeFields.has(p.studyField)
    return typeOk && fieldOk
  }), [programs, activeTypes, activeFields])

  const toggle = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    return next
  }

  const hasFilters = activeTypes.size > 0 || activeFields.size > 0

  const chipBase    = 'text-xs font-semibold px-3 py-1.5 border transition-colors cursor-pointer'
  const chipActive  = 'bg-ibm-blue border-ibm-blue text-ibm-text-inverse'
  const chipInactive = 'border-ibm-border text-ibm-text-secondary hover:border-ibm-blue hover:text-ibm-blue'

  return (
    <div className="space-y-6">

      {/* ── Filter panel ── */}
      <div className="bg-ibm-card border border-ibm-border">

        <div className="px-5 py-3 border-b border-ibm-border flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-ibm-text-primary">
            Filter Programs
          </p>
          {hasFilters && (
            <button
              onClick={() => { setActiveTypes(new Set()); setActiveFields(new Set()) }}
              className="text-xs font-semibold text-ibm-blue hover:text-ibm-blue-hover transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="px-5 py-4 space-y-4">

          {/* Program type */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted w-20 shrink-0">
              Type
            </span>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveTypes(prev => toggle(prev, type))}
                  className={`${chipBase} ${activeTypes.has(type) ? chipActive : chipInactive}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Study field */}
          {studyFields.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted w-20 shrink-0">
                Field
              </span>
              <div className="flex flex-wrap gap-2">
                {studyFields.map(field => (
                  <button
                    key={field}
                    onClick={() => setActiveFields(prev => toggle(prev, field))}
                    className={`${chipBase} ${activeFields.has(field) ? chipActive : chipInactive}`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {hasFilters && (
          <div className="px-5 py-2.5 border-t border-ibm-border bg-ibm-canvas">
            <p className="text-xs text-ibm-text-muted">
              Showing <span className="font-semibold text-ibm-text-primary">{filtered.length}</span> of{' '}
              <span className="font-semibold text-ibm-text-primary">{programs.length}</span> programs
            </p>
          </div>
        )}
      </div>

      {/* ── Results grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-ibm-card border border-ibm-border p-16 text-center">
          <p className="text-ibm-text-secondary font-medium">No programs match your filters.</p>
          <button
            onClick={() => { setActiveTypes(new Set()); setActiveFields(new Set()) }}
            className="mt-3 text-xs font-semibold text-ibm-blue hover:text-ibm-blue-hover transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}

    </div>
  )
}
