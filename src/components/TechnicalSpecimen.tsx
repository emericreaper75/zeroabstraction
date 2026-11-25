'use client';

import React, { useState } from 'react';

interface SpecimenGlyph {
  char: string;
  outlined: boolean;
  unitLabel: string;
  callout?: {
    tag: string;
    detail: string;
    loupeZoom: string;
  };
}

const GLYPHS: SpecimenGlyph[] = [
  { char: 'Z', outlined: true, unitLabel: 'UNIT 01' },
  { char: 'e', outlined: true, unitLabel: 'UNIT 02' },
  {
    char: 'r',
    outlined: true,
    unitLabel: 'UNIT 03',
    callout: {
      tag: 'Inktrap',
      detail: 'Sub-pixel notch relief at high-density vertex junctions.',
      loupeZoom: 'r',
    },
  },
  { char: 'o', outlined: true, unitLabel: 'UNIT 04' },
  { char: 'A', outlined: false, unitLabel: 'UNIT 05' },
  {
    char: 'b',
    outlined: false,
    unitLabel: 'UNIT 06',
    callout: {
      tag: 'Baseline',
      detail: 'Locked 4px harmonic baseline across display and mono scales.',
      loupeZoom: 'b',
    },
  },
  { char: 's', outlined: false, unitLabel: 'UNIT 07' },
];

export function TechnicalSpecimen() {
  const [activeTag, setActiveTag] = useState<string>('Inktrap');
  const activeCallout = GLYPHS.find((g) => g.callout?.tag === activeTag)?.callout;

  return (
    <section
      className="container-wide py-14 lg:py-20 border-b border-[color:var(--border)]"
      aria-labelledby="specimen-heading"
    >
      <div className="relative rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--bg-subtle)]/55 p-6 sm:p-10 lg:p-12 overflow-hidden">
        {/* Top Monospace Annotation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.14em] uppercase text-[color:var(--text)]">
          <span>&gt;&gt; CONSTRUCTION</span>
          <h2 id="specimen-heading" className="text-[color:var(--text-muted)] font-medium">
            ZEROABSTRACTION · MONO SPECIMEN
          </h2>
          <span>&gt;&gt; SYSTEM ANATOMY</span>
        </div>

        {/* Central Specimen Grid */}
        <div className="relative my-10 sm:my-14 py-6">
          {/* Horizontal Dashed Metric Guides */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[24%] border-t border-dashed border-[color:var(--border-strong)] flex items-center justify-between"
          >
            <span className="-mt-5 font-mono text-[10px] tracking-wider text-[color:var(--text-muted)] bg-[color:var(--bg)]/80 px-1">
              Ascender
            </span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[39%] border-t border-dashed border-[color:var(--border-strong)] flex items-center justify-between"
          >
            <span className="-mt-5 font-mono text-[10px] tracking-wider text-[color:var(--text-muted)] bg-[color:var(--bg)]/80 px-1">
              X-Height
            </span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[68%] border-t border-dashed border-[color:var(--border-strong)] flex items-center justify-between"
          >
            <span className="-mt-5 font-mono text-[10px] tracking-wider text-[color:var(--text-muted)] bg-[color:var(--bg)]/80 px-1">
              Baseline
            </span>
            <span className="-mt-5 font-mono text-[10px] text-[color:var(--text-muted)] px-1">
              0
            </span>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[81%] border-t border-dashed border-[color:var(--border-strong)] flex items-center justify-between"
          >
            <span className="-mt-5 font-mono text-[10px] tracking-wider text-[color:var(--text-muted)] bg-[color:var(--bg)]/80 px-1">
              Descender
            </span>
          </div>

          {/* Glyph Columns */}
          <div className="relative z-10 mx-auto max-w-4xl px-8 sm:px-14 grid grid-cols-7 gap-2 sm:gap-3">
            {GLYPHS.map((glyph, idx) => {
              const isCalloutActive = glyph.callout && glyph.callout.tag === activeTag;
              return (
                <div
                  key={idx}
                  className="relative flex flex-col items-center border-x border-[color:var(--border)]/60 bg-[color:var(--surface)]/45 py-4 sm:py-6"
                >
                  {/* Top Caliper Tick */}
                  <div
                    aria-hidden="true"
                    className="w-4/5 h-[1px] bg-[color:var(--border-strong)] mb-3 relative before:content-[''] before:absolute before:left-0 before:-top-1 before:w-[1px] before:h-2 before:bg-[color:var(--border-strong)] after:content-[''] after:absolute after:right-0 after:-top-1 after:w-[1px] after:h-2 after:bg-[color:var(--border-strong)]"
                  />

                  {/* Optional Callout Tag + Loupe */}
                  {glyph.callout && (
                    <button
                      type="button"
                      onClick={() => setActiveTag(glyph.callout!.tag)}
                      onMouseEnter={() => setActiveTag(glyph.callout!.tag)}
                      className={`mb-1 px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] tracking-wider rounded-[2px] transition-colors cursor-pointer ${
                        isCalloutActive
                          ? 'bg-[color:var(--accent)] text-[color:var(--on-accent)]'
                          : 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] hover:bg-[color:var(--accent)] hover:text-[color:var(--on-accent)]'
                      }`}
                    >
                      {glyph.callout.tag}
                    </button>
                  )}

                  {/* Glyph */}
                  <div className="relative flex items-center justify-center min-h-[4.5rem] sm:min-h-[7rem]">
                    <span
                      className="font-mono font-medium select-none leading-none text-4xl sm:text-6xl md:text-7xl transition-transform duration-200"
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
                        className={`hidden sm:flex absolute -top-1 -left-2 w-7 h-7 rounded-full border-2 items-center justify-center font-mono text-xs font-bold shadow-sm transition-transform duration-200 ${
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
                    className="w-4/5 h-[1px] bg-[color:var(--border-strong)] mt-3 relative before:content-[''] before:absolute before:left-0 before:-top-1 before:w-[1px] before:h-2 before:bg-[color:var(--border-strong)] after:content-[''] after:absolute after:right-0 after:-top-1 after:w-[1px] after:h-2 after:bg-[color:var(--border-strong)]"
                  />

                  {/* Space / Unit Label */}
                  <span className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">
                    SPACE
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Callout Readout + Bottom Monospace Annotations */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4 border-t border-[color:var(--border)] font-mono">
          <div className="text-[11px] uppercase tracking-wider text-[color:var(--text)] leading-relaxed">
            <p className="font-semibold">MODULAR FORM WITH</p>
            <p className="text-[color:var(--text-muted)]">PRECISE GEOMETRY</p>
          </div>

          {activeCallout && (
            <div className="text-[11px] text-[color:var(--accent-text)] bg-[color:var(--accent-subtle)]/70 border border-[color:var(--accent-border)]/50 px-3 py-1.5 rounded-[var(--radius-s)]" aria-live="polite">
              <span className="uppercase font-semibold mr-2">[{activeCallout.tag}]</span>
              <span className="text-[color:var(--text)]">{activeCallout.detail}</span>
            </div>
          )}

          <div className="text-[11px] text-[color:var(--text-muted)] sm:text-right leading-relaxed">
            <p>Engineered proportions and</p>
            <p>precise structural consistency</p>
          </div>
        </div>
      </div>
    </section>
  );
}
