'use client'

import React from 'react'

interface ObservatoryHeroProps {
  theme: 'light' | 'dark'
  latencyMs: number | null
}

const LINE_1 = [
  { char: 'M', outlined: true },
  { char: 'A', outlined: true },
  { char: 'N', outlined: true },
  { char: 'O', outlined: false },
  { char: 'J', outlined: false },
]

const LINE_2_CHARS = ['A', 'M', 'A', 'V', 'A', 'S', 'Y', 'A']

export function ObservatoryHero({ theme, latencyMs }: ObservatoryHeroProps) {
  const isDark = theme === 'dark'

  const guideColor = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 23, 42, 0.15)'

  const line2ColorsDark = [
    '#7DD3FC',
    '#E2E8F0',
    '#38BDF8',
    '#E2E8F0',
    '#7DD3FC',
    '#38BDF8',
    '#E2E8F0',
    '#7DD3FC',
  ]

  const line2ColorsLight = [
    '#2563EB',
    '#0F172A',
    '#60A5FA',
    '#0F172A',
    '#2563EB',
    '#60A5FA',
    '#0F172A',
    '#60A5FA',
  ]

  const line2Colors = isDark ? line2ColorsDark : line2ColorsLight

  return (
    <section
      aria-label="Observatory overview"
      className="relative w-full lg:w-[56%] flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 lg:py-12"
    >
      <div className="relative z-10 my-auto max-w-[540px]">
        {/* Eyebrow */}
        <div
          className="typo-mono-data text-[12px] uppercase tracking-[0.16em] mb-4 tabular-nums"
          style={{ color: isDark ? '#7DD3FC' : '#1E293B' }}
        >
          OBSERVATORY CONSOLE • {latencyMs !== null ? `${latencyMs}MS` : '31MS'}
        </div>

        {/* Two-Line Modular Typographic Grid Construction */}
        <h1 className="sr-only">Manoj Amavasya</h1>
        <div aria-hidden="true" className="select-none space-y-1">
          {/* Line 1: M A N O J (3 outlined + 2 solid, inside 8-cell architectural grid) */}
          <div className="relative grid grid-cols-8">
            {/* Horizontal Guide Lines (Cap-height, Midline, Baseline) */}
            <div className="absolute inset-x-0 top-[10%] h-px pointer-events-none" style={{ backgroundColor: guideColor }} />
            <div className="absolute inset-x-0 top-[50%] h-px pointer-events-none" style={{ backgroundColor: guideColor }} />
            <div className="absolute inset-x-0 bottom-[10%] h-px pointer-events-none" style={{ backgroundColor: guideColor }} />

            {Array.from({ length: 8 }).map((_, idx) => {
              const item = LINE_1[idx]
              return (
                <div
                  key={`l1-${idx}`}
                  className="flex items-center justify-center py-0.5"
                  style={{
                    borderLeft: idx === 0 ? `1px solid ${guideColor}` : undefined,
                    borderRight: `1px solid ${guideColor}`,
                    fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(42px, 3.8vw, 56px)',
                    fontWeight: 600,
                    lineHeight: 1.08,
                    color: item
                      ? item.outlined
                        ? 'transparent'
                        : isDark
                          ? '#F8FAFC'
                          : '#0F172A'
                      : 'transparent',
                    WebkitTextStroke: item?.outlined
                      ? isDark
                        ? '1.5px #E2E8F0'
                        : '1.5px #0F172A'
                      : undefined,
                  }}
                >
                  {item ? item.char : '\u00A0'}
                </div>
              )
            })}
          </div>

          {/* Line 2: A M A V A S Y A (8 solid alternating-tone cells) */}
          <div className="relative grid grid-cols-8">
            <div className="absolute inset-x-0 top-[10%] h-px pointer-events-none" style={{ backgroundColor: guideColor }} />
            <div className="absolute inset-x-0 top-[50%] h-px pointer-events-none" style={{ backgroundColor: guideColor }} />
            <div className="absolute inset-x-0 bottom-[10%] h-px pointer-events-none" style={{ backgroundColor: guideColor }} />

            {LINE_2_CHARS.map((char, idx) => (
              <div
                key={`l2-${idx}`}
                className="flex items-center justify-center py-0.5"
                style={{
                  borderLeft: idx === 0 ? `1px solid ${guideColor}` : undefined,
                  borderRight: `1px solid ${guideColor}`,
                  fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(42px, 3.8vw, 56px)',
                  fontWeight: 600,
                  lineHeight: 1.08,
                  color: line2Colors[idx],
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        {/* Italic Editorial Serif Subtitle */}
        <p
          className="mt-5 tracking-[-0.01em]"
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 1.8vw, 26px)',
            lineHeight: 1.25,
            color: isDark ? '#E2C07D' : '#B48228',
          }}
        >
          Astronomical Atelier
        </p>

        {/* Footer Telemetry Line */}
        <div
          className="typo-mono-data text-[12px] uppercase tracking-[0.12em] mt-4"
          style={{ color: isDark ? '#94A3B8' : '#475569' }}
        >
          TLS 1.3 // PAYLOAD v3.28 // EPOCH 2026.3
        </div>
      </div>
    </section>
  )
}
