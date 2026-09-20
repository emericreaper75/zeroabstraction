import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function AdminDashboard() {
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
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline-rule pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-label-sm font-label-sm text-primary border border-primary/30 px-2 py-0.5 bg-amber-wash rounded">
              OBSERVATORY WORKBENCH
            </span>
            <span className="text-label-sm font-label-sm text-ink-muted font-normal">// CANONICAL ARCHIVE</span>
          </div>
          <h1 className="font-headline-md text-headline-xl text-on-surface italic font-normal tracking-tight">
            Good evening, Manoj
          </h1>
          <p className="font-body-md text-body-md text-ink-secondary mt-1 font-light">
            Here&apos;s what&apos;s happening in your universe.
          </p>
        </div>
        {/* Live Epoch Chip */}
        <div className="shrink-0 flex items-center gap-2.5 p-2 px-3.5 border border-hairline-rule bg-white shadow-xs rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <span className="font-label-md text-label-md text-on-surface tracking-wider">
            EPOCH 2025.2 // SKY CLEAR
          </span>
        </div>
      </div>

      {/* Inline Metrics Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
        {/* Metric 1: Total Posts */}
        <div className="p-5 border-b lg:border-b-0 border-r border-hairline-rule hover:bg-surface-container-low transition-colors group">
          <div className="text-label-sm font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>TOTAL POSTS</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/50 group-hover:text-primary transition-colors">notes</span>
          </div>
          <div className="font-headline-md text-headline-lg text-on-surface my-1 leading-none">{pad(postsCount)}</div>
          <div className="text-label-sm font-label-sm text-primary mt-2 flex items-center gap-1 font-medium">
            <span>Published &amp; drafts</span>
          </div>
        </div>
        {/* Metric 2: Published Projects */}
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-hairline-rule hover:bg-surface-container-low transition-colors group">
          <div className="text-label-sm font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>PUBLISHED PROJECTS</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/50 group-hover:text-primary transition-colors">solar_power</span>
          </div>
          <div className="font-headline-md text-headline-lg text-on-surface my-1 leading-none">{pad(projectsCount)}</div>
          <div className="text-label-sm font-label-sm text-ink-muted mt-2">
            Astrophotography &amp; Code
          </div>
        </div>
        {/* Metric 3: Media Files */}
        <div className="p-5 border-r border-hairline-rule hover:bg-surface-container-low transition-colors group">
          <div className="text-label-sm font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>MEDIA ASSETS</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/50 group-hover:text-primary transition-colors">perm_media</span>
          </div>
          <div className="font-headline-md text-headline-lg text-on-surface my-1 leading-none">{mediaCount}</div>
          <div className="text-label-sm font-label-sm text-ink-muted mt-2">
            FITS &amp; RAW plates
          </div>
        </div>
        {/* Metric 4: Draft Manuscripts */}
        <div className="p-5 hover:bg-surface-container-low transition-colors group">
          <div className="text-label-sm font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>DRAFT MANUSCRIPTS</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/50 group-hover:text-primary transition-colors">draw</span>
          </div>
          <div className="font-headline-md text-headline-lg text-on-surface my-1 leading-none">{pad(draftsCount)}</div>
          <div className="text-label-sm font-label-sm text-ink-muted mt-2">
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
            <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface italic">
                Recent Activity
              </h2>
              <a className="font-label-sm text-label-sm text-primary hover:text-accent-ochre transition-colors flex items-center gap-1 group font-medium" href="/admin/collections/posts">
                View full log
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
            <div className="border border-hairline-rule divide-y divide-hairline-rule bg-white shadow-xs rounded">
              {postsResult.docs.map((post: any, i: number) => {
                const colors = ['bg-emerald-600', 'bg-sky-600', 'bg-amber-600', 'bg-violet-600', 'bg-rose-600']
                const shadows = [
                  'shadow-[0_0_4px_rgba(5,150,105,0.4)]',
                  'shadow-[0_0_4px_rgba(2,132,199,0.4)]',
                  'shadow-[0_0_4px_rgba(217,119,6,0.4)]',
                  'shadow-[0_0_4px_rgba(124,58,237,0.4)]',
                  'shadow-[0_0_4px_rgba(225,29,72,0.4)]',
                ]
                const labels = ['Posts', 'Media (FITS)', 'Projects', 'Current State', 'Topics']
                const actions = ['PUBLISHED', 'INGESTION', 'VERSION 2.1', 'LIVE SYNC', 'TAXONOMY']
                const dateStr = post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : ''

                return (
                  <div key={post.id} className="p-4 flex items-start justify-between gap-4 hover:bg-surface-container-low transition-colors relative group activity-item">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent activity-indicator transition-colors" />
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full ${colors[i % 5]} mt-2 shrink-0 ${shadows[i % 5]}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-label-sm font-label-sm text-ink-secondary border border-hairline-rule px-1.5 py-0.5 bg-surface-container-low rounded">{labels[i % 5]}</span>
                          <span className="font-label-sm text-label-sm text-ink-muted">{actions[i % 5]}</span>
                        </div>
                        <p className="font-headline-md text-base text-on-surface mt-1 font-normal hover:text-primary cursor-pointer transition-colors">
                          &ldquo;{post.title}&rdquo;
                        </p>
                        {post.excerpt && (
                          <p className="font-body-sm text-xs text-ink-muted mt-0.5 line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-ink-muted shrink-0 whitespace-nowrap mt-1">
                      {dateStr}
                    </span>
                  </div>
                )
              })}
              {postsResult.docs.length === 0 && (
                <div className="p-8 text-center text-ink-muted font-body-sm">
                  No activity yet. Create your first post to get started.
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Editorial Pipeline */}
          <section>
            <div className="pb-3 border-b border-hairline-rule mb-4 flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface italic">
                Editorial Pipeline &amp; Ingestions
              </h2>
              <span className="text-label-sm font-label-sm text-ink-muted">QUEUED: {draftsCount} ITEMS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-hairline-rule bg-white p-4 shadow-xs rounded hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label-sm tracking-wider text-primary uppercase font-medium bg-amber-wash border border-primary/30 px-1.5 py-0.5 rounded">
                    FITS INGESTION // CALIBRATION
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-ink-muted">flare</span>
                </div>
                <h4 className="font-headline-sm text-sm text-on-surface font-medium">Media Pipeline Ready</h4>
                <p className="font-body-sm text-xs text-ink-muted mt-1">Calibrated sub-exposures ready for ingestion via AstroPy pipeline.</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-ink-muted border-t border-hairline-rule pt-2">
                  <span>{mediaCount} assets indexed</span>
                  <a href="/admin/collections/media" className="text-primary font-medium cursor-pointer hover:underline">Inspect Plates →</a>
                </div>
              </div>
              <div className="border border-hairline-rule bg-white p-4 shadow-xs rounded hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-label-sm tracking-wider text-emerald-800 uppercase font-medium bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    PEER SYNC // ARCHIVE
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-ink-muted">sync</span>
                </div>
                <h4 className="font-headline-sm text-sm text-on-surface font-medium">Content Archive Sync</h4>
                <p className="font-body-sm text-xs text-ink-muted mt-1">All {postsCount} treatises indexed and ready for publication.</p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-label-sm text-ink-muted border-t border-hairline-rule pt-2">
                  <span>Catalog Linked</span>
                  <a href="/admin/collections/posts" className="text-primary font-medium cursor-pointer hover:underline">View Catalog →</a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Card 1: Near-Ready Manuscript */}
          {postsResult.docs[0] && (
            <div className="border border-hairline-rule bg-white p-5 relative shadow-xs rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-label-sm tracking-wider text-primary bg-amber-wash border border-primary/30 px-2 py-0.5 rounded font-medium">
                  NEAR READY • LATEST DRAFT
                </span>
                <span className="material-symbols-outlined text-[16px] text-ink-muted">bookmark</span>
              </div>
              <h3 className="font-headline-md text-headline-sm text-on-surface italic font-normal leading-snug">
                {postsResult.docs[0].title}
              </h3>
              {postsResult.docs[0].excerpt && (
                <p className="font-body-sm text-xs text-ink-secondary mt-2 line-clamp-3 leading-relaxed">
                  {postsResult.docs[0].excerpt}
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-hairline-rule flex flex-wrap items-center gap-y-1 text-label-sm font-label-sm text-ink-muted text-[11px]">
                {postsResult.docs[0].reading_time && (
                  <>
                    <span>{postsResult.docs[0].reading_time} min read</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span className="text-primary font-medium">
                  Updated {new Date(postsResult.docs[0].updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={`/admin/collections/posts/${postsResult.docs[0].id}`} className="bg-primary text-white font-label-md text-label-md py-1.5 px-3 rounded hover:bg-accent-ochre transition-colors text-center shadow-xs">
                  Open in Editor
                </a>
                <a href={`/writing/${postsResult.docs[0].slug}`} className="border border-hairline-rule text-on-surface hover:bg-surface-container-low font-label-md text-label-md py-1.5 px-3 rounded transition-colors text-center">
                  Preview
                </a>
              </div>
            </div>
          )}

          {/* Card 2: Right Now / Field Telemetry */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <span className="text-label-sm font-label-sm text-ink-secondary uppercase tracking-widest font-semibold">
                  Right Now / Field Telemetry
                </span>
              </div>
              <span className="text-[10px] font-label-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">LIVE</span>
            </div>
            <ul className="space-y-3.5 text-xs">
              {[
                { icon: 'auto_stories', label: 'STUDYING:', value: currentState?.studying },
                { icon: 'memory', label: 'BUILDING:', value: currentState?.building },
                { icon: 'article', label: 'READING:', value: currentState?.reading },
                { icon: 'psychology', label: 'THINKING:', value: currentState?.thinking_about },
              ].map((item) => (
                <li key={item.label}>
                  <div className="text-label-sm font-label-sm text-ink-muted flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px] text-primary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <p className="font-body-sm text-on-surface mt-0.5 ml-4 font-normal">
                    {item.value || <span className="italic text-ink-muted">Not set</span>}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-3 border-t border-hairline-rule flex justify-between items-center">
              <span className="text-label-sm font-label-sm text-ink-muted text-[10px]">
                {currentState?.updatedAt ? `SYNCED: ${new Date(currentState.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'NOT YET SYNCED'}
              </span>
              <a className="text-label-sm font-label-sm text-primary hover:underline flex items-center gap-1 font-medium" href="/admin/globals/current-state">
                Edit Telemetry →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
