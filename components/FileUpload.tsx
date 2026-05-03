'use client'

import { useRef, useState } from 'react'

type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'

interface FileUploadProps {
  fieldName: string
  label: string
  required: boolean
  userId: string
  programId: string
  onUpload: (fieldName: string, fileName: string, fileUrl: string) => void
}

export default function FileUpload({
  fieldName,
  label,
  required,
  userId,
  programId,
  onUpload,
}: FileUploadProps) {
  const [status, setStatus]           = useState<UploadStatus>('idle')
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  const [errorMsg, setErrorMsg]       = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('uploading')
    setErrorMsg(null)

    try {
      const body = new FormData()
      body.append('file',      file)
      body.append('fieldName', fieldName)
      body.append('userId',    userId)
      body.append('programId', programId)

      const res = await fetch('/api/upload', { method: 'POST', body })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Upload failed')
      }

      const { url, fileName } = await res.json()
      setUploadedName(fileName)
      setStatus('done')
      onUpload(fieldName, fileName, url)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const zoneClass = [
    'border border-dashed px-4 py-5 text-center transition-colors',
    status === 'done'
      ? 'border-ibm-success bg-ibm-success/5 cursor-default'
      : status === 'uploading'
      ? 'border-ibm-border-strong bg-ibm-overlay cursor-not-allowed'
      : status === 'error'
      ? 'border-ibm-error bg-ibm-error/5 cursor-pointer hover:bg-ibm-error/10'
      : 'border-ibm-border-strong cursor-pointer hover:border-ibm-blue hover:bg-ibm-blue-light',
  ].join(' ')

  return (
    <div>
      <label className="block text-xs font-semibold text-ibm-text-primary uppercase tracking-wide mb-2">
        {label} {required && <span className="text-ibm-error normal-case tracking-normal">*</span>}
      </label>

      <div className={zoneClass} onClick={() => status !== 'uploading' && inputRef.current?.click()}>

        {status === 'idle' && (
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-ibm-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-xs text-ibm-text-muted">Click to select a file</p>
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex items-center justify-center gap-2 text-sm text-ibm-text-muted">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Uploading…
          </div>
        )}

        {status === 'done' && (
          <div className="flex items-center justify-center gap-2 text-sm text-ibm-success font-medium">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="truncate max-w-xs">{uploadedName}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="text-sm text-ibm-error">
            <p className="font-medium">Upload failed — click to retry</p>
            <p className="text-xs mt-0.5 text-ibm-text-muted">{errorMsg}</p>
          </div>
        )}

      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
    </div>
  )
}
