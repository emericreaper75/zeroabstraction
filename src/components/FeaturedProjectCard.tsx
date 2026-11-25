'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import type { Project } from '@/payload-types';

interface FeaturedProjectCardProps {
  project?: Project | null;
  isEven?: boolean;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const title = project?.title || 'Cryogenic Focal Plane Array for Submillimeter Polarimetry';
  const year = project?.year || 2025;
  const summary =
    project?.summary ||
    'A high sensitivity sub-Kelvin detector system engineered for balloon-borne cosmic microwave background polarimetry.';
  const slug = project?.slug || 'fpga-signal-processing';

  const statusLabel = project?.status ? project.status.replace('_', ' ').toUpperCase() : 'ACTIVE';
  let techString = 'EMBEDDED • ASTROPHYSICS';
  if (project?.technologies && project.technologies.length > 0) {
    const list = project.technologies
      .slice(0, 3)
      .map((t: unknown) => (typeof t === 'object' && t !== null && 'name' in t ? (t as { name: string }).name : ''))
      .filter(Boolean);
    if (list.length > 0) {
      techString = list.join(' • ').toUpperCase();
    }
  }

  return (
    <div className="w-full">
      {/* 50/50 Asymmetric Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        {/* Left Column: Theme-aware SVG Schematic inside Recessed Inset Surface */}
        <div className="relative p-5 sm:p-8 architectural-grid bg-[color:var(--bg-subtle)] border border-[color:var(--border)] rounded-[var(--radius-s)] flex items-center justify-center">
          <span aria-hidden="true" className="absolute top-2 left-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)] select-none">+</span>
          <span aria-hidden="true" className="absolute top-2 right-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)] select-none">+</span>
          <span aria-hidden="true" className="absolute bottom-2 left-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)] select-none">+</span>
          <span aria-hidden="true" className="absolute bottom-2 right-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)] select-none">+</span>

          <Link
            href={`/projects/${slug}`}
            className="w-full block group"
            tabIndex={-1}
            aria-hidden="true"
            style={{ textDecoration: 'none' }}
          >
            <div className="w-full overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--math-bg)] p-4 sm:p-6 transition-colors group-hover:border-[color:var(--accent-border)]">
              <svg viewBox="0 0 400 240" className="w-full h-auto" aria-hidden="true">
                <defs>
                  <pattern id="featured-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="240" fill="url(#featured-grid)" />

                {/* Concentric Cryogenic Focal Plane & Polarization Rings */}
                <circle cx="135" cy="120" r="76" fill="none" stroke="var(--border-strong)" strokeWidth="1" className="schematic-flow" />
                <circle cx="135" cy="120" r="52" fill="none" stroke="var(--accent)" strokeWidth="1.25" opacity="0.75" />
                <circle cx="135" cy="120" r="26" fill="none" stroke="var(--secondary)" strokeWidth="1.25" />
                <line x1="45" y1="120" x2="225" y2="120" stroke="var(--border-strong)" strokeWidth="1" />
                <line x1="135" y1="30" x2="135" y2="210" stroke="var(--border-strong)" strokeWidth="1" />

                {/* Bolometer Array Pixels */}
                {[-32, 0, 32].map((dx) =>
                  [-32, 0, 32].map((dy) => (
                    <rect
                      key={`${dx}-${dy}`}
                      x={135 + dx - 6}
                      y={120 + dy - 6}
                      width="12"
                      height="12"
                      rx="1.5"
                      fill={dx === 0 && dy === 0 ? 'var(--secondary)' : 'var(--accent-subtle)'}
                      stroke="var(--accent)"
                      strokeWidth="1"
                    />
                  ))
                )}

                {/* Readout Signal Waveform Trace on Right */}
                <line x1="240" y1="120" x2="375" y2="120" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
                <path
                  d="M 240 120 Q 257 68, 274 120 T 308 120 T 342 120 T 375 120"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M 240 120 C 262 90, 285 150, 308 120 C 330 90, 353 150, 375 120"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="1.25"
                  className="schematic-flow"
                />
                <circle cx="308" cy="120" r="3.5" fill="var(--secondary)" />
                <circle cx="375" cy="120" r="3.5" fill="var(--accent)" />

                <text x="14" y="22" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-mono)">
                  FIG.01 // FOCAL PLANE &amp; READOUT
                </text>
                <text x="278" y="222" fill="var(--text-muted)" fontSize="9.5" fontFamily="var(--font-mono)">
                  150 / 220 GHz · 300 mK
                </text>
              </svg>
            </div>
          </Link>
        </div>

        {/* Right Column: Editorial Serif Heading, Metadata Row, Description & CTA */}
        <div className="flex flex-col items-start gap-5 max-w-xl">
          <div className="w-full flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-[color:var(--border)]">
            <span className="font-mono text-[11px] tracking-widest uppercase text-[color:var(--text-muted)]">
              FEATURED SYSTEM · {year}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] font-mono text-[10px] tracking-widest uppercase text-[color:var(--accent-text)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
              <span>{statusLabel}</span>
            </span>
          </div>

          <Link href={`/projects/${slug}`} className="hover:opacity-85 transition-opacity" style={{ textDecoration: 'none' }}>
            <h3 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-light leading-[1.15] text-balance text-[color:var(--text)]">
              {title}
            </h3>
          </Link>

          <p className="text-[color:var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans">
            {summary}
          </p>

          <div className="w-full px-3.5 py-2 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--bg-subtle)] font-mono text-[11px] tracking-wider uppercase text-[color:var(--text-muted)]">
            {techString}
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-4">
            <Link href={`/projects/${slug}`} className="btn-cta-solid">
              <span>VIEW PROJECT</span>
              <span>→</span>
            </Link>
            <Link
              href="/projects"
              className="min-h-[44px] inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors"
              style={{ textDecoration: 'none' }}
            >
              <span>ALL SYSTEMS</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
