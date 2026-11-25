'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SpecimenGlyph {
  char: string;
  outlined: boolean;
  lane: string;
  nodeTag: string;
  signalDetail: string;
}

const GLYPHS: SpecimenGlyph[] = [
  {
    char: 'Z',
    outlined: true,
    lane: '01',
    nodeTag: 'SENSOR',
    signalDetail: 'Cryogenic bolometer & detector front-end capture.',
  },
  {
    char: 'e',
    outlined: true,
    lane: '02',
    nodeTag: 'AMP',
    signalDetail: 'Low-noise SQUID & cryogenic pre-amplification stage.',
  },
  {
    char: 'r',
    outlined: true,
    lane: '03',
    nodeTag: 'ADC',
    signalDetail: 'Sub-nanosecond sampling with jitter-locked clock tree.',
  },
  {
    char: 'o',
    outlined: true,
    lane: '04',
    nodeTag: 'FPGA',
    signalDetail: 'Polyphase channelizer & deterministic HDL pipeline.',
  },
  {
    char: 'A',
    outlined: false,
    lane: '05',
    nodeTag: 'FILTER',
    signalDetail: 'Matched filtering & real-time RFI spectral excision.',
  },
  {
    char: 'b',
    outlined: false,
    lane: '06',
    nodeTag: 'SOLVER',
    signalDetail: 'Numerical inversion & Bayesian parameter estimation.',
  },
  {
    char: 's',
    outlined: false,
    lane: '07',
    nodeTag: 'ARCHIVE',
    signalDetail: 'Reproducible FITS telemetry & open research notes.',
  },
];

