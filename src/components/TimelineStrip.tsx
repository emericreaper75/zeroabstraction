'use client';

import React, { useState, useMemo } from 'react';

interface TimelineMilestone {
  id: string;
  year: '2026' | '2025';
  position: number;
  date: string;
  location: string;
  title: string;
  note: string;
}

interface TimelineStripProps {
  startDate?: string;
  endDate?: string;
  label?: string;
  logNote?: string;
}

export function TimelineStrip({
  startDate = 'SEP 24, 2026',
  endDate = '1 NOV 2026',
  label = 'System Integration',
  logNote = 'Experimental calibration activities of the system in the lab before integration.',
}: TimelineStripProps) {
  const [yearFilter, setYearFilter] = useState<'ALL' | '2026' | '2025'>('ALL');

  const allMilestones: TimelineMilestone[] = useMemo(
    () => [
      {
        id: 'rf-sim-2025',
        year: '2025',
        position: 0,
        date: 'NOV 14, 2025',
        location: 'ANANTAPUR LAB',
        title: 'Cryogenic LNA Modeling',
        note: 'Simulated sub-Kelvin noise temperature profiles and impedance matching networks in LTspice.',
      },
      {
        id: 'commence-2026',
        year: '2026',
        position: 28,
        date: startDate,
        location: 'ANANTAPUR LAB',
        title: 'Calibration Commencement',
        note: 'Baseline noise-floor characterization and FPGA readout clock synchronization.',
      },
      {
        id: 'tuning-2026',
        year: '2026',
        position: 56,
        date: 'OCT 05, 2026',
        location: 'TESTBENCH 02',
        title: 'Detector Array Tuning',
        note: 'Bias sweep across sub-Kelvin bolometer channels and crosstalk verification.',
      },
      {
        id: 'cooling-2026',
        year: '2026',
        position: 78,
        date: 'OCT 19, 2026',
        location: 'CRYOSTAT BAY',
        title: 'Cryostat Cooling Milestones',
        note: 'Thermal stability verification at 300 mK stage prior to optical window sealing.',
      },
      {
        id: 'integration-2026',
        year: '2026',
        position: 100,
        date: endDate,
        location: 'LAB BENCH',
        title: label,
        note: logNote,
      },
    ],
    [startDate, endDate, label, logNote]
  );

  const visibleMilestones = useMemo(
    () => (yearFilter === 'ALL' ? allMilestones : allMilestones.filter((m) => m.year === yearFilter)),
    [allMilestones, yearFilter]
  );

  const [selectedId, setSelectedId] = useState<string>('integration-2026');
  const activeIndex = Math.max(
    0,
    visibleMilestones.findIndex((m) => m.id === selectedId)
  );
  const active = visibleMilestones[activeIndex] ?? visibleMilestones[0];

  const handleYearChange = (nextYear: 'ALL' | '2026' | '2025') => {
    setYearFilter(nextYear);
    const filtered = nextYear === 'ALL' ? allMilestones : allMilestones.filter((m) => m.year === nextYear);
    if (filtered.length > 0 && !filtered.some((m) => m.id === selectedId)) {
      setSelectedId(filtered[filtered.length - 1].id);
    }
  };

  const trackProgress =
    visibleMilestones.length > 1
      ? (activeIndex / (visibleMilestones.length - 1)) * 100
      : 100;

  return (
    <section className="container-wide py-12 md:py-16 border-b border-[color:var(--border)]" aria-label="Research Timeline">
      <div className="flex flex-col gap-5">
        {/* Header with Year Filter Pills */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
            MILESTONE TIMELINE
          </span>
          <div className="inline-flex items-center p-0.5 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]/60 font-mono text-[11px]">
            {(['ALL', '2026', '2025'] as const).map((yr) => {
              const isSelected = yearFilter === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearChange(yr)}
                  aria-pressed={isSelected}
                  className={`px-2.5 py-1 rounded-[var(--radius-s)] uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Milestone Track */}
        <div className="flex items-center gap-4 sm:gap-6 w-full py-2">
          <span className="font-mono text-[11px] text-[color:var(--text-muted)] tracking-wider whitespace-nowrap">
            {visibleMilestones[0]?.date}
          </span>

          <div
            className="relative flex-1 h-[2px] bg-[color:var(--border)] flex items-center"
            role="tablist"
            aria-label="Research milestones"
          >
            <div
              className="absolute left-0 top-0 h-full bg-[color:var(--accent)] transition-all duration-200 ease-out"
              style={{ width: `${trackProgress}%` }}
              aria-hidden="true"
            />
            {visibleMilestones.map((milestone, index) => {
              const isSelected = milestone.id === active?.id;
              const leftPct =
                visibleMilestones.length > 1
                  ? (index / (visibleMilestones.length - 1)) * 100
                  : 50;
              return (
                <button
                  key={milestone.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${milestone.title} (${milestone.date})`}
                  onClick={() => setSelectedId(milestone.id)}
                  onMouseEnter={() => setSelectedId(milestone.id)}
                  onFocus={() => setSelectedId(milestone.id)}
                  style={{ left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] cursor-pointer group"
                >
                  <span
                    className={`block rounded-full transition-all duration-200 ${
                      isSelected
                        ? 'w-3 h-3 bg-[color:var(--accent)] ring-4 ring-[color:var(--accent-subtle)]'
                        : 'w-2.5 h-2.5 bg-[color:var(--secondary)] opacity-80 group-hover:scale-125 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[11px] text-[color:var(--text-muted)] tracking-wider whitespace-nowrap">
            {visibleMilestones[visibleMilestones.length - 1]?.date}
          </span>
        </div>

        {/* Compact Single-Row Recessed Summary Strip */}
        {active && (
          <div
            className="px-4 py-3 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--bg-subtle)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6"
            aria-live="polite"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent-text)] shrink-0">
              {active.date} {'//'} {active.location}
            </span>
            <p className="text-xs sm:text-sm text-[color:var(--text)] leading-relaxed sm:text-right">
              {active.note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
