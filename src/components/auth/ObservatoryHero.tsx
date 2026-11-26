'use client'

import React from 'react'

export function ObservatoryHero() {
  return (
    <section
      aria-label="Observatory overview"
      className="relative w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-10 lg:py-16"
    >
      <div className="relative z-10 my-auto max-w-[460px]">
        <span className="typo-mono-data text-[11px] uppercase tracking-[0.14em] text-[var(--admin-primary)] block mb-3">
          OBSERVATORY CONSOLE
        </span>

        <h1
          className="text-[var(--admin-ink-primary)] !text-[36px] sm:!text-[40px] !leading-[1.12] !tracking-[-0.025em] !font-medium"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
        >
          Manoj Amavasya
        </h1>

        <p className="text-[var(--admin-ink-secondary)] text-[17px] sm:text-[18px] font-medium mt-2.5 tracking-[-0.01em]">
          Astronomical Atelier &amp; Research Archive
        </p>

        <p className="text-[var(--admin-ink-muted)] text-[14px] sm:text-[15px] leading-[1.6] mt-3.5 max-w-[440px]">
          Observational telemetry, deep-field surveys, and digital manuscript curation.
        </p>

        <div className="hidden sm:flex items-center gap-3 mt-6 typo-mono-data text-[11px] text-[var(--admin-ink-muted)] tracking-wide">
          <span>TLS 1.3</span>
          <span>·</span>
          <span>Payload v3.28</span>
          <span>·</span>
          <span>Epoch 2026.3</span>
        </div>
      </div>
    </section>
  )
}
