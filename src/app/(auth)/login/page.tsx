'use client'

import React, { useState, useEffect } from 'react'
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
    function updateClock() {
      const now = new Date()
      const year = now.getUTCFullYear()
      const month = String(now.getUTCMonth() + 1).padStart(2, '0')
      const day = String(now.getUTCDate()).padStart(2, '0')
      const hours = String(now.getUTCHours()).padStart(2, '0')
      const mins = String(now.getUTCMinutes()).padStart(2, '0')
      const secs = String(now.getUTCSeconds()).padStart(2, '0')
      setUtcTime(`${year}.${month}.${day} ${hours}:${mins}:${secs}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || 'Authentication failed. Check your credentials.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Main Login Workspace */}
      <main className="w-full flex-grow flex flex-col lg:flex-row min-h-[calc(100vh-1.5rem)] relative">
        {/* LEFT HERO PANE (~58%) — Dark Cosmic Palette 03 */}
        <div className="relative w-full lg:w-[58%] flex flex-col justify-between p-space-md md:p-space-lg lg:p-space-xl border-b lg:border-b-0 lg:border-r overflow-hidden border-hairline-rule/40">
          {/* Background Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1117]/85 via-[#0F1117]/65 to-[#0F1117]/95" />
            <div className="absolute inset-0 cosmic-grid opacity-35" />
          </div>

          {/* Top Branding & Telemetry */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-space-sm border-b border-hairline-rule pb-space-sm">
            <div className="flex items-center space-x-3">
              <span className="text-primary font-headline-sm tracking-tight font-light">ZeroAbstraction</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              <span className="text-label-sm font-label-sm text-ink-muted uppercase tracking-widest hidden sm:inline">Payload CMS Node</span>
            </div>
            <div className="flex items-center space-x-2 text-label-sm font-label-sm text-ink-secondary">
              <span className="material-symbols-outlined text-primary text-base">all_inclusive</span>
              <span className="font-mono tracking-wider text-[11px]">EPOCH 2026.3</span>
            </div>
          </div>

          {/* Center Narrative */}
          <div className="relative z-10 my-auto py-space-xl max-w-2xl">
            <div className="space-y-space-md">
              <div className="w-12 h-12 rounded-full border border-hairline-rule flex items-center justify-center bg-surface/80 backdrop-blur-sm mb-space-md shadow-inner">
                <span className="material-symbols-outlined text-primary text-xl">flare</span>
              </div>
              <h1 className="text-on-surface font-headline-xl text-headline-xl tracking-tight leading-tight">Manoj Amavasya</h1>
              <p className="text-ink-secondary font-headline-md italic font-light tracking-wide">Astronomical Atelier</p>
              <p className="text-ink-muted text-body-sm font-body-sm max-w-md pt-2 leading-relaxed">
                Observational telemetry, deep field gravitational surveys, and digital curation archive at the edge of cosmic resolution.
              </p>
              <div className="pt-space-lg flex items-center space-x-4 text-ink-secondary">
                <span className="material-symbols-outlined text-lg hover:text-primary transition-colors cursor-pointer" title="Observatory Optics">telescope</span>
                <span className="material-symbols-outlined text-lg hover:text-primary transition-colors cursor-pointer" title="Cryptographic Access">key</span>
                <span className="material-symbols-outlined text-lg hover:text-primary transition-colors cursor-pointer" title="Terminal Node">terminal</span>
                <span className="material-symbols-outlined text-lg hover:text-primary transition-colors cursor-pointer" title="Spectroscopy Matrix">blur_on</span>
              </div>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="relative z-10 flex items-center justify-between text-label-sm font-label-sm text-ink-muted border-t border-hairline-rule pt-space-sm">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
              <span className="tracking-wider uppercase text-on-surface font-mono">Node α // Active Spectrum</span>
            </div>
            <div className="font-mono text-label-sm text-ink-muted">
              UTC <span>{utcTime}</span>
            </div>
          </div>
        </div>

        {/* RIGHT AUTH PANE (~42%) — Palette 03 Card */}
        <div className="w-full lg:w-[42%] flex items-center justify-center p-space-md sm:p-space-lg lg:p-space-xl relative z-10 border-hairline-rule/40 bg-gradient-to-b from-paper-base via-surface to-paper-base">
          {/* Ambient glow */}
          <div className="absolute w-72 h-72 rounded-full bg-primary/10 filter blur-3xl pointer-events-none" />

          {/* Credential Card */}
          <div className="w-full max-w-md bg-paper-surface text-on-surface border border-hairline-rule p-space-lg sm:p-space-xl relative shadow-2xl rounded-sm">
            {/* Corner Registration Notches */}
            <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-primary" />
            <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 border-primary" />
            <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 border-primary" />
            <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-primary" />

            {/* Card Header */}
            <div className="mb-space-lg flex items-center justify-between border-b border-hairline-rule pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                <span className="text-label-sm font-label-sm uppercase tracking-[0.14em] text-ink-secondary font-mono">Observatory Access</span>
              </div>
              <span className="text-label-sm font-label-sm text-primary font-mono tracking-wider font-semibold px-2 py-0.5 bg-amber-wash border border-primary/30 rounded">SECURE_NODE</span>
            </div>

            {/* Title */}
            <div className="mb-space-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-normal">Sign In</h2>
              <p className="text-ink-muted text-body-sm font-body-sm mt-1">Authenticate into the atelier observational console</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-space-md p-3 bg-red-950/40 border border-error text-error text-body-sm font-body-sm rounded-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="space-y-space-md" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase" htmlFor="identity-input">Observer Identity</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-ink-muted text-lg pointer-events-none">alternate_email</span>
                  <input
                    className="w-full bg-paper-base border border-hairline-rule text-on-surface text-body-md font-body-md pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-150 rounded-none placeholder:text-ink-muted/50 shadow-sm"
                    id="identity-input"
                    placeholder="observer@zeroabstraction.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase" htmlFor="token-input">Access Key</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-ink-muted text-lg pointer-events-none">key</span>
                  <input
                    className="w-full bg-paper-base border border-hairline-rule text-on-surface text-body-md font-body-md pl-10 pr-10 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors duration-150 rounded-none placeholder:text-ink-muted/50 font-mono tracking-widest shadow-sm"
                    id="token-input"
                    placeholder="••••••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-ink-muted hover:text-primary transition-colors focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between pt-1 text-label-sm font-label-sm">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input type="checkbox" className="atelier-checkbox" defaultChecked />
                  <span className="text-ink-secondary tracking-wide font-body-sm text-[13px]">Remember identity</span>
                </label>
                <a className="text-primary hover:text-accent-ochre font-medium transition-colors tracking-wide underline underline-offset-4 decoration-primary/40" href="#">Forgot access?</a>
              </div>

              {/* Submit */}
              <div className="pt-space-sm">
                <button
                  className="w-full bg-primary text-on-primary font-label-md text-label-md font-medium tracking-[0.16em] uppercase py-3 px-space-md hover:bg-accent-ochre active:translate-y-px transition-all duration-150 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-none disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Authenticating...' : 'Authenticate'}</span>
                  {!isLoading && <span className="material-symbols-outlined text-base">arrow_forward</span>}
                </button>
              </div>

              {/* Passkey Buttons */}
              <div className="pt-space-md border-t border-hairline-rule">
                <div className="text-center mb-space-sm">
                  <span className="text-label-sm font-label-sm text-ink-muted tracking-wider uppercase">Or passkey authorization</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <button className="w-11 h-11 flex items-center justify-center border border-hairline-rule bg-paper-base hover:border-primary hover:text-primary text-ink-secondary hover:shadow-sm transition-all rounded-none" type="button" title="Biometrics">
                    <span className="material-symbols-outlined text-lg">fingerprint</span>
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center border border-hairline-rule bg-paper-base hover:border-primary hover:text-primary text-ink-secondary hover:shadow-sm transition-all rounded-none" type="button" title="Hardware Key">
                    <span className="material-symbols-outlined text-lg">vpn_key</span>
                  </button>
                  <button className="w-11 h-11 flex items-center justify-center border border-hairline-rule bg-paper-base hover:border-primary hover:text-primary text-ink-secondary hover:shadow-sm transition-all rounded-none" type="button" title="Terminal CLI">
                    <span className="material-symbols-outlined text-lg">terminal</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Status Bar Footer */}
      <footer className="bg-paper-base border-t border-hairline-rule flex justify-between items-center w-full px-space-md py-1 h-6 text-label-sm font-label-sm text-ink-muted z-30 select-none">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          <span className="font-label-sm font-mono tracking-wider text-[11px]">ZEROABSTRACTION // v3.28</span>
        </div>
        <div className="flex items-center space-x-4 font-label-sm text-[11px]">
          <span className="text-ink-muted/50 font-mono hidden sm:inline">ASTRO-SYS // OBSERVATORY NODE</span>
        </div>
      </footer>
    </>
  )
}
