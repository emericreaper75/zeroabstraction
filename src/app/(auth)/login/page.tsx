'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const updateClock = () => setUtcTime(new Date().toUTCString().slice(17, 25))
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await response.json().catch(() => ({}))
        setError(data.message || 'Authentication failed. Check your credentials.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="w-full flex-grow flex flex-col lg:flex-row min-h-[calc(100vh-1.5rem)] relative">
      <section className="relative w-full lg:w-[58%] flex flex-col justify-between p-6 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r overflow-hidden border-[color:var(--inverse-border)] bg-[color:var(--inverse-bg)]">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--inverse-border)] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[color:var(--sidebar-accent)]">ZeroAbstraction</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--sidebar-accent)]" />
            <span className="text-[color:var(--sidebar-fg-muted)] text-[11px] uppercase tracking-widest hidden sm:inline">Payload CMS Node</span>
          </div>
          <span className="text-[color:var(--sidebar-fg-muted)] text-xs font-mono">EPOCH 2026.3</span>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-2xl">
          <div className="flex flex-col gap-6">
            <div className="w-12 h-12 rounded-full border border-[color:var(--inverse-border)] flex items-center justify-center bg-[color:var(--inverse-bg)]">
              <span className="material-symbols-outlined text-[color:var(--sidebar-accent)]">flare</span>
            </div>
            <h1 className="text-[color:var(--inverse-fg)] font-[family-name:var(--font-display)] text-[var(--text-h1)]">Manoj Amavasya</h1>
            <p className="text-[color:var(--sidebar-fg-muted)] italic">Astronomical Atelier</p>
            <p className="text-[color:var(--sidebar-fg-muted)] max-w-md leading-relaxed">
              Observational telemetry, deep field gravitational surveys, and digital curation archive at the edge of cosmic resolution.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-[color:var(--sidebar-fg-muted)] border-t border-[color:var(--inverse-border)] pt-4">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" />Node α // Active Spectrum</span>
          <span>UTC {utcTime}</span>
        </div>
      </section>

      <section className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-[color:var(--inverse-bg)]">
        <div className="w-full max-w-md bg-[color:var(--inverse-bg)] text-[color:var(--inverse-fg)] border border-[color:var(--inverse-border)] p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between border-b border-[color:var(--inverse-border)] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[color:var(--inverse-fg)]">Observatory Access</span>
            <span className="text-xs font-mono text-[color:var(--warning)]">SECURE_NODE</span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h2)]">Sign In</h2>
          <p className="text-[color:var(--sidebar-fg-muted)] mt-1">Authenticate into the atelier observational console</p>

          {error && (
            <div className="mt-4 p-3 border border-[color:var(--danger)] text-[color:var(--danger)] text-sm" role="alert">{error}</div>
          )}

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[color:var(--inverse-fg)]" htmlFor="identity-input">Observer Identity</label>
              <input
                id="identity-input"
                className="w-full bg-transparent border border-[color:var(--inverse-border)] text-[color:var(--inverse-fg)] px-4 py-3 focus:border-[color:var(--sidebar-accent)] focus:outline-none"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[color:var(--inverse-fg)]" htmlFor="token-input">Access Key</label>
              <div className="relative">
                <input
                  id="token-input"
                  className="w-full bg-transparent border border-[color:var(--inverse-border)] text-[color:var(--inverse-fg)] px-4 py-3 pr-12 focus:border-[color:var(--sidebar-accent)] focus:outline-none"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button type="button" className="absolute right-3 top-2.5 min-h-11 min-w-11 text-[color:var(--sidebar-fg-muted)]" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide access key' : 'Show access key'}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="min-h-11 bg-[color:var(--accent)] text-[color:var(--on-accent)] font-mono text-sm uppercase hover:bg-[color:var(--accent-hover)] disabled:opacity-50">
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
