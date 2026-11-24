'use client'
import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-[color:var(--bg)] text-[color:var(--text)]">
      <h2 className="text-3xl font-[family-name:var(--font-display)] mb-4">500 — Internal Server Error</h2>
      <p className="text-[color:var(--text-muted)] max-w-md mb-6">The server encountered an unexpected condition that prevented it from fulfilling the request.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 border border-[color:var(--border)] font-mono text-xs uppercase tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors"
      >
        Retry Request
      </button>
    </div>
  )
}
