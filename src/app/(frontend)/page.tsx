import React from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { HeroNebula } from '@/components/HeroNebula';
import { FeaturedProjectCard } from '@/components/FeaturedProjectCard';
import { TimelineStrip } from '@/components/TimelineStrip';
import { Reveal } from '@/components/Reveal';
import { getSiteSettings, getCurrentState, getProfile, getFeaturedProjects, getProjects, getPosts, getRecentPosts } from '@/lib/content';
import type { Project, Post, SiteSetting, Profile, CurrentState } from '@/payload-types';

export default async function Home() {
  let siteSettings: SiteSetting | null = null;
  let currentState: CurrentState | null = null;
  let profile: Profile | null = null;
  let featuredProjects: Project[] = [];
  let recentPosts: Post[] = [];
  let totalProjectsCount = 0;
  let totalPostsCount = 0;

  try {
    const results = await Promise.allSettled([
      getSiteSettings(),
      getCurrentState(),
      getProfile(),
      getFeaturedProjects(1),
      getProjects(1, 1),
      getPosts(1, 1),
      getRecentPosts(3),
    ]);

    if (results[0].status === 'fulfilled') siteSettings = results[0].value;
    if (results[1].status === 'fulfilled') currentState = results[1].value;
    if (results[2].status === 'fulfilled') profile = results[2].value;
    if (results[3].status === 'fulfilled') featuredProjects = results[3].value;
    if (results[4].status === 'fulfilled') totalProjectsCount = results[4].value.totalDocs;
    if (results[5].status === 'fulfilled') totalPostsCount = results[5].value.totalDocs;
    if (results[6].status === 'fulfilled') recentPosts = results[6].value;
  } catch (error) {
    console.warn('Content fallback applied:', error);
  }

  const featuredProject = featuredProjects.length > 0 ? featuredProjects[0] : null;

  // Biography defaults matching reference
  const bioPortraitUrl = (profile?.photograph && typeof profile.photograph === 'object' && profile.photograph.url) 
    ? profile.photograph.url 
    : '/images/admin/portrait_manoj.png';
  const bioPortraitAlt = (profile?.photograph && typeof profile.photograph === 'object' && profile.photograph.alt_text)
    ? profile.photograph.alt_text
    : 'Researcher in observatory laboratory';
  const bioHeading = profile?.introduction || 'Researcher working at the intersection of embedded hardware, scientific computing, and observational astrophysics.';
  const bioSummary = profile?.current_focus || 'Designing cryogenic sensor readout circuits and gravitational wave data analysis pipelines.';

  // Timeline note
  const timelineNote = currentState?.studying || currentState?.building || 'Experimental calibration activities of the system in the lab before integration.';

  return (
    <div className="w-full bg-[color:var(--bg)] text-[color:var(--text)] overflow-hidden">
      {/* 1. HERO SECTION — Centered Scientific Editorial Layout */}
      <section 
        className="relative w-full min-h-[78vh] lg:min-h-[84vh] flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20 border-b border-[color:var(--border)]"
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

        {/* Centered Editorial Stack */}
        <div className="container-wide relative z-10 w-full">
          <div className="mx-auto max-w-[860px] flex flex-col items-center text-center gap-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/75 [backdrop-filter:blur(8px)] font-mono text-[12.5px] tracking-widest uppercase text-[color:var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" aria-hidden="true" />
              <span>ECE × PHYSICS × ASTROPHYSICS</span>
            </div>

            {/* Display Title */}
            <h1 
              id="hero-title"
              className="font-[family-name:var(--font-display)] font-light tracking-[-0.03em] leading-[1.05] text-[color:var(--text)]"
              style={{ fontSize: 'clamp(3.75rem, 6.5vw, 5.75rem)' }}
            >
              ZeroAbstraction
            </h1>

            {/* Subtitle */}
            <p className="text-[19px] sm:text-[20px] text-[color:var(--text-muted)] font-normal leading-[1.6] max-w-[60ch] font-sans">
              First-principles digital garden &amp; engineering archive bridging low-level hardware, scientific computing, and observational astrophysics.
            </p>

            {/* Primary CTA Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
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

            {/* 3-Column Research Pillars Strip */}
            <div className="w-full mt-2 py-5 px-4 sm:px-6 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]/60 [backdrop-filter:blur(8px)] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-[color:var(--border)] text-left">
              <div className="md:pr-6 flex flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-widest uppercase text-[color:var(--accent-text)] font-medium">
                  01 // EMBEDDED &amp; FPGA
                </span>
                <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
                  Cryogenic readout electronics, RTL pipelines &amp; sensor firmware.
                </p>
              </div>
              <div className="md:px-6 flex flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-widest uppercase text-[color:var(--accent-text)] font-medium">
                  02 // SCIENTIFIC COMPUTING
                </span>
                <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
                  Gravitational lensing ray-tracing, DSP &amp; numerical solvers.
                </p>
              </div>
              <div className="md:pl-6 flex flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-widest uppercase text-[color:var(--accent-text)] font-medium">
                  03 // ASTROPHYSICS
                </span>
                <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
                  Submillimeter polarimetry, CMB instrumentation &amp; transit analysis.
                </p>
              </div>
            </div>

            {/* Single Horizontal Navigation / Index Strip */}
            <nav
              aria-label="Hero quick index"
              className="pt-2 flex items-center justify-center flex-wrap gap-x-3 gap-y-2 font-mono text-xs text-[color:var(--text-muted)] tracking-wider uppercase"
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
            <div className="pt-2">
              <a
                href="#featured-project"
                className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-widest text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <span>SCROLL TO DISCOVER</span>
                <span aria-hidden="true" className="inline-block animate-gentle-bob transition-transform duration-200 group-hover:translate-y-1">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROJECT SECTION */}
      <Reveal>
        <section id="featured-project" className="container-wide py-16 lg:py-24 border-b border-[color:var(--border)] scroll-mt-20" aria-labelledby="featured-project-heading">
          {/* Section Label */}
          <div className="mb-8">
            <span id="featured-project-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
              FEATURED PROJECT
            </span>
          </div>

          {/* 50/50 Asymmetric Two-Column Layout */}
          <FeaturedProjectCard project={featuredProject} />
        </section>
      </Reveal>

      {/* 3. TIMELINE STRIP SECTION */}
      <Reveal>
        <TimelineStrip 
          startDate="SEP 24, 2026"
          endDate="1 NOV 2026"
          label="Listen on Research of 264 — Ans/t"
          logNote={timelineNote}
        />
      </Reveal>

      {/* 3.5 RIGHT NOW — LIVE LAB STATE BENTO */}
      <Reveal>
        <section className="container-wide py-12 lg:py-16 border-b border-[color:var(--border)]" aria-labelledby="right-now-heading">
          <div className="flex items-center justify-between mb-6">
            <span id="right-now-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" aria-hidden="true" />
              RIGHT NOW
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)]">
              ACTIVE BENCH LOG
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">STUDYING</span>
              <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                {currentState?.studying || 'Quantum error correction & superconducting qubit readout topologies.'}
              </p>
            </div>
            <div className="p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">BUILDING</span>
              <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                {currentState?.building || 'Low-latency FPGA DSP pipelines for radio interferometry and telemetry.'}
              </p>
            </div>
            <div className="p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] flex flex-col gap-2 transition-all duration-200 hover:-translate-y-0.5">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">READING</span>
              <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                {currentState?.reading || 'Misner, Thorne & Wheeler — Gravitation, alongside cryogenic RF design notes.'}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3.85 RECENT DISPATCHES — LATEST WRITING */}
      {recentPosts.length > 0 && (
        <Reveal>
          <section className="container-wide py-16 lg:py-20 border-b border-[color:var(--border)]" aria-labelledby="recent-writing-heading">
            <div className="flex items-center justify-between mb-8">
              <span id="recent-writing-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
                RECENT DISPATCHES
              </span>
              <Link href="/writing" className="font-mono text-xs uppercase tracking-wider text-[color:var(--accent-text)] hover:underline">
                VIEW ALL WRITING →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => {
                const dateLabel = post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                  : 'ESSAY';
                return (
                  <article
                    key={post.id}
                    className="group flex flex-col justify-between p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)]/50 rounded-[var(--radius-s)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[11px] text-[color:var(--text-muted)] tracking-wider mb-3">
                        <span>{dateLabel}</span>
                        <span>{post.reading_time ?? 1} MIN READ</span>
                      </div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl leading-snug text-[color:var(--text)] group-hover:text-[color:var(--accent-text)] transition-colors">
                        <Link href={`/writing/${post.slug}`} style={{ textDecoration: 'none' }}>
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 text-sm text-[color:var(--text-muted)] line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/writing/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-[color:var(--accent-text)]"
                      style={{ textDecoration: 'none' }}
                    >
                      <span>READ ESSAY</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* 4. BIOGRAPHY SECTION */}
      <Reveal>
        <section className="container-wide py-16 lg:py-24 border-b border-[color:var(--border)]" aria-labelledby="biography-heading">
          {/* Section Label */}
          <div className="mb-8">
            <span id="biography-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
              BIOGRAPHY
            </span>
          </div>

          {/* 2-Column Split: Left portrait with architectural grid, Right editorial serif statement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Portrait with Architectural Grid */}
            <div className="lg:col-span-5 relative p-6 sm:p-10 lg:p-12 architectural-grid border border-[color:var(--border)]/40 rounded-[var(--radius-s)] flex items-center justify-center">
              <figure className="relative w-full max-w-sm overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] shadow-md bg-stone-900">
                <Image
                  src={bioPortraitUrl}
                  alt={bioPortraitAlt}
                  width={650}
                  height={650}
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
              </figure>
            </div>

            {/* Right Column: Editorial Serif Statement + Summary + Solid Slate-Blue CTA Button */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 max-w-xl">
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-light leading-[1.2] text-[color:var(--text)]">
                {bioHeading}
              </h2>

              <p className="text-[color:var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans">
                {bioSummary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href="/about" className="btn-cta-solid">
                  <span>READ FULL STORY</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/projects"
                  className="min-h-[44px] inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <span>EXPLORE PROJECTS</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className="font-mono text-[11px] tracking-widest uppercase text-[color:var(--text-muted)]/80 pt-1">
                JNTU ANANTAPUR • 14.68° N, 77.60° E
              </p>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
