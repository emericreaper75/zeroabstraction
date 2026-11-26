'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface ObservatoryHeroProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onNotify: (text: string, tone?: 'info' | 'success' | 'warning') => void
}

type ClockMode = 'UTC' | 'LOCAL' | 'JD'

interface CapabilityDetail {
  id: string
  icon: string
  label: string
  code: string
  metric: string
  summary: string
}

const CAPABILITIES: CapabilityDetail[] = [
  {
    id: 'optics',
    icon: 'telescope',
    label: 'Observatory Optics',
    code: 'OPT-01',
    metric: '0.04″ ARC',
    summary: 'Deep-field gravitational survey index & high-resolution plate curation.',
  },
  {
    id: 'crypto',
    icon: 'key',
    label: 'Cryptographic Access',
    code: 'SEC-02',
    metric: 'JWT / HTTPOnly',
    summary: 'Signed session cookies with Payload RBAC and edge middleware verification.',
  },
  {
    id: 'terminal',
    icon: 'terminal',
    label: 'Terminal Node',
    code: 'CLI-03',
    metric: 'REST + GQL',
    summary: 'Direct editorial API endpoints and automated schema migration pipeline.',
  },
  {
    id: 'spectrum',
    icon: 'blur_on',
    label: 'Spectroscopy Matrix',
    code: 'SPC-04',
    metric: 'λ 380–750nm',
    summary: 'Dual-spectrum Light Canvas & Zinc Dark calibrated visual workspace.',
  },
]

const FIELD_NOTES = [
  {
    id: 'note-1',
    tag: 'FIELD NOTE 01',
    text: 'Every abstraction has a cost; the observatory measures what remains when noise is stripped away.',
  },
  {
    id: 'note-2',
    tag: 'FIELD NOTE 02',
    text: 'Calibrated for long-form theoretical physics, electrical engineering rigs, and deep-sky telemetry.',
  },
  {
    id: 'note-3',
    tag: 'FIELD NOTE 03',
    text: 'Draft manuscripts, project schematics, and archival plates synchronize directly to the live edge.',
  },
]

const STAR_COORDS = [
  { cx: 12, cy: 18, r: 1.3, o: 0.55 },
  { cx: 24, cy: 11, r: 0.9, o: 0.35 },
  { cx: 38, cy: 22, r: 1.5, o: 0.65 },
  { cx: 52, cy: 14, r: 1.0, o: 0.4 },
  { cx: 68, cy: 26, r: 1.4, o: 0.6 },
  { cx: 81, cy: 15, r: 1.1, o: 0.45 },
  { cx: 89, cy: 32, r: 1.6, o: 0.5 },
  { cx: 18, cy: 48, r: 1.0, o: 0.35 },
  { cx: 31, cy: 62, r: 1.3, o: 0.5 },
  { cx: 74, cy: 58, r: 1.2, o: 0.45 },
  { cx: 86, cy: 74, r: 1.5, o: 0.55 },
  { cx: 61, cy: 82, r: 1.0, o: 0.4 },
  { cx: 22, cy: 84, r: 1.4, o: 0.5 },
  { cx: 44, cy: 76, r: 0.9, o: 0.3 },
]

function computeJulianDate(date: Date): string {
  const jd = date.getTime() / 86400000 + 2440587.5
  return jd.toFixed(5)
}

