'use client'

import React from 'react'

interface ObservatoryBackdropProps {
  theme: 'light' | 'dark'
}

const STARS = [
  { cx: 8, cy: 14, r: 0.24, delay: '0s' },
  { cx: 16, cy: 32, r: 0.18, delay: '1.2s' },
  { cx: 25, cy: 19, r: 0.28, delay: '2.1s' },
  { cx: 34, cy: 68, r: 0.2, delay: '0.7s' },
  { cx: 42, cy: 26, r: 0.25, delay: '3.0s' },
  { cx: 51, cy: 82, r: 0.22, delay: '1.8s' },
  { cx: 59, cy: 12, r: 0.26, delay: '2.6s' },
  { cx: 67, cy: 44, r: 0.19, delay: '0.4s' },
  { cx: 74, cy: 76, r: 0.27, delay: '3.5s' },
  { cx: 83, cy: 22, r: 0.22, delay: '1.5s' },
  { cx: 91, cy: 58, r: 0.25, delay: '2.9s' },
  { cx: 19, cy: 86, r: 0.21, delay: '4.1s' },
  { cx: 48, cy: 52, r: 0.18, delay: '0.9s' },
  { cx: 88, cy: 88, r: 0.23, delay: '2.2s' },
]

export function ObservatoryBackdrop({ theme }: ObservatoryBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Unified Cosmic Grid across entire page */}
      <div className="absolute inset-0 cosmic-grid opacity-75" />

      {/* Drifting Ambient Celestial Aurora Orbs */}
      <div
        className="auth-drift-a absolute -top-[18%] -left-[10%] w-[55vw] h-[55vw] max-w-[680px] max-h-[680px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(circle, rgba(96,165,250,0.34) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="auth-drift-b absolute -bottom-[22%] -right-[10%] w-[52vw] h-[52vw] max-w-[640px] max-h-[640px] rounded-full blur-3xl opacity-25"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(circle, rgba(52,211,153,0.24) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Full-Viewport Subtle Constellation & Twinkling Stars */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g
          stroke={theme === 'dark' ? 'rgba(96,165,250,0.12)' : 'rgba(15,23,42,0.06)'}
          strokeWidth="0.1"
          fill="none"
        >
          <polyline points="8,14 25,19 42,26 59,12 83,22" />
          <polyline points="16,32 34,68 51,82 74,76 91,58" />
        </g>
        {STARS.map((star, idx) => (
          <circle
            key={idx}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill={theme === 'dark' ? '#93C5FD' : '#0F172A'}
            className="auth-twinkle"
            style={{ animationDelay: star.delay }}
          />
        ))}
      </svg>

      {/* Centered Full-Page Orbital Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg viewBox="0 0 400 400" className="w-[min(92vw,760px)] h-[min(92vw,760px)] auth-orbit-slow">
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="4 8"
            className="text-[var(--admin-ink-muted)]"
          />
          <circle cx="200" cy="10" r="2.5" className="fill-[var(--admin-primary)]" />
        </svg>
        <svg viewBox="0 0 400 400" className="w-[min(66vw,540px)] h-[min(66vw,540px)] absolute auth-orbit-reverse">
          <circle
            cx="200"
            cy="200"
            r="185"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1.5 6"
            className="text-[var(--admin-primary)]"
          />
          <circle cx="385" cy="200" r="2" className="fill-emerald-500" />
        </svg>
      </div>
    </div>
  )
}
