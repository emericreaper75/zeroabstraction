'use client'

import React from 'react'

interface ObservatoryBackdropProps {
  theme: 'light' | 'dark'
}

const STARS = [
  { cx: 7, cy: 14, r: 0.28, delay: '0s', accent: false },
  { cx: 15, cy: 31, r: 0.22, delay: '1.1s', accent: true },
  { cx: 24, cy: 18, r: 0.34, delay: '2.0s', accent: false },
  { cx: 33, cy: 67, r: 0.24, delay: '0.6s', accent: false },
  { cx: 41, cy: 25, r: 0.3, delay: '2.8s', accent: true },
  { cx: 50, cy: 82, r: 0.25, delay: '1.7s', accent: false },
  { cx: 58, cy: 12, r: 0.32, delay: '2.5s', accent: false },
  { cx: 66, cy: 43, r: 0.22, delay: '0.4s', accent: true },
  { cx: 74, cy: 76, r: 0.32, delay: '3.2s', accent: false },
  { cx: 83, cy: 22, r: 0.26, delay: '1.4s', accent: false },
  { cx: 91, cy: 57, r: 0.3, delay: '2.9s', accent: true },
  { cx: 18, cy: 86, r: 0.24, delay: '3.8s', accent: false },
  { cx: 47, cy: 51, r: 0.22, delay: '0.9s', accent: false },
  { cx: 88, cy: 87, r: 0.28, delay: '2.2s', accent: true },
]

export function ObservatoryBackdrop({ theme }: ObservatoryBackdropProps) {
  const isDark = theme === 'dark'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Unified Dual-Theme Cosmic Grid */}
      <div className="absolute inset-0 cosmic-grid opacity-90" />

      {/* Right-to-Left Directional Gradient — distinguishes the Login Window from the Hero */}
      <div
        className="auth-gradient-sweep absolute inset-y-0 right-0 w-full"
        style={{
          background: isDark
            ? 'linear-gradient(to left, rgba(30, 58, 138, 0.44) 0%, rgba(49, 46, 129, 0.24) 36%, rgba(15, 23, 42, 0.08) 62%, transparent 86%)'
            : 'linear-gradient(to left, rgba(191, 219, 254, 0.72) 0%, rgba(224, 231, 255, 0.42) 36%, rgba(241, 245, 249, 0.12) 62%, transparent 86%)',
        }}
      />

      {/* Drifting Ambient Celestial Aurora Orbs — calibrated per theme */}
      <div
        className="auth-drift-a absolute -top-[16%] -left-[8%] w-[56vw] h-[56vw] max-w-[700px] max-h-[700px] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(99,102,241,0.10) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.16) 0%, rgba(99,102,241,0.08) 45%, transparent 72%)',
        }}
      />
      <div
        className="auth-drift-b absolute -bottom-[18%] -right-[8%] w-[54vw] h-[54vw] max-w-[660px] max-h-[660px] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(52,211,153,0.22) 0%, rgba(59,130,246,0.08) 45%, transparent 72%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(37,99,235,0.07) 45%, transparent 72%)',
        }}
      />
      <div
        className="auth-drift-a absolute top-[32%] left-[38%] w-[36vw] h-[36vw] max-w-[440px] max-h-[440px] rounded-full blur-3xl"
        style={{
          animationDelay: '-9s',
          background: isDark
            ? 'radial-gradient(circle, rgba(129,140,248,0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14,165,233,0.11) 0%, transparent 70%)',
        }}
      />

      {/* Full-Viewport Constellation & Twinkling Starfield */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g
          stroke={isDark ? 'rgba(147,197,253,0.20)' : 'rgba(37,99,235,0.16)'}
          strokeWidth="0.11"
          fill="none"
        >
          <polyline points="7,14 24,18 41,25 58,12 83,22" />
          <polyline points="15,31 33,67 50,82 74,76 91,57" />
          <polyline points="41,25 47,51 66,43 83,22" />
        </g>
        {STARS.map((star, idx) => (
          <circle
            key={idx}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill={
              isDark
                ? star.accent
                  ? '#34D399'
                  : '#93C5FD'
                : star.accent
                  ? '#059669'
                  : '#2563EB'
            }
            className="auth-twinkle"
            style={{ animationDelay: star.delay }}
          />
        ))}
      </svg>

      {/* Centered Multi-Ring Orbital Astrolabe */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          isDark ? 'opacity-40' : 'opacity-45'
        }`}
      >
        {/* Outer Dashed Ring */}
        <svg viewBox="0 0 400 400" className="w-[min(94vw,800px)] h-[min(94vw,800px)] auth-orbit-slow">
          <circle
            cx="200"
            cy="200"
            r="192"
            fill="none"
            stroke={isDark ? 'rgba(148,163,184,0.35)' : 'rgba(71,85,105,0.28)'}
            strokeWidth="0.75"
            strokeDasharray="4 7"
          />
          <circle
            cx="200"
            cy="8"
            r="3"
            fill={isDark ? '#60A5FA' : '#2563EB'}
          />
        </svg>

        {/* Middle Precision Ring */}
        <svg viewBox="0 0 400 400" className="w-[min(70vw,580px)] h-[min(70vw,580px)] absolute auth-orbit-reverse">
          <circle
            cx="200"
            cy="200"
            r="186"
            fill="none"
            stroke={isDark ? 'rgba(96,165,250,0.42)' : 'rgba(37,99,235,0.30)'}
            strokeWidth="0.85"
            strokeDasharray="2 6"
          />
          <circle
            cx="386"
            cy="200"
            r="2.6"
            fill={isDark ? '#34D399' : '#059669'}
          />
        </svg>

        {/* Inner Subtle Pulse Ring */}
        <svg viewBox="0 0 400 400" className="w-[min(46vw,380px)] h-[min(46vw,380px)] absolute auth-orbit-slow" style={{ animationDuration: '48s' }}>
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke={isDark ? 'rgba(52,211,153,0.28)' : 'rgba(16,185,129,0.22)'}
            strokeWidth="0.75"
            strokeDasharray="1 9"
          />
          <circle
            cx="20"
            cy="200"
            r="2.2"
            fill={isDark ? '#A5B4FC' : '#4F46E5'}
          />
        </svg>
      </div>
    </div>
  )
}
