'use client';

import React from 'react';

interface TimelineStripProps {
  startDate?: string;
  endDate?: string;
  label?: string;
  logNote?: string;
}

export function TimelineStrip({
  startDate = 'SEP 24, 2026',
  endDate = '1 NOV 2026',
  label = 'Listen on Research of 264 — Ans/t',
  logNote = 'Experimental calibration activities of the system in the lab before integration.',
}: TimelineStripProps) {
  return (
    <section className="container-wide py-12 md:py-16" aria-label="Research Timeline">
      <div className="flex flex-col gap-5 py-6 px-4 sm:px-8 border-y border-[color:var(--border)] bg-[color:var(--bg)]">
        {/* Progress Timeline Track */}
        <div className="flex items-center gap-4 sm:gap-6 w-full">
          {/* Start Date */}
          <span className="font-mono text-[11px] sm:text-xs text-[color:var(--text-muted)] tracking-wider whitespace-nowrap">
            {startDate}
          </span>

          {/* Track line with glowing node markers */}
          <div className="relative flex-1 h-[2px] bg-[color:var(--border)] flex items-center">
            {/* Node 1: Start (Cyan Glow) */}
            <div
              className="absolute left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400"
              style={{
                boxShadow: '0 0 12px 3px rgba(34, 211, 238, 0.75)',
              }}
              title="Calibration Commencement"
            />

            {/* Node 2: ~28% (Amber Glow) */}
            <div
              className="absolute left-[28%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400"
              style={{
                boxShadow: '0 0 10px 3px rgba(251, 191, 36, 0.75)',
              }}
              title="Detector Array Tuning"
            />

            {/* Node 3: ~58% (Warm Peach Glow) */}
            <div
              className="absolute left-[58%] -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400"
              style={{
                boxShadow: '0 0 9px 2px rgba(251, 146, 60, 0.7)',
              }}
              title="Cryostat Cooling Milestones"
            />

            {/* Node 4: End (Soft Indigo/Violet Glow) */}
            <div
              className="absolute right-0 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-indigo-400"
              style={{
                boxShadow: '0 0 12px 3px rgba(129, 140, 248, 0.75)',
              }}
              title="Integration Ready"
            />
          </div>

          {/* End Date */}
          <span className="font-mono text-[11px] sm:text-xs text-[color:var(--text-muted)] tracking-wider whitespace-nowrap">
            {endDate}
          </span>
        </div>

        {/* Concise Single-Line Log Note */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pl-0 sm:pl-1">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[color:var(--text-muted)] shrink-0">
            {label}
          </span>
          <p className="text-xs sm:text-sm text-[color:var(--text)] font-sans tracking-tight">
            {logNote}
          </p>
        </div>
      </div>
    </section>
  );
}