export function TechnicalSpecimen() {
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const prefersReducedMotion = useReducedMotion();
  const activeGlyph = GLYPHS[activeIndex] ?? GLYPHS[0];

  return (
    <div
      className="relative w-full"
      aria-label="ZeroAbstraction Architecture Pipeline Specimen"
    >
      {/* Subtle radially-masked coordinate grid + low-opacity ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 architectural-grid opacity-60"
        style={{
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 86%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 86%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse at 55% 48%, var(--accent-subtle) 0%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 88%)',
        }}
      />

      {/* Top Monospace Annotation Strip (aligned with left eyebrow pill) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-[color:var(--text)] mb-4">
        <span className="text-[color:var(--text-muted)]">&gt;&gt; CONSTRUCTION</span>
        <span className="font-medium">ZEROABSTRACTION · PIPELINE SPECIMEN</span>
        <span className="text-[color:var(--text-muted)]">&gt;&gt; ANATOMY</span>
      </div>

      {/* Central Specimen Grid */}
      <div className="relative z-10 py-4">
        {/* Horizontal Dashed Metric Guides */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[23%] border-t border-dashed border-[color:var(--border-strong)]"
        >
          <span className="inline-block -translate-y-4 font-mono text-[10px] tracking-wider text-[color:var(--text)]">
            Ascender
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[38%] border-t border-dashed border-[color:var(--border-strong)]"
        >
          <span className="inline-block -translate-y-4 font-mono text-[10px] tracking-wider text-[color:var(--text)]">
            X-Height
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[68%] border-t border-dashed border-[color:var(--border-strong)] flex justify-between"
        >
          <span className="inline-block -translate-y-4 font-mono text-[10px] tracking-wider text-[color:var(--text)]">
            Baseline
          </span>
          <span className="inline-block -translate-y-4 font-mono text-[10px] text-[color:var(--text)]">
            0
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[82%] border-t border-dashed border-[color:var(--border-strong)]"
        >
          <span className="inline-block -translate-y-4 font-mono text-[10px] tracking-wider text-[color:var(--text)]">
            Descender
          </span>
        </div>

        {/* 7 Interactive Vertical Glyph Lanes */}
        <div
          className="relative z-10 pl-14 sm:pl-16 pr-3 grid grid-cols-7 gap-1 sm:gap-2"
          role="tablist"
          aria-label="Architecture pipeline stages"
        >
          {GLYPHS.map((glyph, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={glyph.lane}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`${glyph.char} — ${glyph.nodeTag}: ${glyph.signalDetail}`}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.35, delay: idx * 0.045, ease: [0.22, 1, 0.36, 1] }
                }
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                className={`relative flex flex-col items-center border-x py-3 sm:py-3.5 transition-colors cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] ${
                  isActive
                    ? 'border-[color:var(--accent-border)] bg-[color:var(--accent-subtle)]/35'
                    : 'border-[color:var(--border)]/60 bg-transparent hover:border-[color:var(--border-strong)]'
                }`}
              >
                {/* Top Caliper Tick */}
                <div
                  aria-hidden="true"
                  className="w-4/5 h-[1px] bg-[color:var(--border-strong)] mb-2 relative before:content-[''] before:absolute before:left-0 before:-top-1 before:w-[1px] before:h-2 before:bg-[color:var(--border-strong)] after:content-[''] after:absolute after:right-0 after:-top-1 after:w-[1px] after:h-2 after:bg-[color:var(--border-strong)]"
                />

                {/* Active Node Badge (smoothly moves across lanes) */}
                <div className="min-h-[20px] flex items-center justify-center mb-1 relative w-full px-0.5">
                  {isActive ? (
                    <motion.span
                      layoutId="specimen-lane-badge"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 460, damping: 34 }
                      }
                      className="px-1.5 py-0.5 font-mono text-[8px] sm:text-[9px] tracking-wider rounded-[2px] bg-[color:var(--accent)] text-[color:var(--on-accent)] font-medium"
                    >
                      {glyph.nodeTag}
                    </motion.span>
                  ) : (
                    <span className="font-mono text-[8px] sm:text-[9px] tracking-wider text-[color:var(--text-muted)]">
                      {glyph.lane}
                    </span>
                  )}
                </div>

                {/* Glyph */}
                <div className="relative flex items-center justify-center min-h-[3.25rem] sm:min-h-[4.5rem] xl:min-h-[5.25rem]">
                  <span
                    className="font-mono font-medium select-none leading-none text-3xl sm:text-5xl xl:text-6xl transition-transform duration-200"
                    style={
                      glyph.outlined
                        ? {
                            color: 'transparent',
                            WebkitTextStroke: isActive ? '1.75px var(--accent)' : '1.4px var(--accent)',
                          }
                        : {
                            color: 'var(--accent)',
                          }
                    }
                  >
                    {glyph.char}
                  </span>
                </div>

                {/* Bottom Caliper Tick */}
                <div
                  aria-hidden="true"
                  className="w-4/5 h-[1px] bg-[color:var(--border-strong)] mt-2 relative before:content-[''] before:absolute before:left-0 before:-top-1 before:w-[1px] before:h-2 before:bg-[color:var(--border-strong)] after:content-[''] after:absolute after:right-0 after:-top-1 after:w-[1px] after:h-2 after:bg-[color:var(--border-strong)]"
                />

                {/* Space Label */}
                <span className="mt-2 font-mono text-[8px] sm:text-[9px] tracking-widest uppercase text-[color:var(--text-muted)]">
                  SPACE
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom SIGNAL FLOW Readout (aligned with left PROJECTS · WRITING row) */}
      <div className="relative z-10 mt-3 pt-3 border-t border-[color:var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
        <div className="flex items-center gap-2 uppercase tracking-wider text-[color:var(--text)] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
          <span className="font-medium">SIGNAL FLOW</span>
          <span className="text-[color:var(--text-muted)]">[{activeGlyph.lane} · {activeGlyph.nodeTag}]</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={activeGlyph.lane}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            className="text-[color:var(--text)] sm:text-right"
            aria-live="polite"
          >
            {activeGlyph.signalDetail}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
