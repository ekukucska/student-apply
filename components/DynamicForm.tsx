'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from './FileUpload'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'file'
  required: boolean
  options?: string[]
}

interface DynamicFormProps {
  programId: string
  fields: FormField[]
  userId?: string
}

const inputClass =
  'w-full border border-ibm-border-strong bg-ibm-canvas text-ibm-text-primary text-sm px-3 py-2.5 focus:outline-none focus:border-ibm-blue focus:ring-1 focus:ring-ibm-blue transition-colors placeholder:text-ibm-text-muted'

const labelClass =
  'block text-xs font-semibold text-ibm-text-primary uppercase tracking-wide mb-2'

export default function DynamicForm({
  programId,
  fields,
  userId = 'demo-user-1',
}: DynamicFormProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [documents, setDocuments] = useState<
    { fieldName: string; fileName: string; fileUrl: string }[]
  >([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (name: string, value: string) => {
    setAnswers(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (fieldName: string, fileName: string, fileUrl: string) => {
    setDocuments(prev => [
      ...prev.filter(d => d.fieldName !== fieldName),
      { fieldName, fileName, fileUrl },
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, programId, answers, documents }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Submission failed')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <div className="w-12 h-12 bg-ibm-success flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-ibm-text-primary mb-2">Application Submitted</h2>
        <p className="text-sm text-ibm-text-secondary mb-6">
          Your application has been received and is now under review.
        </p>
        <button
          onClick={() => router.push('/programs')}
          className="bg-ibm-blue hover:bg-ibm-blue-hover text-ibm-text-inverse text-sm font-semibold px-6 py-2.5 transition-colors"
        >
          Browse More Programs
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map(field => {
        if (field.type === 'file') {
          return (
            <FileUpload
              key={field.name}
              fieldName={field.name}
              label={field.label}
              required={field.required}
              userId={userId}
              programId={programId}
              onUpload={handleFileUpload}
            />
          )
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name}>
              <label className={labelClass}>
                {field.label} {field.required && <span className="text-ibm-error normal-case tracking-normal">*</span>}
              </label>
              <textarea
                name={field.name}
                required={field.required}
                rows={5}
                value={answers[field.name] ?? ''}
                onChange={e => handleChange(field.name, e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
          )
        }

        if (field.type === 'select') {
          return (
            <div key={field.name}>
              <label className={labelClass}>
                {field.label} {field.required && <span className="text-ibm-error normal-case tracking-normal">*</span>}
              </label>
              <select
                name={field.name}
                required={field.required}
                value={answers[field.name] ?? ''}
                onChange={e => handleChange(field.name, e.target.value)}
                className={`${inputClass} appearance-none`}
              >
                <option value="">Select an option</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )
        }

        return (
          <div key={field.name}>
            <label className={labelClass}>
              {field.label} {field.required && <span className="text-ibm-error normal-case tracking-normal">*</span>}
            </label>
            <input
              type={field.type}
              name={field.name}
              required={field.required}
              value={answers[field.name] ?? ''}
              onChange={e => handleChange(field.name, e.target.value)}
              className={inputClass}
            />
          </div>
        )
      })}

      {error && (
        <div className="flex items-start gap-2 bg-ibm-error/5 border border-ibm-error px-4 py-3">
          <svg className="w-4 h-4 text-ibm-error mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-ibm-error">{error}</p>
        </div>
      )}

      <div className="pt-2 border-t border-ibm-border">
        <button
          type="submit"
          disabled={submitting}
          className="bg-ibm-blue hover:bg-ibm-blue-hover disabled:bg-ibm-border-strong text-ibm-text-inverse text-sm font-semibold px-8 py-3 transition-colors w-full"
        >
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}
