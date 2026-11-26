'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ObservatoryHero } from '@/components/auth/ObservatoryHero'
import { ObservatoryBackdrop } from '@/components/auth/ObservatoryBackdrop'
import { AuthDialogs, type AuthDialogKind } from '@/components/auth/AuthDialogs'
import { LoginToast, type LoginToastMessage } from '@/components/auth/LoginToast'

const THEME_KEY = 'payload-admin-theme'
const REMEMBERED_EMAIL_KEY = 'za_remembered_email'

type ClockMode = 'UTC' | 'LOCAL' | 'JD'

function computeJulianDate(date: Date): string {
  const jd = date.getTime() / 86400000 + 2440587.5
  return jd.toFixed(4)
}

export default function LoginPage() {
  const router = useRouter()

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberIdentity, setRememberIdentity] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [shakeCard, setShakeCard] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null)

  const [clockMode, setClockMode] = useState<ClockMode>('UTC')
  const [clockText, setClockText] = useState('----.--.-- --:--:--')
  const [healthState, setHealthState] = useState<{
    status: 'checking' | 'ok' | 'degraded'
    latencyMs: number | null
  }>({ status: 'checking', latencyMs: null })

  const [openDialog, setOpenDialog] = useState<AuthDialogKind>(null)
  const [toasts, setToasts] = useState<LoginToastMessage[]>([])

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const toastIdRef = useRef(0)

  const isDark = theme === 'dark'

  const notify = useCallback((text: string, tone: 'info' | 'success' | 'warning' = 'info') => {
    const id = ++toastIdRef.current
    setToasts((prev) => [...prev.slice(-2), { id, text, tone }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const applyTheme = useCallback((next: 'light' | 'dark') => {
    setTheme(next)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(next)
      document.documentElement.style.colorScheme = next
      const meta = document.querySelector('meta[name="color-scheme"]')
      if (meta) meta.setAttribute('content', next)
    }
  }, [])

  const pingHealth = useCallback(
    async (manual = false) => {
      setHealthState((prev) => ({ ...prev, status: 'checking' }))
      const start = performance.now()
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        const elapsed = Math.round(performance.now() - start)
        if (res.ok) {
          setHealthState({ status: 'ok', latencyMs: elapsed })
          if (manual) notify(`Node A operational (${elapsed} ms)`, 'success')
        } else {
          setHealthState({ status: 'degraded', latencyMs: elapsed })
          if (manual) notify(`Node A returned HTTP ${res.status}`, 'warning')
        }
      } catch {
        setHealthState({ status: 'degraded', latencyMs: null })
        if (manual) notify('Health check unreachable', 'warning')
      }
    },
    [notify],
  )

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY)
      const initialTheme: 'light' | 'dark' = savedTheme === 'dark' ? 'dark' : 'light'
      applyTheme(initialTheme)

      const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY)
      if (savedEmail) {
        setEmail(savedEmail)
        setRememberIdentity(true)
        setTimeout(() => passwordInputRef.current?.focus(), 60)
      } else {
        setTimeout(() => emailInputRef.current?.focus(), 60)
      }
    } catch {
      setTimeout(() => emailInputRef.current?.focus(), 60)
    }

    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue)
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('storage', handleStorage)

    pingHealth(false)

    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.email) {
          setActiveUserEmail(data.user.email)
        }
      })
      .catch(() => {})

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('storage', handleStorage)
    }
  }, [applyTheme, pingHealth])

  useEffect(() => {
    function updateClock() {
      const now = new Date()
      if (clockMode === 'JD') {
        setClockText(`JD ${computeJulianDate(now)}`)
        return
      }
      const useUtc = clockMode === 'UTC'
      const year = useUtc ? now.getUTCFullYear() : now.getFullYear()
      const month = String((useUtc ? now.getUTCMonth() : now.getMonth()) + 1).padStart(2, '0')
      const day = String(useUtc ? now.getUTCDate() : now.getDate()).padStart(2, '0')
      const hours = String(useUtc ? now.getUTCHours() : now.getHours()).padStart(2, '0')
      const mins = String(useUtc ? now.getUTCMinutes() : now.getMinutes()).padStart(2, '0')
      const secs = String(useUtc ? now.getUTCSeconds() : now.getSeconds()).padStart(2, '0')
      setClockText(`${year}.${month}.${day} ${hours}:${mins}:${secs}`)
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [clockMode])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable

      if (e.key === '?' && !isInput && !openDialog) {
        e.preventDefault()
        setOpenDialog('shortcuts')
      } else if (e.key === 'Escape' && !openDialog && error) {
        setError('')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openDialog, error])

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {}
  }

  const cycleClockMode = () => {
    const order: ClockMode[] = ['UTC', 'LOCAL', 'JD']
    const next = order[(order.indexOf(clockMode) + 1) % order.length]
    setClockMode(next)
  }

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      notify(`${label} copied to clipboard`, 'success')
    } catch {
      notify('Unable to copy to clipboard', 'warning')
    }
  }

  const emailInvalid = emailTouched && email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const triggerShake = () => {
    setShakeCard(false)
    requestAnimationFrame(() => setShakeCard(true))
    setTimeout(() => setShakeCard(false), 400)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEmailTouched(true)

    if (!isOnline) {
      setError('Network connection appears offline. Reconnect and try again.')
      triggerShake()
      return
    }

    if (emailInvalid) {
      setError('Please enter a valid observer email address.')
      triggerShake()
      emailInputRef.current?.focus()
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: 'include',
      })

      if (res.ok) {
        try {
          if (rememberIdentity) {
            localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim())
          } else {
            localStorage.removeItem(REMEMBERED_EMAIL_KEY)
          }
        } catch {}
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/admin')
          router.refresh()
        }, 350)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message || 'Authentication failed. Check your credentials.')
        triggerShake()
      }
    } catch {
      setError('Connection error. Please try again.')
      triggerShake()
    } finally {
      setIsLoading(false)
    }
  }

  const diagnosticsText = `ZeroAbstraction Observatory Node
Theme: ${theme}
Online: ${isOnline}
Timestamp: ${new Date().toISOString()}`

  return (
    <div className="min-h-dvh flex flex-col justify-between relative">
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:rounded-[10px] focus:bg-[#2563EB] focus:text-white focus:text-xs focus:font-medium"
      >
        Skip to sign in form
      </a>

      {/* z-index 0 & 1: Polar Reticle + Constellation Canvas + Right-to-Left Gradient Cover */}
      <ObservatoryBackdrop theme={theme} />

      {/* z-index 3: Top Bar */}
      <header className="relative z-[3] w-full px-6 sm:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
          <span
            className="font-semibold tracking-tight text-[15px]"
            style={{
              fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              color: isDark ? '#F8FAFC' : '#0F172A',
            }}
          >
            ZeroAbstraction
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] border text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            style={{
              backgroundColor: isDark ? '#0D131F' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#CBD5E1' : '#334155',
            }}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <Link
            href="/"
            className="typo-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            style={{
              backgroundColor: isDark ? '#0D131F' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#CBD5E1' : '#334155',
            }}
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Public Site</span>
          </Link>
        </div>
      </header>

      {/* z-index 2: Main Split-Pane Login Workspace */}
      <main className="w-full flex-grow flex flex-col lg:flex-row relative z-[2]">
        <ObservatoryHero theme={theme} latencyMs={healthState.latencyMs} />

        {/* Right Sign-In Card */}
        <section
          aria-label="Sign in"
          className="w-full lg:w-[44%] flex items-center justify-center px-6 sm:px-8 lg:px-12 py-8"
        >
          <div
            className={`w-full max-w-[380px] p-7 rounded-[18px] border ${shakeCard ? 'auth-shake' : ''}`}
            style={{
              backgroundColor: isDark ? '#0D131F' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
              color: isDark ? '#F8FAFC' : '#0F172A',
              boxShadow: isDark
                ? '0 18px 44px -14px rgba(0, 0, 0, 0.65)'
                : '0 16px 40px -14px rgba(15, 23, 42, 0.10)',
            }}
          >
            {/* Active Session Banner */}
            {activeUserEmail && (
              <div className="mb-4 p-3 rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-emerald-500">
                    Active session detected
                  </div>
                  <div className="typo-mono-data text-[11px] truncate opacity-80">
                    {activeUserEmail}
                  </div>
                </div>
                <Link
                  href="/admin"
                  className="typo-btn shrink-0 px-2.5 py-1 rounded-[8px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-[12px]"
                >
                  Continue →
                </Link>
              </div>
            )}

            {/* Offline Warning */}
            {!isOnline && (
              <div
                role="status"
                className="mb-4 p-2.5 rounded-[10px] border border-amber-500/40 bg-amber-500/10 text-amber-500 text-[12px] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">wifi_off</span>
                <span>Offline — network required to sign in.</span>
              </div>
            )}

            {/* Title */}
            <div className="mb-5">
              <h2
                className="text-[20px] leading-[26px] font-semibold tracking-[-0.02em]"
                style={{
                  fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                  color: isDark ? '#F8FAFC' : '#0F172A',
                }}
              >
                Sign In
              </h2>
              <p
                className="text-[13px] mt-1"
                style={{ color: isDark ? '#94A3B8' : '#64748B' }}
              >
                Authenticate to console.
              </p>
            </div>

            {/* Inline Error Alert */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-4 p-2.5 rounded-[10px] bg-rose-500/10 border border-rose-500/35 text-rose-500 text-[12px] flex items-start justify-between gap-2"
              >
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError('')}
                  aria-label="Dismiss error"
                  className="shrink-0 opacity-75 hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form id="login-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Observer Identity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[12px] font-medium"
                    style={{ color: isDark ? '#CBD5E1' : '#334155' }}
                    htmlFor="identity-input"
                  >
                    Observer Identity
                  </label>
                  {emailInvalid && (
                    <span id="email-error" className="text-[11px] font-medium text-rose-500">
                      Invalid email format
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none"
                    style={{ color: isDark ? '#64748B' : '#94A3B8' }}
                  >
                    alternate_email
                  </span>
                  <input
                    ref={emailInputRef}
                    id="identity-input"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    aria-invalid={emailInvalid}
                    aria-describedby={emailInvalid ? 'email-error' : undefined}
                    placeholder="observer@zeroabstraction.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    className="w-full text-[13.5px] pl-9 pr-8 py-2.5 rounded-[10px] border transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                    style={{
                      backgroundColor: isDark ? '#060A12' : '#F8FAFC',
                      borderColor: emailInvalid
                        ? '#EF4444'
                        : isDark
                          ? '#1E293B'
                          : '#E2E8F0',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                    }}
                  />
                  {email.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('')
                        setEmailTouched(false)
                        emailInputRef.current?.focus()
                      }}
                      aria-label="Clear email"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Access Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[12px] font-medium"
                    style={{ color: isDark ? '#CBD5E1' : '#334155' }}
                    htmlFor="token-input"
                  >
                    Access Key
                  </label>
                  {capsLockOn && (
                    <span className="typo-mono-data text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500">
                      CAPS LOCK ON
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] pointer-events-none"
                    style={{ color: isDark ? '#64748B' : '#94A3B8' }}
                  >
                    key
                  </span>
                  <input
                    ref={passwordInputRef}
                    id="token-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    onKeyDown={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
                    className="w-full text-[13.5px] pl-9 pr-9 py-2.5 rounded-[10px] border font-mono tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30"
                    style={{
                      backgroundColor: isDark ? '#060A12' : '#F8FAFC',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide access key' : 'Show access key'}
                    aria-pressed={showPassword}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Identity & Forgot Access */}
              <div className="flex items-center justify-between pt-0.5 text-[12.5px]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="atelier-checkbox"
                    checked={rememberIdentity}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setRememberIdentity(checked)
                      if (!checked) {
                        try {
                          localStorage.removeItem(REMEMBERED_EMAIL_KEY)
                          notify('Remembered identity cleared', 'info')
                        } catch {}
                      }
                    }}
                  />
                  <span style={{ color: isDark ? '#CBD5E1' : '#334155' }}>
                    Remember Identity
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setOpenDialog('forgot')}
                  className="text-[#2563EB] dark:text-[#60A5FA] hover:underline underline-offset-4 font-medium"
                >
                  Forgot access?
                </button>
              </div>

              {/* Primary Submit Button — Fixed Height */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess || !isOnline}
                  aria-busy={isLoading}
                  className="w-full h-11 font-medium text-[13.5px] px-4 rounded-[10px] text-white transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50 disabled:opacity-60"
                  style={{
                    backgroundColor: isSuccess ? '#059669' : '#2563EB',
                  }}
                >
                  {isSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[17px]">check_circle</span>
                      <span>Access Granted...</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                        />
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              {/* Alternative Authorization */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: isDark ? '#1E293B' : '#E2E8F0' }}
              >
                <div className="text-center mb-2.5">
                  <span
                    className="typo-mono-data text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: isDark ? '#64748B' : '#64748B' }}
                  >
                    ALTERNATIVE AUTHORIZATION
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenDialog('biometrics')}
                    className="h-9 flex items-center justify-center gap-1.5 border rounded-[8px] text-[12px] font-medium transition-colors hover:border-[#2563EB]"
                    style={{
                      backgroundColor: isDark ? '#060A12' : '#F8FAFC',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      color: isDark ? '#CBD5E1' : '#334155',
                    }}
                  >
                    <span className="material-symbols-outlined text-[15px]">fingerprint</span>
                    <span>Passkey</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDialog('hardware')}
                    className="h-9 flex items-center justify-center gap-1.5 border rounded-[8px] text-[12px] font-medium transition-colors hover:border-[#2563EB]"
                    style={{
                      backgroundColor: isDark ? '#060A12' : '#F8FAFC',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      color: isDark ? '#CBD5E1' : '#334155',
                    }}
                  >
                    <span className="material-symbols-outlined text-[15px]">vpn_key</span>
                    <span>FIDO2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDialog('cli')}
                    className="h-9 flex items-center justify-center gap-1.5 border rounded-[8px] text-[12px] font-medium transition-colors hover:border-[#2563EB]"
                    style={{
                      backgroundColor: isDark ? '#060A12' : '#F8FAFC',
                      borderColor: isDark ? '#1E293B' : '#E2E8F0',
                      color: isDark ? '#CBD5E1' : '#334155',
                    }}
                  >
                    <span className="material-symbols-outlined text-[15px]">terminal</span>
                    <span>CLI</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* z-index 3: Single Clean Edge-Aligned Footer */}
      <footer className="relative z-[3] w-full px-6 sm:px-8 pb-5 pt-2 flex items-center justify-between text-[11px] select-none">
        <button
          type="button"
          onClick={() => pingHealth(true)}
          title="Click to ping /api/health"
          className="inline-flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded px-1 -ml-1"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block ${
              healthState.status === 'ok'
                ? 'bg-emerald-500'
                : healthState.status === 'checking'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
            }`}
          />
          <span
            className="typo-mono-data text-[11px] uppercase tracking-wider group-hover:underline"
            style={{ color: isDark ? '#94A3B8' : '#475569' }}
          >
            {healthState.status === 'ok'
              ? 'NODE A • STATUS_OK'
              : healthState.status === 'checking'
                ? 'NODE A • PROBING'
                : 'NODE A • DEGRADED'}
          </span>
        </button>

        <button
          type="button"
          onClick={cycleClockMode}
          title="Click to cycle UTC / Local / Julian Date"
          className="typo-mono-data text-[11px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded px-1 -mr-1"
          style={{ color: isDark ? '#94A3B8' : '#475569' }}
        >
          {clockMode === 'JD' ? clockText : `${clockMode} ${clockText}`}
        </button>
      </footer>

      <AuthDialogs
        openDialog={openDialog}
        onClose={() => setOpenDialog(null)}
        onCopy={handleCopy}
        diagnosticsText={diagnosticsText}
      />

      <LoginToast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  )
}
