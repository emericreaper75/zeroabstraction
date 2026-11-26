'use client'

import React from 'react'

interface ObservatoryBackdropProps {
  theme: 'light' | 'dark'
}

export function ObservatoryBackdrop({ theme }: ObservatoryBackdropProps) {
  const isDark = theme === 'dark'

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* Simple Right-to-Left Color Blend */}
      <div
        className="auth-gradient-sweep absolute inset-0"
        style={{
          background: isDark
            ? 'linear-gradient(to left, #111827 0%, #0D111A 42%, #09090B 82%)'
            : 'linear-gradient(to left, #E6EEF8 0%, #EDF2F9 42%, #F1F5F9 82%)',
        }}
      />

      {/* Subtle Architectural Grid */}
      <div className="absolute inset-0 cosmic-grid opacity-55" />

      {/* Single Delicate Orbital Ring */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${
          isDark ? 'opacity-20' : 'opacity-25'
        }`}
      >
        <svg viewBox="0 0 400 400" className="w-[min(86vw,720px)] h-[min(86vw,720px)] auth-orbit-slow">
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke={isDark ? 'rgba(148,163,184,0.35)' : 'rgba(100,116,139,0.28)'}
            strokeWidth="0.65"
            strokeDasharray="3 8"
          />
          <circle
            cx="200"
            cy="10"
            r="2"
            fill={isDark ? '#60A5FA' : '#2563EB'}
          />
        </svg>
      </div>
    </div>
  )
}
