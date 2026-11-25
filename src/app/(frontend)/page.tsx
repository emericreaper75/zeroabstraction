import React from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { HeroNebula } from '@/components/HeroNebula';
import { HeroTelemetry } from '@/components/HeroTelemetry';
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
      {/* 1. HERO SECTION — Scientific Editorial Layout */}
      <section 
        className="relative w-full min-h-[85vh] lg:min-h-[88vh] flex items-center justify-between overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-[color:var(--border)]"
        aria-labelledby="hero-title"
      >
        {/* Upper-Right Half: Subtle pastel particle/nebula canvas & architectural grid seamlessly blended */}
        <div 
          className="absolute top-0 right-0 w-full sm:w-4/5 lg:w-3/5 h-full pointer-events-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <HeroNebula className="w-full h-full" />
        </div>

        {/* Hero Content Grid */}
        <div className="container-wide relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 max-w-2xl flex flex-col items-start gap-4">
            {/* Live Research Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/70 [backdrop-filter:blur(8px)] font-mono text-[11px] tracking-widest uppercase text-[color:var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse" aria-hidden="true" />
              <span>ECE × PHYSICS × ASTROPHYSICS</span>
            </div>

            {/* Title: Left-aligned Serif Display */}
            <h1 
              id="hero-title"
              className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light leading-[0.98] tracking-tight text-[color:var(--text)]"
            >
              ZeroAbstraction
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[color:var(--text-muted)] font-normal leading-relaxed max-w-xl font-sans mt-2">
              {siteSettings?.short_bio || 'Digital garden & research universe exploring physics, ECE, and astrophysics.'}
            </p>

            {/* Metadata Tags Rows */}
            <div className="flex flex-col gap-2 mt-4 font-mono text-xs text-[color:var(--text-muted)] tracking-wider uppercase">
              <div className="flex items-center flex-wrap gap-3">
                <Link href="/projects" className="hover:text-[color:var(--accent-text)] transition-colors">PROJECTS</Link>
                <span>•</span>
                <span className="font-semibold text-[color:var(--text)]">{totalProjectsCount || 1}</span>
                <span>•</span>
                <Link href="/writing" className="hover:text-[color:var(--accent-text)] transition-colors">WRITING</Link>
                <span>•</span>
                <span className="font-semibold text-[color:var(--text)]">{totalPostsCount || 1}</span>
              </div>
              <div className="flex items-center flex-wrap gap-3">
                <Link href="/about" className="hover:text-[color:var(--accent-text)] transition-colors">BIOGRAPHY</Link>
                <span>•</span>
                <Link href="/search" className="hover:text-[color:var(--accent-text)] transition-colors">SEARCH ARCHIVE</Link>
              </div>
            </div>

            {/* SCROLL TO DISCOVER Interactive Anchor */}
            <div className="pt-10 lg:pt-14">
              <a
                href="#featured-project"
                className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-widest text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <span>SCROLL TO DISCOVER</span>
                <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-y-1">↓</span>
              </a>
            </div>
          </div>

          {/* Hero Right: Interactive Observatory Telemetry Panel */}
          <div className="lg:col-span-5">
            <HeroTelemetry />
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
            <div className="p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">STUDYING</span>
              <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                {currentState?.studying || 'Quantum error correction & superconducting qubit readout topologies.'}
              </p>
            </div>
            <div className="p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">BUILDING</span>
              <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                {currentState?.building || 'Low-latency FPGA DSP pipelines for radio interferometry and telemetry.'}
              </p>
            </div>
            <div className="p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">READING</span>
              <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                {currentState?.reading || 'Misner, Thorne & Wheeler — Gravitation, alongside cryogenic RF design notes.'}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3.75 RECENT DISPATCHES — LATEST WRITING */}
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
                    className="group flex flex-col justify-between p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)]/50 rounded-[var(--radius-s)] transition-colors"
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
