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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 transition-colors"
      >
        {uploaded ? (
          <p className="text-sm text-emerald-600 font-medium">✓ {uploaded}</p>
        ) : (
          <p className="text-sm text-gray-400">Click to select a file</p>
        )}
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
    </div>
  )
}
