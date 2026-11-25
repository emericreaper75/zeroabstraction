import React from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { HeroNebula } from '@/components/HeroNebula';
import { FeaturedProjectCard } from '@/components/FeaturedProjectCard';
import { TimelineStrip } from '@/components/TimelineStrip';
import { Reveal } from '@/components/Reveal';
import { getSiteSettings, getCurrentState, getProfile, getFeaturedProjects } from '@/lib/content';
import type { Project, SiteSetting, Profile, CurrentState } from '@/payload-types';

export default async function Home() {
  let siteSettings: SiteSetting | null = null;
  let currentState: CurrentState | null = null;
  let profile: Profile | null = null;
  let featuredProjects: Project[] = [];

  try {
    const results = await Promise.allSettled([
      getSiteSettings(),
      getCurrentState(),
      getProfile(),
      getFeaturedProjects(1),
    ]);

    if (results[0].status === 'fulfilled') siteSettings = results[0].value;
    if (results[1].status === 'fulfilled') currentState = results[1].value;
    if (results[2].status === 'fulfilled') profile = results[2].value;
    if (results[3].status === 'fulfilled') featuredProjects = results[3].value;
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

        {/* Hero Left Content */}
        <div className="container-wide relative z-10 w-full flex flex-col items-start">
          <div className="max-w-2xl flex flex-col items-start gap-4">
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
              <div className="flex items-center gap-3">
                <Link href="/projects" className="hover:text-[color:var(--text)] transition-colors">PROJECTS</Link>
                <span>•</span>
                <span className="font-semibold text-[color:var(--text)]">46</span>
                <span>•</span>
                <Link href="/about" className="hover:text-[color:var(--text)] transition-colors">BIOGRAPHY</Link>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/about" className="hover:text-[color:var(--text)] transition-colors">ABOUT</Link>
                <span>•</span>
                <Link href="/writing" className="hover:text-[color:var(--text)] transition-colors">WRITING</Link>
                <span>•</span>
                <Link href="/writing" className="hover:text-[color:var(--text)] transition-colors">ARCHIVE</Link>
              </div>
            </div>

            {/* SCROLL TO DISCOVER Prompt */}
            <div className="pt-10 lg:pt-14">
              <span className="font-mono text-xs tracking-widest text-[color:var(--text-muted)] select-none flex items-center gap-2">
                SCROLL TO DISCOVER ↓
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROJECT SECTION */}
      <Reveal>
        <section className="container-wide py-16 lg:py-24 border-b border-[color:var(--border)]" aria-labelledby="featured-project-heading">
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

              <div className="pt-2">
                <Link href="/about" className="btn-cta-solid">
                  <span>READ FULL STORY</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
