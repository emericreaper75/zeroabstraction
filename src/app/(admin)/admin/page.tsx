import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function AdminDashboard() {
  await requireUser();

  const payload = await getPayload({ config: configPromise })

  const [postsResult, projectsResult, mediaResult, topicsResult] = await Promise.all([
    payload.find({ collection: 'posts', limit: 5, sort: '-updatedAt' }),
    payload.count({ collection: 'projects' }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'topics' }),
  ])

  const postsCount = postsResult.totalDocs
  const projectsCount = projectsResult.totalDocs
  const mediaCount = mediaResult.totalDocs
  const draftsCount = postsResult.docs.filter((p: any) => p._status === 'draft' || !p.published_at).length

  // Get current state
  let currentState: any = null
  try {
    currentState = await payload.findGlobal({ slug: 'current-state' })
  } catch { /* no current state yet */ }

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="space-y-10">
      {/* Welcome Editorial Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[color:var(--border)] pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-label-sm font-label-sm text-[color:var(--accent-text)] border border-[color:var(--accent-border)] px-2 py-0.5 bg-[color:var(--accent-subtle)] rounded">
              OBSERVATORY WORKBENCH
            </span>
            <span className="text-label-sm font-label-sm text-[color:var(--text-muted)] font-normal">{'//'} CANONICAL ARCHIVE</span>
          </div>
          <h1 className="font-headline-md text-headline-xl text-[color:var(--text)] italic font-normal tracking-tight">
            Good evening, Manoj
          </h1>
          <p className="font-body-md text-body-md text-[color:var(--text-muted)] mt-1 font-light">
            Here&apos;s what&apos;s happening in your universe.
          </p>
        </div>
        {/* Live Epoch Chip */}
        <div className="shrink-0 flex items-center gap-2.5 p-2 px-3.5 border border-[color:var(--border)] bg-[color:var(--bg-subtle)] shadow-xs rounded">
          <span className="w-2 h-2 rounded-full bg-[color:var(--success)]" />
          <span className="font-label-md text-label-md text-[color:var(--text)] tracking-wider">
            EPOCH 2025.2 // SKY CLEAR
          </span>
        </div>
      </div>

      {/* Inline Metrics Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[color:var(--border)] bg-[color:var(--bg-subtle)] shadow-xs rounded overflow-hidden">
        {/* Metric 1: Total Posts */}
        <div className="p-5 border-b lg:border-b-0 border-r border-[color:var(--border)] hover:bg-[color:var(--surface-hover)] transition-colors group">
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>TOTAL POSTS</span>
            <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]/50 group-hover:text-[color:var(--accent-text)] transition-colors">notes</span>
          </div>
          <div className="font-headline-md text-headline-lg text-[color:var(--text)] my-1 leading-none">{pad(postsCount)}</div>
          <div className="text-label-sm font-label-sm text-[color:var(--accent-text)] mt-2 flex items-center gap-1 font-medium">
            <span>Published &amp; drafts</span>
          </div>
        </div>
        {/* Metric 2: Published Projects */}
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-[color:var(--border)] hover:bg-[color:var(--surface-hover)] transition-colors group">
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>PUBLISHED PROJECTS</span>
            <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]/50 group-hover:text-[color:var(--accent-text)] transition-colors">solar_power</span>
          </div>
          <div className="font-headline-md text-headline-lg text-[color:var(--text)] my-1 leading-none">{pad(projectsCount)}</div>
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] mt-2">
            Astrophotography &amp; Code
          </div>
        </div>
        {/* Metric 3: Media Files */}
        <div className="p-5 border-r border-[color:var(--border)] hover:bg-[color:var(--surface-hover)] transition-colors group">
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>MEDIA ASSETS</span>
            <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]/50 group-hover:text-[color:var(--accent-text)] transition-colors">perm_media</span>
          </div>
          <div className="font-headline-md text-headline-lg text-[color:var(--text)] my-1 leading-none">{mediaCount}</div>
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] mt-2">
            FITS &amp; RAW plates
          </div>
        </div>
        {/* Metric 4: Draft Manuscripts */}
        <div className="p-5 hover:bg-[color:var(--surface-hover)] transition-colors group">
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>DRAFT MANUSCRIPTS</span>
            <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]/50 group-hover:text-[color:var(--accent-text)] transition-colors">draw</span>
          </div>
          <div className="font-headline-md text-headline-lg text-[color:var(--text)] my-1 leading-none">{pad(draftsCount)}</div>
          <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] mt-2">
            Awaiting peer review
          </div>
        </div>
      </div>

      {/* Asymmetric 2-Column Grid (65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Section 1: Recent Activity Log */}
          <section>
            <div className="flex items-center justify-between pb-3 border-b border-[color:var(--border)] mb-4">
              <h2 className="font-headline-md text-headline-md text-[color:var(--text)] italic">
                Recent Activity
              </h2>
              <a className="font-label-sm text-label-sm text-[color:var(--accent-text)] hover:underline transition-colors flex items-center gap-1 group font-medium" href="/admin/collections/posts">
                View full log
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
            <div className="border border-[color:var(--border)] divide-y divide-[color:var(--border)] bg-[color:var(--bg-subtle)] shadow-xs rounded">
              {postsResult.docs.map((post: any, i: number) => {
                const colors = ['bg-[color:var(--accent)]', 'bg-[color:var(--success)]', 'bg-[color:var(--warning)]', 'bg-[color:var(--accent-text)]', 'bg-[color:var(--border-strong)]']
                const labels = ['Posts', 'Media (FITS)', 'Projects', 'Current State', 'Topics']
                const actions = ['PUBLISHED', 'INGESTION', 'VERSION 2.1', 'LIVE SYNC', 'TAXONOMY']
                const dateStr = post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : ''

                return (
                  <div key={post.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[color:var(--surface-hover)] transition-colors relative group activity-item">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent activity-indicator transition-colors" />
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full ${colors[i % 5]} mt-2 shrink-0`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-label-sm font-label-sm text-[color:var(--text)] border border-[color:var(--border)] px-1.5 py-0.5 bg-[color:var(--surface)] rounded">{labels[i % 5]}</span>
                          <span className="font-label-sm text-label-sm text-[color:var(--text-muted)]">{actions[i % 5]}</span>
                        </div>
                        <p className="font-headline-md text-base text-[color:var(--text)] mt-1 font-normal hover:text-[color:var(--accent-text)] cursor-pointer transition-colors">
                          &ldquo;{post.title}&rdquo;
                        </p>
                        {post.excerpt && (
                          <p className="font-body-sm text-xs text-[color:var(--text-muted)] mt-0.5 line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-[color:var(--text-muted)] shrink-0 whitespace-nowrap mt-1">
                      {dateStr}
                    </span>
                  </div>
                )
              })}
              {postsResult.docs.length === 0 && (
                <div className="p-8 text-center text-[color:var(--text-muted)] font-body-sm">
                  No activity yet. Create your first post to get started.
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Editorial Pipeline */}
          <section>
            <div className="pb-3 border-b border-[color:var(--border)] mb-4 flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-[color:var(--text)] italic">
                Editorial Pipeline &amp; Ingestions
              </h2>
              <span className="text-label-sm font-label-sm text-[color:var(--text-muted)]">QUEUED: {draftsCount} ITEMS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-4 shadow-xs rounded hover:border-[color:var(--accent-border)] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label-sm tracking-wider text-[color:var(--accent-text)] uppercase font-medium bg-[color:var(--accent-subtle)] border border-[color:var(--accent-border)] px-1.5 py-0.5 rounded">
                    FITS INGESTION // CALIBRATION
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]">flare</span>
                </div>
                <h4 className="font-headline-sm text-sm text-[color:var(--text)] font-medium">Media Pipeline Ready</h4>
                <p className="font-body-sm text-xs text-[color:var(--text-muted)] mt-1">Calibrated sub-exposures ready for ingestion via AstroPy pipeline.</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-[color:var(--text-muted)] border-t border-[color:var(--border)] pt-2">
                  <span>{mediaCount} assets indexed</span>
                  <a href="/admin/collections/media" className="text-[color:var(--accent-text)] font-medium cursor-pointer hover:underline">Inspect Plates →</a>
                </div>
              </div>
              <div className="border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-4 shadow-xs rounded hover:border-[color:var(--accent-border)] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label-sm tracking-wider text-[color:var(--success)] uppercase font-medium bg-[color:var(--success)]/10 border border-[color:var(--success)]/20 px-1.5 py-0.5 rounded">
                    PEER SYNC // ARCHIVE
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]">sync</span>
                </div>
                <h4 className="font-headline-sm text-sm text-[color:var(--text)] font-medium">Content Archive Sync</h4>
                <p className="font-body-sm text-xs text-[color:var(--text-muted)] mt-1">All {postsCount} treatises indexed and ready for publication.</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-[color:var(--text-muted)] border-t border-[color:var(--border)] pt-2">
                  <span>Catalog Linked</span>
                  <a href="/admin/collections/posts" className="text-[color:var(--accent-text)] font-medium cursor-pointer hover:underline">View Catalog →</a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Card 1: Near-Ready Manuscript */}
          {postsResult.docs[0] && (
            <div className="border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-5 relative shadow-xs rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-label-sm tracking-wider text-[color:var(--accent-text)] bg-[color:var(--accent-subtle)] border border-[color:var(--accent-border)] px-2 py-0.5 rounded font-medium">
                  NEAR READY • LATEST DRAFT
                </span>
                <span className="material-symbols-outlined text-[16px] text-[color:var(--text-muted)]">bookmark</span>
              </div>
              <h3 className="font-headline-md text-headline-sm text-[color:var(--text)] italic font-normal leading-snug">
                {postsResult.docs[0].title}
              </h3>
              {postsResult.docs[0].excerpt && (
                <p className="font-body-sm text-xs text-[color:var(--text-muted)] mt-2 line-clamp-3 leading-relaxed">
                  {postsResult.docs[0].excerpt}
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-[color:var(--border)] flex flex-wrap items-center gap-y-1 text-label-sm font-label-sm text-[color:var(--text-muted)] text-[11px]">
                {postsResult.docs[0].reading_time && (
                  <>
                    <span>{postsResult.docs[0].reading_time} min read</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span className="text-[color:var(--accent-text)] font-medium">
                  Updated {new Date(postsResult.docs[0].updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={`/admin/collections/posts/${postsResult.docs[0].id}`} className="bg-[color:var(--accent)] text-[color:var(--on-accent)] font-label-md text-label-md py-1.5 px-3 rounded hover:bg-[color:var(--accent-hover)] transition-colors text-center shadow-xs">
                  Open in Editor
                </a>
                <a href={`/admin/collections/posts/${postsResult.docs[0].id}`} className="border border-[color:var(--border)] text-[color:var(--text)] hover:bg-[color:var(--surface-hover)] font-label-md text-label-md py-1.5 px-3 rounded transition-colors text-center">
                  Review
                </a>
              </div>
            </div>
          )}

          {/* Card 2: Right Now / Field Telemetry */}
          <div className="border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-5 shadow-xs rounded">
            <div className="flex items-center justify-between pb-3 border-b border-[color:var(--border)] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-ping" />
                <span className="text-label-sm font-label-sm text-[color:var(--text)] uppercase tracking-widest font-semibold">
                  Right Now / Field Telemetry
                </span>
              </div>
              <span className="text-[10px] font-label-sm text-[color:var(--success)] bg-[color:var(--success)]/10 border border-[color:var(--success)]/20 px-1.5 py-0.5 rounded font-medium">LIVE</span>
            </div>
            <ul className="space-y-3.5 text-xs">
              {[
                { icon: 'auto_stories', label: 'STUDYING:', value: currentState?.studying },
                { icon: 'memory', label: 'BUILDING:', value: currentState?.building },
                { icon: 'article', label: 'READING:', value: currentState?.reading },
                { icon: 'psychology', label: 'THINKING:', value: currentState?.thinking_about },
              ].map((item) => (
                <li key={item.label}>
                  <div className="text-label-sm font-label-sm text-[color:var(--text-muted)] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px] text-[color:var(--accent-text)]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <p className="font-body-sm text-[color:var(--text)] mt-0.5 ml-4 font-normal">
                    {item.value || <span className="italic text-[color:var(--text-muted)]">Not set</span>}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-3 border-t border-[color:var(--border)] flex justify-between items-center">
              <span className="text-label-sm font-label-sm text-[color:var(--text-muted)] text-[10px]">
                {currentState?.updatedAt ? `SYNCED: ${new Date(currentState.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'NOT YET SYNCED'}
              </span>
              <a className="text-label-sm font-label-sm text-[color:var(--accent-text)] hover:underline flex items-center gap-1 font-medium" href="/admin/globals/current-state">
                Edit Telemetry →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
