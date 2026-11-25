'use client';

import React, { useState } from 'react';
import { Link } from 'next-view-transitions';

interface DomainPreset {
  id: 'astro' | 'fpga' | 'quantum';
  label: string;
  tag: string;
  title: string;
  equation: string;
  metricLabel: string;
  metricValue: string;
  coords: string;
  href: string;
  wavePath: string;
}

const PRESETS: DomainPreset[] = [
  {
    id: 'astro',
    label: 'ASTRO',
    tag: 'OBSERVATIONAL INSTRUMENTATION',
    title: 'Sub-Kelvin Polarimetry & CMB Readout',
    equation: 'NEP = √(2 h ν P_opt + 4 k_B T_c² G)',
    metricLabel: 'BANDPASS',
    metricValue: '150 / 220 GHz',
    coords: 'RA 14h 29m · DEC +14° 40′',
    href: '/projects',
    wavePath: 'M 0 28 Q 20 8, 40 28 T 80 28 T 120 28 T 160 28 T 200 28 T 240 28',
  },
  {
    id: 'fpga',
    label: 'FPGA',
    tag: 'DETERMINISTIC DSP PIPELINES',
    title: 'Polyphase Channelizer & Matched Filtering',
    equation: 'y[n] = Σ_k h_k[n] · x[n − kM] · e^(−j2πkn/M)',
    metricLabel: 'LATENCY',
    metricValue: '< 420 ns',
    coords: 'CLK 250 MHz · AXI4-STREAM',
    href: '/projects',
    wavePath: 'M 0 28 L 20 12 L 40 42 L 60 16 L 80 38 L 100 10 L 120 44 L 140 18 L 160 36 L 180 14 L 200 40 L 240 28',
  },
  {
    id: 'quantum',
    label: 'QUANTUM',
    tag: 'NOISE & COHERENCE DYNAMICS',
    title: 'Superconducting Readout & Error Mitigation',
    equation: 'ρ(t) = Σ_k E_k(t) ρ(0) E_k†(t)',
    metricLabel: 'COHERENCE T₂',
    metricValue: '84.6 μs',
    coords: 'T_stage 15 mK · DISPERSIVE',
    href: '/writing',
    wavePath: 'M 0 28 C 25 4, 45 52, 70 28 C 95 6, 115 48, 140 28 C 165 12, 185 44, 210 28 L 240 28',
  },
];

export function HeroTelemetry() {
  const [activeId, setActiveId] = useState<DomainPreset['id']>('astro');
  const active = PRESETS.find((p) => p.id === activeId) ?? PRESETS[0];

  return (
    <div className="hidden lg:flex flex-col items-end justify-center w-full relative z-10">
      <div className="w-full max-w-md rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--glass-bg)] [backdrop-filter:blur(16px)] shadow-lg overflow-hidden">
        {/* Top Instrument Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]/70">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
            <span>OBSERVATORY TELEMETRY</span>
          </div>
          <div className="flex items-center gap-1" role="tablist" aria-label="Research domain telemetry">
            {PRESETS.map((preset) => {
              const selected = preset.id === activeId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(preset.id)}
                  className={`px-2 py-1 rounded-[var(--radius-s)] font-mono text-[10px] tracking-wider uppercase transition-colors ${
                    selected
                      ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] border border-[color:var(--accent-border)]/60 font-medium'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)] border border-transparent'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4" aria-live="polite">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[color:var(--accent-text)]">
              {active.tag}
            </span>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-normal leading-snug text-[color:var(--text)]">
              {active.title}
            </h2>
          </div>

          {/* Signal Waveform Strip */}
          <div className="relative rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--math-bg)] px-3 py-2.5 overflow-hidden">
            <svg
              viewBox="0 0 240 56"
              className="w-full h-12 overflow-visible"
              aria-hidden="true"
            >
              <line x1="0" y1="28" x2="240" y2="28" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <path
                d={active.wavePath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="240" cy="28" r="3" fill="var(--secondary)" />
            </svg>
          </div>

          {/* Symbolic Relation */}
          <div className="px-3 py-2 rounded-[var(--radius-s)] border-l-2 border-[color:var(--secondary)] bg-[color:var(--surface)]/70 font-mono text-xs text-[color:var(--text)] overflow-x-auto whitespace-nowrap">
            {active.equation}
          </div>

          {/* Telemetry Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[color:var(--border)] font-mono text-[11px]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[color:var(--text-muted)] tracking-widest">{active.metricLabel}</span>
              <span className="text-[color:var(--text)] font-medium">{active.metricValue}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-[color:var(--text-muted)] tracking-wider">{active.coords}</span>
              <Link
                href={active.href}
                className="text-[color:var(--accent-text)] hover:underline mt-0.5"
                style={{ textDecoration: 'none' }}
              >
                INSPECT →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
