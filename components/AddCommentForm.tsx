'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  applicationId: string
}

export default function AddCommentForm({ applicationId }: Props) {
  const router = useRouter()
  const [reviewerName, setReviewerName] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/applications/${applicationId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerName, body }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to post comment.')
      }
      setReviewerName('')
      setBody('')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-ibm-border space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-ibm-text-muted">Add Comment</p>
      <input
        type="text"
        placeholder="Your name"
        value={reviewerName}
        onChange={e => setReviewerName(e.target.value)}
        required
        className="w-full bg-ibm-canvas border border-ibm-border px-3 py-2 text-sm text-ibm-text-primary placeholder:text-ibm-text-muted focus:outline-none focus:border-ibm-blue"
      />
      <textarea
        placeholder="Write a comment…"
        value={body}
        onChange={e => setBody(e.target.value)}
        required
        rows={3}
        className="w-full bg-ibm-canvas border border-ibm-border px-3 py-2 text-sm text-ibm-text-primary placeholder:text-ibm-text-muted focus:outline-none focus:border-ibm-blue resize-none"
      />
      {error && <p className="text-xs text-ibm-error">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-ibm-blue text-ibm-text-inverse text-xs font-semibold px-4 py-2 hover:bg-ibm-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? 'Posting…' : 'Post Comment'}
      </button>
    </form>
  )
}