export function ObservatoryHero({ theme, onToggleTheme, onNotify }: ObservatoryHeroProps) {
  const [clockMode, setClockMode] = useState<ClockMode>('UTC')
  const [clockText, setClockText] = useState('----.--.-- --:--:--')
  const [activeCapability, setActiveCapability] = useState<string>('optics')
  const [noteIndex, setNoteIndex] = useState(0)
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

  const pingHealth = useCallback(async (manual = false) => {
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
  }, [onNotify])

  useEffect(() => {
    pingHealth(false)
  }, [pingHealth])

  const cycleClockMode = () => {
    const order: ClockMode[] = ['UTC', 'LOCAL', 'JD']
    const next = order[(order.indexOf(clockMode) + 1) % order.length]
    setClockMode(next)
  }

  const selectedCapability = CAPABILITIES.find((c) => c.id === activeCapability) ?? CAPABILITIES[0]
  const currentNote = FIELD_NOTES[noteIndex]

  return (
    <section
      aria-label="Observatory overview"
      className="relative w-full lg:w-[58%] flex flex-col justify-between p-5 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--admin-hairline-rule)] overflow-hidden bg-[var(--admin-paper-base)]"
    >
      {/* Background: Cosmic Grid + Ambient Radial Spotlight + Celestial SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute inset-0 cosmic-grid opacity-80" />
        <div
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(circle, rgba(96,165,250,0.32) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(15,23,42,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-28 right-0 w-[380px] h-[380px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)',
          }}
        />

        {/* SVG Starfield & Constellation */}
        <svg
          className="absolute inset-0 w-full h-full hidden sm:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <g
            stroke={theme === 'dark' ? 'rgba(96,165,250,0.14)' : 'rgba(15,23,42,0.08)'}
            strokeWidth="0.14"
            fill="none"
          >
            <polyline points="12,18 24,11 38,22 52,14 68,26 81,15" />
            <polyline points="68,26 89,32 74,58 86,74" />
            <polyline points="18,48 31,62 44,76 61,82" />
          </g>
          {STAR_COORDS.map((star, idx) => (
            <circle
              key={idx}
              cx={star.cx}
              cy={star.cy}
              r={star.r * 0.22}
              fill={theme === 'dark' ? '#93C5FD' : '#0F172A'}
              opacity={theme === 'dark' ? star.o : star.o * 0.35}
            />
          ))}
        </svg>

        {/* Orbital Astrolabe Reticle */}
        <div className="hidden lg:flex items-center justify-center absolute right-[-110px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] opacity-25">
          <svg viewBox="0 0 200 200" className="w-full h-full auth-orbit-slow">
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="3 5"
              className="text-[var(--admin-ink-muted)]"
            />
            <circle cx="100" cy="8" r="2.2" className="fill-[var(--admin-primary)]" />
          </svg>
          <svg viewBox="0 0 200 200" className="w-[74%] h-[74%] absolute auth-orbit-reverse">
            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="1 4"
              className="text-[var(--admin-primary)]"
            />
            <circle cx="186" cy="100" r="2" className="fill-emerald-500" />
          </svg>
        </div>
      </div>

      {/* Top Branding, Breadcrumb & Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--admin-hairline-rule)] pb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[var(--admin-primary)] shrink-0" />
          <span className="font-semibold tracking-tight text-[15px] text-[var(--admin-ink-primary)]" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            ZeroAbstraction
          </span>
          <span className="text-[var(--admin-ink-muted)] text-xs hidden sm:inline">/</span>
          <span className="typo-mono-data text-[11px] uppercase tracking-wider hidden sm:inline">
            Observatory
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="typo-pill px-2.5 py-1 rounded-full border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] text-[var(--admin-ink-secondary)] hidden md:inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[var(--admin-primary)]">all_inclusive</span>
            EPOCH 2026.3
          </span>

          <Link
            href="/"
            className="typo-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] text-[var(--admin-ink-secondary)] hover:text-[var(--admin-ink-primary)] hover:border-[var(--admin-primary)] transition-colors text-[12px]"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span className="hidden sm:inline">Public Site</span>
          </Link>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] text-[var(--admin-ink-secondary)] hover:text-[var(--admin-ink-primary)] hover:border-[var(--admin-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
          >
            <span className="material-symbols-outlined text-[17px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Center Narrative & Interactive Observatory Specs */}
      <div className="relative z-10 my-auto py-6 lg:py-10 max-w-2xl">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-[14px] border border-[var(--admin-hairline-rule)] flex items-center justify-center bg-[var(--admin-paper-surface)] shadow-sm">
            <span className="material-symbols-outlined text-[var(--admin-primary)] text-[22px]">flare</span>
          </div>
          <div className="flex flex-col">
            <span className="typo-pill text-[11px] text-[var(--admin-primary)]">Editorial &amp; Telemetry Console</span>
            <span className="typo-mono-data text-[11px]">Payload CMS Node · Admin Atelier</span>
          </div>
        </div>

        <h1
          className="text-[var(--admin-ink-primary)] !text-[28px] sm:!text-[34px] !leading-[1.15] !tracking-[-0.025em] !font-semibold"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
        >
          Manoj Amavasya
        </h1>
        <p className="text-[var(--admin-ink-secondary)] text-[15px] sm:text-[16px] font-medium mt-1.5 tracking-[-0.01em]">
          Astronomical Atelier &amp; Research Archive
        </p>
        <p className="text-[var(--admin-ink-muted)] text-[13.5px] leading-relaxed max-w-lg mt-3">
          Observational telemetry, deep-field gravitational surveys, and digital manuscript curation at the edge of cosmic resolution.
        </p>

        {/* 3-Column Spec Strip (Desktop/Tablet) */}
        <div className="hidden sm:grid grid-cols-3 gap-3 mt-6 max-w-lg">
          <div className="rounded-[12px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm px-3.5 py-2.5">
            <div className="typo-mono-data text-[10px] uppercase tracking-wider">Transport</div>
            <div className="typo-mono-data !text-[var(--admin-ink-primary)] font-medium text-[12px] mt-0.5 tabular-nums">
              TLS 1.3 · E2E
            </div>
          </div>
          <div className="rounded-[12px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm px-3.5 py-2.5">
            <div className="typo-mono-data text-[10px] uppercase tracking-wider">Engine</div>
            <div className="typo-mono-data !text-[var(--admin-ink-primary)] font-medium text-[12px] mt-0.5 tabular-nums">
              Payload v3.88
            </div>
          </div>
          <div className="rounded-[12px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/80 backdrop-blur-sm px-3.5 py-2.5">
            <div className="typo-mono-data text-[10px] uppercase tracking-wider">Spectrum</div>
            <div className="typo-mono-data !text-[var(--admin-ink-primary)] font-medium text-[12px] mt-0.5">
              {theme === 'dark' ? 'Zinc Dark' : 'Light Canvas'}
            </div>
          </div>
        </div>

        {/* Interactive Observatory Optics Pills */}
        <div className="hidden md:block mt-6 max-w-lg">
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Observatory subsystems">
            {CAPABILITIES.map((cap) => {
              const isSelected = cap.id === activeCapability
              return (
                <button
                  key={cap.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCapability(cap.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border text-[12px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] ${
                    isSelected
                      ? 'border-[var(--admin-primary)] bg-[var(--admin-amber-wash)] text-[var(--admin-ink-primary)] shadow-sm'
                      : 'border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/70 text-[var(--admin-ink-secondary)] hover:text-[var(--admin-ink-primary)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{cap.icon}</span>
                  <span>{cap.label}</span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            className="mt-2.5 rounded-[12px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/90 backdrop-blur-sm px-4 py-3 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="typo-pill text-[10px] text-[var(--admin-primary)]">{selectedCapability.code}</span>
                <span className="text-[12.5px] font-semibold text-[var(--admin-ink-primary)]">
                  {selectedCapability.label}
                </span>
              </div>
              <p className="text-[12px] text-[var(--admin-ink-muted)] mt-1 leading-relaxed">
                {selectedCapability.summary}
              </p>
            </div>
            <span className="typo-mono-data text-[11px] px-2 py-0.5 rounded bg-[var(--admin-paper-container)] border border-[var(--admin-hairline-rule)] shrink-0 tabular-nums">
              {selectedCapability.metric}
            </span>
          </div>
        </div>

        {/* Cyclable Field Note */}
        <div className="hidden lg:flex items-center justify-between gap-3 mt-5 max-w-lg px-3.5 py-2.5 rounded-[12px] border border-dashed border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)]/45">
          <div className="min-w-0">
            <span className="typo-mono-data text-[10px] uppercase tracking-wider text-[var(--admin-primary)]">
              {currentNote.tag}
            </span>
            <p className="text-[12px] text-[var(--admin-ink-secondary)] mt-0.5 leading-snug">
              {currentNote.text}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNoteIndex((i) => (i + 1) % FIELD_NOTES.length)}
            aria-label="Next field note"
            title="Cycle field note"
            className="shrink-0 w-7 h-7 rounded-[8px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] flex items-center justify-center text-[var(--admin-ink-muted)] hover:text-[var(--admin-ink-primary)] transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--admin-hairline-rule)] pt-3.5">
        <button
          type="button"
          onClick={() => pingHealth(true)}
          title="Click to re-ping /api/health"
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
          <span className="typo-mono-data text-[11px] uppercase tracking-wider !text-[var(--admin-ink-primary)] group-hover:underline">
            Node α //{' '}
            {healthState.status === 'ok'
              ? `Operational${healthState.latencyMs !== null ? ` · ${healthState.latencyMs}ms` : ''}`
              : healthState.status === 'checking'
                ? 'Probing...'
                : 'Degraded'}
          </span>
        </button>

        <button
          type="button"
          onClick={cycleClockMode}
          title="Click to cycle UTC / Local / Julian Date"
          className="typo-mono-data text-[11px] tabular-nums px-2 py-0.5 rounded-[8px] border border-[var(--admin-hairline-rule)] bg-[var(--admin-paper-surface)] hover:border-[var(--admin-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
        >
          {clockMode === 'JD' ? clockText : `${clockMode} ${clockText}`}
        </button>
      </div>
    </section>
  )
}
