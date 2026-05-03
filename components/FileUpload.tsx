'use client'

import { useRef, useState } from 'react'

interface FileUploadProps {
  fieldName: string
  label: string
  required: boolean
  onUpload: (fieldName: string, fileName: string, fileUrl: string) => void
}

export default function FileUpload({ fieldName, label, required, onUpload }: FileUploadProps) {
  const [uploaded, setUploaded] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fakeUrl = `/uploads/${Date.now()}_${file.name}`
    setUploaded(file.name)
    onUpload(fieldName, file.name, fakeUrl)
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-ibm-text-primary uppercase tracking-wide mb-2">
        {label} {required && <span className="text-ibm-error normal-case tracking-normal">*</span>}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className={`
          border border-dashed cursor-pointer px-4 py-5 text-center transition-colors
          ${uploaded
            ? 'border-ibm-success bg-ibm-success/5'
            : 'border-ibm-border-strong hover:border-ibm-blue hover:bg-ibm-blue-light'
          }
        `}
      >
        {uploaded ? (
          <div className="flex items-center justify-center gap-2 text-sm text-ibm-success font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {uploaded}
          </div>
        ) : (
          <div>
            <svg className="w-5 h-5 text-ibm-text-muted mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-xs text-ibm-text-muted">Click to select a file</p>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
    </div>
  )
}
