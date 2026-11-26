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

function getPasswordStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 6) score += 1
  if (pw.length >= 10) score += 1
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[Math.max(0, score - 1)] || 'Weak' }
}

export default function LoginPage() {
  const router = useRouter()

  // Theme state synced with Admin Atelier
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberIdentity, setRememberIdentity] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)

  // Submission & status state
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [shakeCard, setShakeCard] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [activeUserEmail, setActiveUserEmail] = useState<string | null>(null)

  // Dialogs & toasts
  const [openDialog, setOpenDialog] = useState<AuthDialogKind>(null)
  const [toasts, setToasts] = useState<LoginToastMessage[]>([])

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const toastIdRef = useRef(0)

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
      document.documentElement.className = next
      document.documentElement.style.colorScheme = next
      const meta = document.querySelector('meta[name="color-scheme"]')
      if (meta) meta.setAttribute('content', next)
    }
  }, [])

  // Initialize theme, remembered email, online listener & active session check
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
      // Ignore storage errors in restricted environments
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

    // Non-blocking check if an observer session is already active
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
  }, [applyTheme])

  // Global keyboard shortcuts (? for help, Esc to clear error)
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
    } catch {
      // Ignore storage errors
    }
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
  const strength = getPasswordStrength(password)

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
        } catch {
          // Ignore storage errors
        }
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
Timestamp: ${new Date().toISOString()}
UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`

  return (
    <>
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:rounded-[10px] focus:bg-[var(--admin-primary)] focus:text-[var(--admin-on-primary)] focus:text-xs focus:font-medium"
      >
        Skip to sign in form
      </a>

      {/* Full-Page Unified Animated Backdrop */}
      <ObservatoryBackdrop theme={theme} />

      {/* Main Split-Pane Login Workspace */}
      <main className="w-full flex-grow flex flex-col lg:flex-row min-h-[calc(100dvh-2rem)] relative z-10">
        <ObservatoryHero
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onNotify={notify}
        />

        {/* RIGHT AUTH PANE (~44%) — Panze Studio Card */}
        <section
          aria-label="Sign in"
          className="w-full lg:w-[44%] flex items-center justify-center p-5 sm:p-8 lg:p-12 relative z-10"
        >
          {/* Credential Card */}
          <div
            className={`w-full max-w-md bg-[var(--admin-paper-surface)]/92 backdrop-blur-md text-[var(--admin-ink-primary)] border border-[var(--admin-hairline-rule)] p-6 sm:p-8 relative rounded-[20px] transition-shadow ${
              theme === 'dark'
                ? 'shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)]'
                : 'shadow-[0_20px_50px_-15px_rgba(15,23,42,0.10)]'
            } ${shakeCard ? 'auth-shake' : ''}`}
          >
            {/* Precision Registration Ticks */}
            <div aria-hidden="true" className="absolute top-3 left-3 w-2 h-2 border-t border-l border-[var(--admin-primary)] opacity-50 rounded-tl-[2px]" />
            <div aria-hidden="true" className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[var(--admin-primary)] opacity-50 rounded-tr-[2px]" />
            <div aria-hidden="true" className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[var(--admin-primary)] opacity-50 rounded-bl-[2px]" />
            <div aria-hidden="true" className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-[var(--admin-primary)] opacity-50 rounded-br-[2px]" />

            {/* Card Header */}
            <div className="mb-5 flex items-center justify-between border-b border-[var(--admin-hairline-rule)] pb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--admin-primary)] inline-block" />
                <span className="typo-mono-data text-[11px] uppercase tracking-[0.12em] !text-[var(--admin-ink-secondary)]">
                  Observatory Access
                </span>
              </div>
              <span className="typo-pill text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--admin-amber-wash)] border border-[var(--admin-hairline-rule)] text-[var(--admin-primary)]">
                SECURE_NODE
              </span>
            </div>

            {/* Active Session Banner */}
            {activeUserEmail && (
              <div className="mb-5 p-3 rounded-[12px] border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Active session detected
                  </div>
                  <div className="typo-mono-data text-[11px] truncate !text-[var(--admin-ink-secondary)]">
                    {activeUserEmail}
                  </div>
                </div>
                <Link
                  href="/admin"
                  className="typo-btn shrink-0 px-3 py-1.5 rounded-[10px] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-[12px]"
                >
                  Continue →
                </Link>
              </div>
            )}

            {/* Offline Warning */}
            {!isOnline && (
              <div
                role="status"
                className="mb-4 p-3 rounded-[12px] border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[12.5px] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">wifi_off</span>
                <span>Offline — network connection required to authenticate.</span>
              </div>
            )}

            {/* Title */}
            <div className="mb-6">
              <h2
                className="text-[22px] leading-[28px] font-semibold tracking-[-0.02em] text-[var(--admin-ink-primary)]"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
              >
                Sign In
              </h2>
              <p className="typo-subtitle mt-1 !text-[var(--admin-ink-muted)]">
                Authenticate into the Atelier observational console
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 p-3 rounded-[12px] bg-[var(--admin-error-container)] border border-[var(--admin-error)]/40 text-[var(--admin-error)] text-[12.5px] flex items-start justify-between gap-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[17px] shrink-0 mt-0.5">error</span>
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError('')}
                  aria-label="Dismiss error"
                  className="shrink-0 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form id="login-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="typo-label !text-[var(--admin-ink-secondary)]" htmlFor="identity-input">
                    Observer Identity
                  </label>
                  {emailInvalid && (
                    <span id="email-error" className="text-[11px] font-medium text-[var(--admin-error)]">
                      Invalid email format
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)] text-[18px] pointer-events-none">
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
                    className={`w-full bg-[var(--admin-paper-base)] border text-[var(--admin-ink-primary)] text-[14px] pl-10 pr-9 py-2.5 rounded-[12px] transition-colors placeholder:text-[var(--admin-ink-muted)]/60 focus:outline-none focus:ring-2 ${
                      emailInvalid
                        ? 'border-[var(--admin-error)] focus:ring-[var(--admin-error)]/30'
                        : 'border-[var(--admin-hairline-rule)] hover:border-[var(--admin-border-strong)] focus:border-[var(--admin-primary)] focus:ring-[var(--admin-primary)]/20'
                    }`}
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)] hover:text-[var(--admin-ink-primary)] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="typo-label !text-[var(--admin-ink-secondary)]" htmlFor="token-input">
                    Access Key
                  </label>
                  {capsLockOn && (
                    <span className="typo-mono-data text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      CAPS LOCK ON
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)] text-[18px] pointer-events-none">
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
                    className="w-full bg-[var(--admin-paper-base)] border border-[var(--admin-hairline-rule)] hover:border-[var(--admin-border-strong)] text-[var(--admin-ink-primary)] text-[14px] pl-10 pr-10 py-2.5 rounded-[12px] transition-colors placeholder:text-[var(--admin-ink-muted)]/60 font-mono tracking-wider focus:outline-none focus:border-[var(--admin-primary)] focus:ring-2 focus:ring-[var(--admin-primary)]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide access key' : 'Show access key'}
                    aria-pressed={showPassword}
                    title={showPassword ? 'Hide access key' : 'Show access key'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)] hover:text-[var(--admin-primary)] transition-colors focus-visible:outline-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Subtle Key Entropy Indicator */}
                {password.length > 0 && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="grid grid-cols-4 gap-1 flex-1" aria-hidden="true">
                      {[1, 2, 3, 4].map((seg) => (
                        <div
                          key={seg}
                          className={`h-1 rounded-full transition-colors ${
                            seg <= strength.score
                              ? strength.score >= 3
                                ? 'bg-emerald-500'
                                : strength.score === 2
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              : 'bg-[var(--admin-hairline-rule)]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="typo-mono-data text-[10px] tabular-nums">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1 text-[13px]">
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
                  <span className="text-[var(--admin-ink-secondary)]">Remember identity</span>
                </label>

                <button
                  type="button"
                  onClick={() => setOpenDialog('forgot')}
                  className="text-[var(--admin-primary)] hover:underline underline-offset-4 font-medium text-[12.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded"
                >
                  Forgot access?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess || !isOnline}
                  aria-busy={isLoading}
                  className={`w-full font-medium text-[13.5px] py-3 px-4 rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] disabled:opacity-60 ${
                    isSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--admin-primary)] text-[var(--admin-on-primary)] hover:opacity-92 active:translate-y-px'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Access Granted — Entering Atelier...</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
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
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate</span>
                      <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              {/* Alternative Auth Methods */}
              <div className="pt-4 border-t border-[var(--admin-hairline-rule)]">
                <div className="text-center mb-3">
                  <span className="typo-mono-data text-[10.5px] uppercase tracking-wider">
                    Alternative Authorization
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenDialog('biometrics')}
                    className="h-10 flex items-center justify-center gap-1.5 border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-base)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)] text-[var(--admin-ink-secondary)] transition-colors rounded-[10px] text-[12px] font-medium"
                    title="Biometric Passkey"
                  >
                    <span className="material-symbols-outlined text-[17px]">fingerprint</span>
                    <span className="hidden sm:inline">Passkey</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDialog('hardware')}
                    className="h-10 flex items-center justify-center gap-1.5 border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-base)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)] text-[var(--admin-ink-secondary)] transition-colors rounded-[10px] text-[12px] font-medium"
                    title="Hardware Security Key"
                  >
                    <span className="material-symbols-outlined text-[17px]">vpn_key</span>
                    <span className="hidden sm:inline">FIDO2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDialog('cli')}
                    className="h-10 flex items-center justify-center gap-1.5 border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-base)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)] text-[var(--admin-ink-secondary)] transition-colors rounded-[10px] text-[12px] font-medium"
                    title="Terminal CLI"
                  >
                    <span className="material-symbols-outlined text-[17px]">terminal</span>
                    <span className="hidden sm:inline">CLI</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Status Bar Footer */}
      <footer className="relative z-30 bg-[var(--admin-paper-surface)]/85 backdrop-blur-sm border-t border-[var(--admin-hairline-rule)] flex justify-between items-center w-full px-4 sm:px-6 h-8 text-[var(--admin-ink-muted)] select-none">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="typo-mono-data text-[11px] tracking-wider">
            ZEROABSTRACTION // OBSERVATORY NODE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="typo-mono-data text-[11px] hidden sm:inline">
            {isOnline ? 'LINK: ONLINE' : 'LINK: OFFLINE'}
          </span>
          <button
            type="button"
            onClick={() => setOpenDialog('shortcuts')}
            aria-label="Keyboard shortcuts and node diagnostics"
            title="Keyboard shortcuts & diagnostics (?)"
            className="typo-mono-data text-[11px] px-2 py-0.5 rounded-[6px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-base)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-ink-primary)] transition-colors"
          >
            ?
          </button>
        </div>
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
    </>
  )
}
