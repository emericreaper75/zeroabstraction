'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface ObservatoryHeroProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onNotify: (text: string, tone?: 'info' | 'success' | 'warning') => void
}

type ClockMode = 'UTC' | 'LOCAL' | 'JD'

function computeJulianDate(date: Date): string {
  const jd = date.getTime() / 86400000 + 2440587.5
  return jd.toFixed(4)
}

export function ObservatoryHero({ theme, onToggleTheme, onNotify }: ObservatoryHeroProps) {
  const [clockMode, setClockMode] = useState<ClockMode>('UTC')
  const [clockText, setClockText] = useState('----.--.-- --:--:--')
  const [healthState, setHealthState] = useState<{
    status: 'checking' | 'ok' | 'degraded'
    latencyMs: number | null
  }>({ status: 'checking', latencyMs: null })

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

  const pingHealth = useCallback(
    async (manual = false) => {
      setHealthState((prev) => ({ ...prev, status: 'checking' }))
      const start = performance.now()
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        const elapsed = Math.round(performance.now() - start)
        if (res.ok) {
          setHealthState({ status: 'ok', latencyMs: elapsed })
          if (manual) onNotify(`Node α operational (${elapsed} ms)`, 'success')
        } else {
          setHealthState({ status: 'degraded', latencyMs: elapsed })
          if (manual) onNotify(`Node α returned HTTP ${res.status}`, 'warning')
        }
      } catch {
        setHealthState({ status: 'degraded', latencyMs: null })
        if (manual) onNotify('Health check unreachable', 'warning')
      }
    },
    [onNotify],
  )

  useEffect(() => {
    pingHealth(false)
  }, [pingHealth])

  const cycleClockMode = () => {
    const order: ClockMode[] = ['UTC', 'LOCAL', 'JD']
    const next = order[(order.indexOf(clockMode) + 1) % order.length]
    setClockMode(next)
  }

  return (
    <section
      aria-label="Observatory overview"
      className="relative w-full lg:w-[56%] flex flex-col justify-between p-5 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--admin-hairline-rule)]/70"
    >
      {/* Top Brand & Controls */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[var(--admin-primary)] shrink-0" />
          <span
            className="font-semibold tracking-tight text-[15px] text-[var(--admin-ink-primary)]"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
          >
            ZeroAbstraction
          </span>
          <span className="text-[var(--admin-ink-muted)] text-xs hidden sm:inline">/</span>
          <span className="typo-mono-data text-[11px] uppercase tracking-wider hidden sm:inline">
            Atelier
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="typo-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/85 backdrop-blur-sm text-[var(--admin-ink-secondary)] hover:text-[var(--admin-ink-primary)] hover:border-[var(--admin-primary)] transition-colors text-[12px]"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span className="hidden sm:inline">Public Site</span>
          </Link>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/85 backdrop-blur-sm text-[var(--admin-ink-secondary)] hover:text-[var(--admin-ink-primary)] hover:border-[var(--admin-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
          >
            <span className="material-symbols-outlined text-[17px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Center Balanced Editorial Identity */}
      <div className="relative z-10 my-auto py-8 lg:py-12 max-w-lg">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-[14px] border border-[var(--admin-hairline-rule)] flex items-center justify-center bg-[var(--admin-paper-surface)]/90 backdrop-blur-sm shadow-sm">
            <span className="material-symbols-outlined text-[var(--admin-primary)] text-[22px]">flare</span>
          </div>
          <span className="typo-pill px-2.5 py-1 rounded-full border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm text-[var(--admin-primary)] text-[10.5px]">
            Observatory Console
          </span>
        </div>

        <h1
          className="text-[var(--admin-ink-primary)] !text-[30px] sm:!text-[38px] !leading-[1.12] !tracking-[-0.025em] !font-semibold"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
        >
          Manoj Amavasya
        </h1>

        <p className="text-[var(--admin-ink-secondary)] text-[15px] sm:text-[16px] font-medium mt-2 tracking-[-0.01em]">
          Astronomical Atelier &amp; Research Archive
        </p>

        <p className="text-[var(--admin-ink-muted)] text-[13.5px] leading-relaxed mt-3 max-w-md">
          Observational telemetry, deep-field surveys, and digital manuscript curation at cosmic resolution.
        </p>

        {/* Compact 3-Item Highlight Strip */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5 mt-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm typo-mono-data text-[11px] !text-[var(--admin-ink-secondary)]">
            <span className="material-symbols-outlined text-[14px] text-[var(--admin-primary)]">verified_user</span>
            TLS 1.3 Encrypted
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm typo-mono-data text-[11px] !text-[var(--admin-ink-secondary)]">
            <span className="material-symbols-outlined text-[14px] text-[var(--admin-primary)]">database</span>
            Payload v3.88
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm typo-mono-data text-[11px] !text-[var(--admin-ink-secondary)]">
            <span className="material-symbols-outlined text-[14px] text-[var(--admin-primary)]">all_inclusive</span>
            Epoch 2026.3
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-t border-[var(--admin-hairline-rule)]/70 pt-3.5">
        <button
          type="button"
          onClick={() => pingHealth(true)}
          title="Click to ping /api/health"
          className="inline-flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] rounded-md px-1 -ml-1"
        >
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              healthState.status === 'ok'
                ? 'bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                : healthState.status === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
            }`}
          />
          <span className="typo-mono-data text-[11px] uppercase tracking-wider !text-[var(--admin-ink-secondary)] group-hover:underline">
            {healthState.status === 'ok'
              ? `Node α // Operational · ${healthState.latencyMs ?? 0}ms`
              : healthState.status === 'checking'
                ? 'Node α // Probing...'
                : 'Node α // Degraded'}
          </span>
        </button>

        <button
          type="button"
          onClick={cycleClockMode}
          title="Click to cycle UTC / Local / Julian Date"
          className="typo-mono-data text-[11px] tabular-nums px-2.5 py-0.5 rounded-[8px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/85 backdrop-blur-sm hover:border-[var(--admin-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
        >
          {clockMode === 'JD' ? clockText : `${clockMode} ${clockText}`}
        </button>
      </div>
    </section>
  )
}
