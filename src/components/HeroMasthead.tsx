'use client';

import React, { useState } from 'react';
import { Link } from 'next-view-transitions';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HeroNebula } from '@/components/HeroNebula';

interface SatelliteNode {
  id: 'tl' | 'bl' | 'tr' | 'br';
  code: string;
  title: string;
  href: string;
  positionClass: string;
  floatDuration: number;
  floatDelay: number;
  bezierPath: string;
  pulseDuration: string;
  sparkline: React.ReactNode;
}

const SATELLITES: SatelliteNode[] = [
  {
    id: 'tl',
    code: 'ASTRO // 150 GHz',
    title: 'CMB Sub-Kelvin Polarimetry',
    href: '/projects',
    positionClass: 'top-[13%] left-3 xl:left-6',
    floatDuration: 6.4,
    floatDelay: 0,
    bezierPath: 'M 215 140 C 340 155, 410 220, 495 275',
    pulseDuration: '6.5s',
    sparkline: (
      <svg viewBox="0 0 140 28" className="w-full h-6" aria-hidden="true">
        <path
          d="M 2 14 Q 16 3, 30 14 T 58 14 T 86 14 T 114 14 T 138 14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'bl',
    code: 'FPGA // AXI-STREAM',
    title: 'Low-Latency DSP Readout',
    href: '/projects',
    positionClass: 'bottom-[17%] left-3 xl:left-8',
    floatDuration: 7.2,
    floatDelay: 0.9,
    bezierPath: 'M 215 415 C 335 395, 415 345, 495 305',
    pulseDuration: '7.4s',
    sparkline: (
      <svg viewBox="0 0 140 28" className="w-full h-6" aria-hidden="true">
        <path
          d="M 2 22 L 18 22 L 18 6 L 38 6 L 38 22 L 58 22 L 58 6 L 78 6 L 78 22 L 98 22 L 98 6 L 118 6 L 118 22 L 138 22"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'tr',
    code: 'COMPUTE // ΛCDM',
    title: 'Gravitational Ray Tracing',
    href: '/writing',
    positionClass: 'top-[13%] right-3 xl:right-6',
    floatDuration: 6.9,
    floatDelay: 0.45,
    bezierPath: 'M 985 140 C 860 155, 790 220, 705 275',
    pulseDuration: '7.0s',
    sparkline: (
      <svg viewBox="0 0 140 28" className="w-full h-6" aria-hidden="true">
        <path
          d="M 4 22 Q 70 2, 136 22"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="70" cy="14" r="2.5" fill="var(--secondary)" />
      </svg>
    ),
  },
  {
    id: 'br',
    code: 'ORBITAL // TRANSIT',
    title: 'WASP-39b Light Curve',
    href: '/writing',
    positionClass: 'bottom-[17%] right-3 xl:right-8',
    floatDuration: 7.8,
    floatDelay: 1.2,
    bezierPath: 'M 985 415 C 865 395, 785 345, 705 305',
    pulseDuration: '7.8s',
    sparkline: (
      <svg viewBox="0 0 140 28" className="w-full h-6" aria-hidden="true">
        <path
          d="M 2 7 L 42 7 C 50 7, 54 22, 62 22 L 78 22 C 86 22, 90 7, 98 7 L 138 7"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

interface HeroMastheadProps {
  totalProjectsCount: number;
  totalPostsCount: number;
}

export function HeroMasthead({ totalProjectsCount, totalPostsCount }: HeroMastheadProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Damped pointer parallax (±6px max shift)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const parallaxX = useSpring(rawX, { stiffness: 120, damping: 24 });
  const parallaxY = useSpring(rawY, { stiffness: 120, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawX.set(nx * 6);
    rawY.set(ny * 6);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[82vh] lg:min-h-[86vh] flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20 border-b border-[color:var(--border)]"
      aria-labelledby="hero-title"
    >
      {/* Full-Width Cosmic Particle Canvas fading smoothly at the bottom */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, black 68%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 68%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        <HeroNebula className="w-full h-full" />
      </div>

      {/* Underlying Full-Bleed Dotted SVG Constellation Arcs (Desktop lg+) */}
      <svg
        viewBox="0 0 1200 560"
        preserveAspectRatio="none"
        className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full z-[1]"
        aria-hidden="true"
      >
        {SATELLITES.map((sat) => {
          const isHighlighted = hoveredId === sat.id;
          return (
            <g key={sat.id}>
              <path
                d={sat.bezierPath}
                fill="none"
                stroke={isHighlighted ? 'var(--accent)' : 'var(--border-strong)'}
                strokeWidth={isHighlighted ? '1.25' : '1'}
                strokeDasharray="2 4"
                opacity={isHighlighted ? 0.85 : 0.45}
                style={{ transition: 'stroke 200ms ease, opacity 200ms ease' }}
              />
              {!prefersReducedMotion && (
                <circle r="2.2" fill="var(--accent)" opacity={isHighlighted ? 1 : 0.7}>
                  <animateMotion dur={sat.pulseDuration} repeatCount="indefinite" path={sat.bezierPath} />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Main Content Container */}
      <div className="container-wide relative z-10 w-full">
        {/* Desktop Orbiting Satellite Cards (outside 680px safe zone) */}
        <motion.div
          style={prefersReducedMotion ? undefined : { x: parallaxX, y: parallaxY }}
          className="hidden lg:block pointer-events-none absolute inset-0"
        >
          {SATELLITES.map((sat, idx) => {
            const isHovered = hoveredId === sat.id;
            return (
              <motion.div
                key={sat.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: prefersReducedMotion || isHovered ? 0 : [-4, 4, -4],
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : isHovered
                      ? { duration: 0.25, ease: 'easeOut' }
                      : {
                          opacity: { duration: 0.5, delay: 0.35 + idx * 0.08, ease: [0.22, 1, 0.36, 1] },
                          y: {
                            duration: sat.floatDuration,
                            delay: sat.floatDelay,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }
                }
                className={`pointer-events-auto absolute ${sat.positionClass} w-[188px] xl:w-[205px]`}
              >
                <Link
                  href={sat.href}
                  onMouseEnter={() => setHoveredId(sat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(sat.id)}
                  onBlur={() => setHoveredId(null)}
                  style={{ textDecoration: 'none' }}
                  className={`block rounded-lg border p-3.5 bg-[color:var(--surface)]/75 [backdrop-filter:blur(8px)] transition-colors duration-200 ${
                    isHovered
                      ? 'border-[color:var(--accent)] shadow-md'
                      : 'border-[color:var(--border)] hover:border-[color:var(--accent-border)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-[color:var(--accent-text)]">
                      {sat.code}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isHovered ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--secondary)]'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-base leading-snug text-[color:var(--text)] mb-2">
                    {sat.title}
                  </p>
                  {sat.sparkline}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Centered Focal Stack (max-width: 680px safe zone) */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[540px] xl:max-w-[680px] flex flex-col items-center text-center"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/75 [backdrop-filter:blur(8px)] font-mono text-[12.5px] tracking-[0.14em] uppercase text-[color:var(--text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" aria-hidden="true" />
            <span>ECE × PHYSICS × ASTROPHYSICS</span>
          </div>

          {/* Display Title */}
          <h1
            id="hero-title"
            className="mt-5 font-[family-name:var(--font-display)] font-light tracking-[-0.03em] leading-[1.05] text-[color:var(--text)]"
            style={{ fontSize: 'clamp(3.75rem, 6.5vw, 5.75rem)' }}
          >
            ZeroAbstraction
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-[19px] sm:text-[20px] text-[color:var(--text-muted)] font-normal leading-relaxed max-w-[58ch] font-sans">
            First-principles digital garden &amp; engineering archive bridging low-level hardware, scientific computing, and observational astrophysics.
          </p>

          {/* Primary Action Row */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/projects"
              style={{ textDecoration: 'none' }}
              className="min-h-[44px] px-6 py-2.5 rounded-full inline-flex items-center gap-2 bg-[color:var(--btn-cta-bg)] hover:bg-[color:var(--btn-cta-hover)] text-[color:var(--btn-cta-fg)] font-mono text-xs tracking-[0.11em] uppercase font-medium transition-all duration-150 active:scale-[0.97] shadow-sm"
            >
              <span>EXPLORE SYSTEMS</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/writing"
              style={{ textDecoration: 'none' }}
              className="min-h-[44px] px-6 py-2.5 rounded-full inline-flex items-center gap-2 border border-[color:var(--border-strong)] bg-[color:var(--surface)]/70 hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] text-[color:var(--text)] font-mono text-xs tracking-[0.11em] uppercase font-medium transition-all duration-150 active:scale-[0.97]"
            >
              <span>READ FIELD NOTES</span>
            </Link>
          </div>

          {/* Mobile/Tablet 2x2 Satellite Grid (< lg) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:hidden text-left">
            {SATELLITES.map((sat) => (
              <Link
                key={sat.id}
                href={sat.href}
                style={{ textDecoration: 'none' }}
                className="block rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]/75 [backdrop-filter:blur(8px)] p-3.5 hover:border-[color:var(--accent-border)] transition-colors"
              >
                <span className="block font-mono text-[10px] tracking-widest uppercase text-[color:var(--accent-text)] mb-1">
                  {sat.code}
                </span>
                <p className="font-[family-name:var(--font-display)] text-base leading-snug text-[color:var(--text)] mb-2">
                  {sat.title}
                </p>
                {sat.sparkline}
              </Link>
            ))}
          </div>

          {/* Index Metadata Strip */}
          <nav
            aria-label="Hero quick index"
            className="mt-7 flex items-center justify-center flex-wrap gap-x-3 gap-y-2 font-mono text-xs text-[color:var(--text-muted)] tracking-wider uppercase"
          >
            <Link href="/projects" className="hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
              PROJECTS · <span className="font-semibold text-[color:var(--text)]">{totalProjectsCount || 1}</span>
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/writing" className="hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
              WRITING · <span className="font-semibold text-[color:var(--text)]">{totalPostsCount || 1}</span>
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/about" className="hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
              BIOGRAPHY
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/search" className="hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
              SEARCH ARCHIVE
            </Link>
          </nav>

          {/* Centered Scroll Cue */}
          <div className="mt-8">
            <a
              href="#featured-project"
              className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-widest text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors"
              style={{ textDecoration: 'none' }}
            >
              <span>SCROLL TO DISCOVER</span>
              <span aria-hidden="true" className="inline-block animate-gentle-bob transition-transform duration-200 group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
