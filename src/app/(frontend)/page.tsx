import React from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { HeroMasthead } from '@/components/HeroMasthead';
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
      {/* 1. HERO SECTION — Centered Masthead with Orbiting Telemetry Satellites */}
      <HeroMasthead
        totalProjectsCount={totalProjectsCount}
        totalPostsCount={totalPostsCount}
      />

      {/* 2. FEATURED PROJECT SECTION */}
      <Reveal>
        <section id="featured-project" className="container-wide py-12 lg:py-16 border-b border-[color:var(--border)] scroll-mt-20" aria-labelledby="featured-project-heading">
          {/* Section Label */}
          <div className="mb-6">
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
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <span id="right-now-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
              RIGHT NOW
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
              <span>ACTIVE · UPDATED NOV 2026</span>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)] rounded-[var(--radius-s)] flex flex-col justify-between gap-4 transition-colors duration-200">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">STUDYING</span>
                <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                  {currentState?.studying || 'Quantum error correction & superconducting qubit readout topologies.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[color:var(--border)] font-mono text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">
                QUBIT READOUT
              </div>
            </div>
            <div className="p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)] rounded-[var(--radius-s)] flex flex-col justify-between gap-4 transition-colors duration-200">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">BUILDING</span>
                <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                  {currentState?.building || 'Low-latency FPGA DSP pipelines for radio interferometry and telemetry.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[color:var(--border)] font-mono text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">
                VIVADO RTL
              </div>
            </div>
            <div className="p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)] rounded-[var(--radius-s)] flex flex-col justify-between gap-4 transition-colors duration-200">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">READING</span>
                <p className="text-sm sm:text-base text-[color:var(--text)] leading-relaxed">
                  {currentState?.reading || 'Misner, Thorne & Wheeler — Gravitation, alongside cryogenic RF design notes.'}
                </p>
              </div>
              <div className="pt-3 border-t border-[color:var(--border)] font-mono text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">
                MTW GRAVITATION
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3.85 RECENT DISPATCHES — LATEST WRITING */}
      {recentPosts.length > 0 && (
        <Reveal>
          <section className="container-wide py-12 lg:py-16 border-b border-[color:var(--border)]" aria-labelledby="recent-writing-heading">
            <div className="flex items-center justify-between mb-6">
              <span id="recent-writing-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
                RECENT DISPATCHES
              </span>
              <Link href="/writing" className="font-mono text-xs uppercase tracking-wider text-[color:var(--accent-text)] hover:underline" style={{ textDecoration: 'none' }}>
                VIEW ALL WRITING →
              </Link>
            </div>

            {recentPosts.length < 3 ? (
              <div className="flex flex-col gap-5">
                {recentPosts.map((post) => {
                  const dateLabel = post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                    : 'ESSAY';
                  const postTopics = ((post.topics as unknown[]) ?? [])
                    .map((t) => (typeof t === 'object' && t !== null && 'name' in t ? String((t as { name: string }).name).toUpperCase() : ''))
                    .filter(Boolean)
                    .slice(0, 3);

                  return (
                    <article
                      key={post.id}
                      className="group grid grid-cols-1 lg:grid-cols-[65fr_35fr] border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)] rounded-[var(--radius-s)] overflow-hidden transition-colors"
                    >
                      <div className="p-6 sm:p-8 flex flex-col justify-between gap-4">
                        <div>
                          <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl leading-snug text-[color:var(--text)] group-hover:text-[color:var(--accent-text)] transition-colors">
                            <Link href={`/writing/${post.slug}`} style={{ textDecoration: 'none' }}>
                              {post.title}
                            </Link>
                          </h3>
                          {post.excerpt && (
                            <p className="mt-3 text-sm sm:text-base text-[color:var(--text-muted)] leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/writing/${post.slug}`}
                            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-[color:var(--accent-text)]"
                            style={{ textDecoration: 'none' }}
                          >
                            <span>READ ESSAY</span>
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                          </Link>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8 bg-[color:var(--bg-subtle)] border-t lg:border-t-0 lg:border-l border-[color:var(--border)] flex flex-col justify-between gap-4 font-mono">
                        <div className="flex items-center justify-between gap-4 text-[11px] tracking-wider text-[color:var(--text-muted)]">
                          <span>{dateLabel}</span>
                          <span className="text-[color:var(--text)] font-medium">{post.reading_time ?? 1} MIN READ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {postTopics.length > 0 ? (
                            postTopics.map((topic) => (
                              <span
                                key={topic}
                                className="px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[10px] tracking-wider text-[color:var(--accent-text)]"
                              >
                                {topic}
                              </span>
                            ))
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[10px] tracking-wider text-[color:var(--accent-text)]">
                              MONOGRAPH
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentPosts.map((post) => {
                  const dateLabel = post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                    : 'ESSAY';
                  return (
                    <article
                      key={post.id}
                      className="group flex flex-col justify-between p-6 border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)] rounded-[var(--radius-s)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
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
            )}
          </section>
        </Reveal>
      )}

      {/* 4. BIOGRAPHY SECTION */}
      <Reveal>
        <section className="container-wide py-12 lg:py-16 border-b border-[color:var(--border)]" aria-labelledby="biography-heading">
          {/* Section Label */}
          <div className="mb-6">
            <span id="biography-heading" className="font-mono text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
              BIOGRAPHY
            </span>
          </div>

          {/* 2-Column Split: Left portrait with architectural grid & warm tonal framing, Right editorial serif statement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Portrait with crisp 1px hairline border & tonal framing */}
            <div className="lg:col-span-5 relative p-5 sm:p-8 architectural-grid bg-[color:var(--bg-subtle)] border border-[color:var(--border)] rounded-[var(--radius-s)] flex items-center justify-center">
              <figure className="relative w-full max-w-sm overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-1.5 shadow-sm">
                <Image
                  src={bioPortraitUrl}
                  alt={bioPortraitAlt}
                  width={650}
                  height={650}
                  className="w-full h-auto object-cover rounded-[var(--radius-s)] transform hover:scale-[1.02] transition-transform duration-500 ease-out"
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
