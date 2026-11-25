'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SpecimenGlyph {
  char: string;
  outlined: boolean;
  callout?: {
    tag: string;
    detail: string;
    loupeZoom: string;
  };
}

const GLYPHS: SpecimenGlyph[] = [
  { char: 'Z', outlined: true },
  { char: 'e', outlined: true },
  {
    char: 'r',
    outlined: true,
    callout: {
      tag: 'Inktrap',
      detail: 'Sub-pixel notch relief at high-density vertex junctions.',
      loupeZoom: 'r',
    },
  },
  { char: 'o', outlined: true },
  { char: 'A', outlined: false },
  {
    char: 'b',
    outlined: false,
    callout: {
      tag: 'Baseline',
      detail: 'Locked 4px harmonic baseline across display and mono scales.',
      loupeZoom: 'b',
    },
  },
  { char: 's', outlined: false },
];

export function TechnicalSpecimen() {
  const [activeTag, setActiveTag] = useState<string>('Inktrap');
  const prefersReducedMotion = useReducedMotion();
  const activeCallout = GLYPHS.find((g) => g.callout?.tag === activeTag)?.callout;

  return (
    <div
      className="relative w-full py-4 sm:py-6"
      aria-label="Technical Specimen and Monospace Annotation"
    >
      {/* Top Monospace Annotation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--text-muted)] mb-5">
        <span>&gt;&gt; CONSTRUCTION</span>
        <span className="text-[color:var(--text)] font-medium">ZEROABSTRACTION · SPECIMEN</span>
        <span>&gt;&gt; ANATOMY</span>
      </div>

      {/* Central Specimen Grid (blends transparently over HeroNebula) */}
      <div className="relative py-5">
        {/* Horizontal Dashed Metric Guides */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[23%] border-t border-dashed border-[color:var(--border-strong)]/70"
        >
          <span className="inline-block -translate-y-4 font-mono text-[9px] tracking-wider text-[color:var(--text-muted)]">
            Ascender
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[38%] border-t border-dashed border-[color:var(--border-strong)]/70"
        >
          <span className="inline-block -translate-y-4 font-mono text-[9px] tracking-wider text-[color:var(--text-muted)]">
            X-Height
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[68%] border-t border-dashed border-[color:var(--border-strong)]/70 flex justify-between"
        >
          <span className="inline-block -translate-y-4 font-mono text-[9px] tracking-wider text-[color:var(--text-muted)]">
            Baseline
          </span>
          <span className="inline-block -translate-y-4 font-mono text-[9px] text-[color:var(--text-muted)]">
            0
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[82%] border-t border-dashed border-[color:var(--border-strong)]/70"
        >
          <span className="inline-block -translate-y-4 font-mono text-[9px] tracking-wider text-[color:var(--text-muted)]">
            Descender
          </span>
        </div>

        {/* 7-Column Glyph Matrix */}
        <div className="relative z-10 pl-12 sm:pl-16 pr-3 grid grid-cols-7 gap-1 sm:gap-2">
          {GLYPHS.map((glyph, idx) => {
            const isCalloutActive = glyph.callout && glyph.callout.tag === activeTag;
            return (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.35, delay: idx * 0.045, ease: [0.22, 1, 0.36, 1] }
                }
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                className="relative flex flex-col items-center border-x border-[color:var(--border)]/50 bg-[color:var(--surface)]/25 [backdrop-filter:blur(4px)] py-3 sm:py-4 transition-colors hover:border-[color:var(--accent-border)]/70"
              >
                {/* Top Caliper Tick */}
                <div
                  aria-hidden="true"
                  className="w-4/5 h-[1px] bg-[color:var(--border-strong)] mb-2 relative before:content-[''] before:absolute before:left-0 before:-top-1 before:w-[1px] before:h-2 before:bg-[color:var(--border-strong)] after:content-[''] after:absolute after:right-0 after:-top-1 after:w-[1px] after:h-2 after:bg-[color:var(--border-strong)]"
                />

                {/* Optional Callout Badge */}
                <div className="min-h-[20px] flex items-center justify-center mb-1">
                  {glyph.callout && (
                    <button
                      type="button"
                      onClick={() => setActiveTag(glyph.callout!.tag)}
                      onMouseEnter={() => setActiveTag(glyph.callout!.tag)}
                      className={`relative px-1.5 py-0.5 font-mono text-[8px] sm:text-[9px] tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                        isCalloutActive
                          ? 'text-[color:var(--on-accent)]'
                          : 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] hover:text-[color:var(--text)]'
                      }`}
                    >
                      {isCalloutActive && (
                        <motion.span
                          layoutId="specimen-callout-pill"
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 450, damping: 32 }
                          }
                          className="absolute inset-0 rounded-[2px] bg-[color:var(--accent)] -z-10"
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative z-10">{glyph.callout.tag}</span>
                    </button>
                  )}
                </div>

                {/* Glyph */}
                <div className="relative flex items-center justify-center min-h-[3.25rem] sm:min-h-[4.75rem] xl:min-h-[5.5rem]">
                  <span
                    className="font-mono font-medium select-none leading-none text-3xl sm:text-5xl xl:text-6xl transition-transform duration-200"
                    style={
                      glyph.outlined
                        ? {
                            color: 'transparent',
                            WebkitTextStroke: '1.5px var(--accent)',
                          }
                        : {
                            color: 'var(--accent)',
                          }
                    }
                  >
                    {glyph.char}
                  </span>

                  {/* Circular Loupe Indicator */}
                  {glyph.callout && (
                    <span
                      aria-hidden="true"
                      className={`hidden sm:flex absolute -top-1 -left-2 w-6 h-6 rounded-full border-2 items-center justify-center font-mono text-[10px] font-bold shadow-sm transition-transform duration-200 ${
                        isCalloutActive
                          ? 'scale-110 border-[color:var(--text)] bg-[color:var(--surface)] text-[color:var(--accent)]'
                          : 'border-[color:var(--border-strong)] bg-[color:var(--surface)]/90 text-[color:var(--text-muted)]'
                      }`}
                    >
                      {glyph.callout.loupeZoom}
                    </span>
                  )}
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
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Monospace Footer & Active Callout */}
      <div className="mt-4 pt-3 border-t border-[color:var(--border)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[10px]">
        <div className="uppercase tracking-wider text-[color:var(--text-muted)]">
          <span className="text-[color:var(--text)] font-medium">MODULAR FORM</span> · PRECISE GEOMETRY
        </div>
        <AnimatePresence mode="wait">
          {activeCallout && (
            <motion.div
              key={activeCallout.tag}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
              className="text-[color:var(--accent-text)] bg-[color:var(--accent-subtle)]/75 border border-[color:var(--accent-border)]/50 px-2.5 py-1 rounded-[var(--radius-s)]"
              aria-live="polite"
            >
              <span className="uppercase font-semibold mr-1.5">[{activeCallout.tag}]</span>
              <span className="text-[color:var(--text)]">{activeCallout.detail}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
