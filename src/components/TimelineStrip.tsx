'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TimelineMilestone {
  id: string;
  position: number;
  date: string;
  title: string;
  note: string;
  dotColor: string;
  glowColor: string;
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
  label = 'Listen on Research of 264 — Ans/t',
  logNote = 'Experimental calibration activities of the system in the lab before integration.',
}: TimelineStripProps) {
  const prefersReducedMotion = useReducedMotion();

  const milestones: TimelineMilestone[] = [
    {
      id: 'commence',
      position: 0,
      date: startDate,
      title: 'Calibration Commencement',
      note: 'Baseline noise-floor characterization and FPGA readout clock synchronization.',
      dotColor: 'bg-cyan-400',
      glowColor: 'rgba(34, 211, 238, 0.75)',
    },
    {
      id: 'tuning',
      position: 28,
      date: 'OCT 05, 2026',
      title: 'Detector Array Tuning',
      note: 'Bias sweep across sub-Kelvin bolometer channels and crosstalk verification.',
      dotColor: 'bg-amber-400',
      glowColor: 'rgba(251, 191, 36, 0.75)',
    },
    {
      id: 'cooling',
      position: 58,
      date: 'OCT 19, 2026',
      title: 'Cryostat Cooling Milestones',
      note: 'Thermal stability verification at 300 mK stage prior to optical window sealing.',
      dotColor: 'bg-orange-400',
      glowColor: 'rgba(251, 146, 60, 0.75)',
    },
    {
      id: 'integration',
      position: 100,
      date: endDate,
      title: label,
      note: logNote,
      dotColor: 'bg-indigo-400',
      glowColor: 'rgba(129, 140, 248, 0.75)',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(milestones.length - 1);
  const active = milestones[activeIndex];

  return (
    <section className="container-wide py-12 md:py-16" aria-label="Research Timeline">
      <div className="flex flex-col gap-5 py-6 px-4 sm:px-8 border-y border-[color:var(--border)] bg-[color:var(--bg)]">
        {/* Progress Timeline Track */}
        <div className="flex items-center gap-4 sm:gap-6 w-full">
          <span className="font-mono text-[11px] sm:text-xs text-[color:var(--text-muted)] tracking-wider whitespace-nowrap">
            {startDate}
          </span>

          <div className="relative flex-1 h-[2px] bg-[color:var(--border)] flex items-center" role="tablist" aria-label="Research milestones">
            <motion.div
              className="absolute left-0 top-0 h-full bg-[color:var(--accent)]"
              animate={{ width: `${active.position}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 280, damping: 28 }
              }
              aria-hidden="true"
            />
            {milestones.map((milestone, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={milestone.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${milestone.title} (${milestone.date})`}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  style={{ left: `${milestone.position}%` }}
                  className="absolute -translate-x-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] cursor-pointer group"
                >
                  <span
                    className={`block rounded-full transition-transform duration-200 ${milestone.dotColor} ${
                      isSelected ? 'w-3 h-3 scale-110' : 'w-2.5 h-2.5 opacity-80 group-hover:scale-125 group-hover:opacity-100'
                    }`}
                    style={{
                      boxShadow: isSelected
                        ? `0 0 14px 4px ${milestone.glowColor}`
                        : `0 0 8px 2px ${milestone.glowColor}`,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-[color:var(--text-muted)] tracking-wider whitespace-nowrap">
            {endDate}
          </span>
        </div>

        {/* Interactive Milestone Log Note */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 pl-0 sm:pl-1"
            aria-live="polite"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[color:var(--accent-text)] shrink-0 font-medium">
                {active.title}
              </span>
              <p className="text-xs sm:text-sm text-[color:var(--text)] font-sans tracking-tight">
                {active.note}
              </p>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[color:var(--text-muted)] uppercase shrink-0">
              {active.date} · NODE {activeIndex + 1}/{milestones.length}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
