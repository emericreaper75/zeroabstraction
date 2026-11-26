'use client'

import React from 'react'

interface ObservatoryBackdropProps {
  theme: 'light' | 'dark'
}

const STARS = [
  { cx: 7, cy: 14, r: 0.34, delay: '0s', accent: false },
  { cx: 15, cy: 31, r: 0.28, delay: '1.1s', accent: true },
  { cx: 24, cy: 18, r: 0.4, delay: '2.0s', accent: false },
  { cx: 33, cy: 67, r: 0.3, delay: '0.6s', accent: false },
  { cx: 41, cy: 25, r: 0.36, delay: '2.8s', accent: true },
  { cx: 50, cy: 82, r: 0.3, delay: '1.7s', accent: false },
  { cx: 58, cy: 12, r: 0.38, delay: '2.5s', accent: false },
  { cx: 66, cy: 43, r: 0.28, delay: '0.4s', accent: true },
  { cx: 74, cy: 76, r: 0.36, delay: '3.2s', accent: false },
  { cx: 83, cy: 22, r: 0.3, delay: '1.4s', accent: false },
  { cx: 91, cy: 57, r: 0.34, delay: '2.9s', accent: true },
  { cx: 18, cy: 86, r: 0.3, delay: '3.8s', accent: false },
  { cx: 47, cy: 51, r: 0.26, delay: '0.9s', accent: false },
  { cx: 88, cy: 87, r: 0.32, delay: '2.2s', accent: true },
]

export function ObservatoryBackdrop({ theme }: ObservatoryBackdropProps) {
  const isDark = theme === 'dark'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Layer 1: Full-Viewport Cosmic Grid */}
      <div className="absolute inset-0 cosmic-grid opacity-95" />

      {/* Layer 2: Drifting Ambient Celestial Aurora Orbs */}
      <div
        className="auth-drift-a absolute -top-[14%] -left-[6%] w-[58vw] h-[58vw] max-w-[720px] max-h-[720px] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(59,130,246,0.34) 0%, rgba(99,102,241,0.14) 48%, transparent 72%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(99,102,241,0.11) 48%, transparent 72%)',
        }}
      />
      <div
        className="auth-drift-b absolute -bottom-[16%] left-[12%] w-[50vw] h-[50vw] max-w-[620px] max-h-[620px] rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(52,211,153,0.24) 0%, rgba(59,130,246,0.10) 48%, transparent 72%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.20) 0%, rgba(37,99,235,0.09) 48%, transparent 72%)',
        }}
      />

      {/* Layer 3: Full-Viewport Constellation & Twinkling Starfield */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <g
          stroke={isDark ? 'rgba(147,197,253,0.26)' : 'rgba(37,99,235,0.22)'}
          strokeWidth="0.13"
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

      {/* Layer 4: Multi-Ring Orbital Astrolabe */}
      <div
        className={`absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-[8%] ${
          isDark ? 'opacity-55' : 'opacity-60'
        }`}
      >
        <svg viewBox="0 0 400 400" className="w-[min(92vw,760px)] h-[min(92vw,760px)] auth-orbit-slow">
          <circle
            cx="200"
            cy="200"
            r="192"
            fill="none"
            stroke={isDark ? 'rgba(148,163,184,0.42)' : 'rgba(71,85,105,0.34)'}
            strokeWidth="0.85"
            strokeDasharray="4 7"
          />
          <circle cx="200" cy="8" r="3.4" fill={isDark ? '#60A5FA' : '#2563EB'} />
        </svg>

        <svg viewBox="0 0 400 400" className="w-[min(68vw,560px)] h-[min(68vw,560px)] absolute lg:left-[calc(8%+100px)] auth-orbit-reverse">
          <circle
            cx="200"
            cy="200"
            r="186"
            fill="none"
            stroke={isDark ? 'rgba(96,165,250,0.50)' : 'rgba(37,99,235,0.36)'}
            strokeWidth="0.95"
            strokeDasharray="2 6"
          />
          <circle cx="386" cy="200" r="3" fill={isDark ? '#34D399' : '#059669'} />
        </svg>

        <svg
          viewBox="0 0 400 400"
          className="w-[min(44vw,360px)] h-[min(44vw,360px)] absolute lg:left-[calc(8%+200px)] auth-orbit-slow"
          style={{ animationDuration: '48s' }}
        >
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke={isDark ? 'rgba(52,211,153,0.35)' : 'rgba(16,185,129,0.28)'}
            strokeWidth="0.85"
            strokeDasharray="1 9"
          />
          <circle cx="20" cy="200" r="2.6" fill={isDark ? '#A5B4FC' : '#4F46E5'} />
        </svg>
      </div>

      {/* Layer 5: Right-to-Left Gradient Cover — denser on the right behind the login card,
          progressively fading to transparent on the left so the animation highlights more */}
      <div
        className="auth-gradient-sweep absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to left, rgba(9, 9, 11, 0.90) 0%, rgba(15, 23, 42, 0.72) 38%, rgba(9, 9, 11, 0.28) 64%, rgba(9, 9, 11, 0) 88%)'
            : 'linear-gradient(to left, rgba(226, 236, 249, 0.92) 0%, rgba(235, 241, 250, 0.74) 38%, rgba(241, 245, 249, 0.26) 64%, rgba(241, 245, 249, 0) 88%)',
        }}
      />
    </div>
  )
}
