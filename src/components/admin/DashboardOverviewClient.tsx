'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminToast } from './AdminToastProvider'

export interface ActivityEntry {
  id: string
  kind: 'post' | 'project' | 'media'
  title: string
  subtitle?: string
  statusLabel: string
  href: string
  updatedAt: string
}

export interface TopicStat {
  id: string | number
  name: string
  slug: string
  count: number
}

export interface MediaPreview {
  id: string | number
  filename: string
  url?: string | null
  mimeType?: string | null
  filesize?: number | null
}

export interface HealthIssue {
  id: string
  label: string
  count: number
  href: string
  severity: 'warn' | 'ok'
}

export interface DashboardOverviewProps {
  userName: string
  metrics: {
    postsCount: number
    publishedPostsCount: number
    draftPostsCount: number
    archivedPostsCount: number
    projectsCount: number
    completedProjectsCount: number
    mediaCount: number
    topicsCount: number
    journeyCount: number
  }
  activities: ActivityEntry[]
  latestPost: {
    id: string | number
    title: string
    slug: string
    excerpt?: string | null
    reading_time?: number | null
    status?: string | null
    updatedAt?: string | null
  } | null
  currentState: {
    studying?: string | null
    building?: string | null
    reading?: string | null
    thinking_about?: string | null
    visibility?: boolean | null
    updatedAt?: string | null
  } | null
  topicStats: TopicStat[]
  recentMedia: MediaPreview[]
  readinessScore: number
  healthIssues: HealthIssue[]
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getJulianDate(): string {
  const now = Date.now()
  const jd = now / 86400000 + 2440587.5
  return jd.toFixed(2)
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DashboardOverviewClient({
  userName,
  metrics,
  activities,
  latestPost,
  currentState,
  topicStats,
  recentMedia,
  readinessScore,
  healthIssues,
}: DashboardOverviewProps) {
  const toast = useAdminToast()
  const [greeting, setGreeting] = useState('Welcome back')
  const [julianDate, setJulianDate] = useState('2461000.00')
  const [activityTab, setActivityTab] = useState<'all' | 'post' | 'project' | 'media'>('all')
  const [scratchpad, setScratchpad] = useState('')
  const [healthPing, setHealthPing] = useState<{ status: string; latencyMs: number } | null>(null)
  const [pinging, setPinging] = useState(false)

  useEffect(() => {
    setGreeting(getGreeting())
    setJulianDate(getJulianDate())
    try {
      const saved = localStorage.getItem('atelier-field-scratchpad')
      if (saved) setScratchpad(saved)
    } catch {
      /* ignore */
    }
  }, [])

  const handleScratchpadChange = (val: string) => {
    setScratchpad(val)
    try {
      localStorage.setItem('atelier-field-scratchpad', val)
    } catch {
      /* ignore */
    }
  }

  const copyTelemetryJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentState || {}, null, 2))
      toast.success('Field telemetry JSON copied to clipboard.')
    } catch {
      toast.error('Clipboard permission unavailable.')
    }
  }

  const runHealthCheck = async () => {
    setPinging(true)
    const start = performance.now()
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      const elapsed = Math.round(performance.now() - start)
      setHealthPing({ status: res.ok ? 'HEALTHY' : `HTTP ${res.status}`, latencyMs: elapsed })
      toast.success(`Health check passed (${elapsed}ms)`)
    } catch {
      setHealthPing({ status: 'UNREACHABLE', latencyMs: 0 })
      toast.error('Health endpoint unreachable.')
    } finally {
      setPinging(false)
    }
  }

  const filteredActivities = useMemo(() => {
    if (activityTab === 'all') return activities.slice(0, 7)
    return activities.filter((a) => a.kind === activityTab).slice(0, 7)
  }, [activities, activityTab])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const totalPosts = Math.max(1, metrics.postsCount)
  const pubPct = Math.round((metrics.publishedPostsCount / totalPosts) * 100)
  const draftPct = Math.round((metrics.draftPostsCount / totalPosts) * 100)
  const archPct = Math.max(0, 100 - pubPct - draftPct)

  const ringRadius = 26
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference - (readinessScore / 100) * ringCircumference

  return (
    <div className="space-y-8">
      {/* Welcome Editorial Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline-rule pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-label-sm font-label-sm text-primary border border-primary/30 px-2 py-0.5 bg-amber-wash rounded">
              OBSERVATORY WORKBENCH
            </span>
            <span className="text-label-sm font-label-sm text-ink-muted font-normal">{'//'} CANONICAL ARCHIVE</span>
          </div>
          <h1 className="font-headline-md text-headline-xl text-on-surface italic font-normal tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="font-body-md text-body-md text-ink-secondary mt-1 font-light">
            Here&apos;s what&apos;s happening across your treatises, engineering rigs, and plates.
          </p>
        </div>

        {/* Live Epoch & Julian Date Chip */}
        <div className="shrink-0 flex items-center gap-3 p-2.5 px-3.5 border border-hairline-rule bg-paper-surface shadow-xs rounded">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface tracking-wider leading-none">
              EPOCH 2025.2 // SKY CLEAR
            </span>
            <span className="font-label-sm text-[10px] text-ink-muted mt-1 leading-none">
              JD {julianDate} · {metrics.journeyCount} MILESTONES
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Dock */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href="/admin/collections/posts/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-label-md hover:bg-accent-ochre transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[15px]">edit_note</span>
          Write Treatise
        </Link>
        <Link
          href="/admin/collections/projects/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-hairline-rule bg-paper-surface text-on-surface text-xs font-label-md hover:border-primary/50 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">precision_manufacturing</span>
          Log Engineering Rig
        </Link>
        <Link
          href="/admin/collections/media"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-hairline-rule bg-paper-surface text-on-surface text-xs font-label-md hover:border-primary/50 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">upload_file</span>
          Upload Plate
        </Link>
        <Link
          href="/admin/globals/current-state"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-hairline-rule bg-paper-surface text-on-surface text-xs font-label-md hover:border-primary/50 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">sensors</span>
          Update Telemetry
        </Link>
      </div>

      {/* 5-Card KPI Metric Strip with Inline SVG Sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-0 border border-hairline-rule bg-paper-surface shadow-xs rounded overflow-hidden">
        <Link
          href="/admin/collections/posts"
          className="p-4 border-b lg:border-b-0 border-r border-hairline-rule hover:bg-surface-container-low transition-colors group"
        >
          <div className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>TOTAL POSTS</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/60 group-hover:text-primary transition-colors">notes</span>
          </div>
          <div className="flex items-end justify-between gap-2 my-1">
            <span className="font-headline-md text-headline-lg text-on-surface leading-none">
              {pad(metrics.postsCount)}
            </span>
            <svg viewBox="0 0 60 20" className="w-14 h-5 text-primary/70" aria-hidden="true">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                points="2,16 14,13 26,15 38,8 50,10 58,3"
              />
            </svg>
          </div>
          <div className="text-[11px] font-label-sm text-primary mt-2 font-medium">
            {metrics.publishedPostsCount} published · {metrics.draftPostsCount} drafts
          </div>
        </Link>

        <Link
          href="/admin/collections/projects"
          className="p-4 border-b lg:border-b-0 lg:border-r border-hairline-rule hover:bg-surface-container-low transition-colors group"
        >
          <div className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>PROJECTS &amp; RIGS</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/60 group-hover:text-primary transition-colors">solar_power</span>
          </div>
          <div className="flex items-end justify-between gap-2 my-1">
            <span className="font-headline-md text-headline-lg text-on-surface leading-none">
              {pad(metrics.projectsCount)}
            </span>
            <svg viewBox="0 0 60 20" className="w-14 h-5 text-emerald-500/80" aria-hidden="true">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                points="2,15 15,15 28,11 40,12 50,6 58,4"
              />
            </svg>
          </div>
          <div className="text-[11px] font-label-sm text-ink-muted mt-2">
            {metrics.completedProjectsCount} completed rigs
          </div>
        </Link>

        <Link
          href="/admin/collections/media"
          className="p-4 border-b sm:border-b-0 border-r border-hairline-rule hover:bg-surface-container-low transition-colors group"
        >
          <div className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>MEDIA PLATES</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/60 group-hover:text-primary transition-colors">perm_media</span>
          </div>
          <div className="flex items-end justify-between gap-2 my-1">
            <span className="font-headline-md text-headline-lg text-on-surface leading-none">
              {metrics.mediaCount}
            </span>
            <svg viewBox="0 0 60 20" className="w-14 h-5 text-sky-500/80" aria-hidden="true">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                points="2,17 14,12 24,14 36,7 48,9 58,5"
              />
            </svg>
          </div>
          <div className="text-[11px] font-label-sm text-ink-muted mt-2">
            FITS, RAW &amp; figures
          </div>
        </Link>

        <Link
          href="/admin/collections/posts?status=draft"
          className="p-4 border-b sm:border-b-0 lg:border-r border-hairline-rule hover:bg-surface-container-low transition-colors group"
        >
          <div className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>DRAFT QUEUE</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/60 group-hover:text-primary transition-colors">draw</span>
          </div>
          <div className="flex items-end justify-between gap-2 my-1">
            <span className="font-headline-md text-headline-lg text-on-surface leading-none">
              {pad(metrics.draftPostsCount)}
            </span>
            <span className="text-[10px] font-label-sm px-1.5 py-0.5 rounded bg-amber-wash text-primary border border-primary/20">
              {100 - pubPct}%
            </span>
          </div>
          <div className="text-[11px] font-label-sm text-ink-muted mt-2">
            Awaiting publication
          </div>
        </Link>

        <Link
          href="/admin/collections/topics"
          className="col-span-2 lg:col-span-1 p-4 hover:bg-surface-container-low transition-colors group"
        >
          <div className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase mb-1 flex items-center justify-between">
            <span>TAXONOMY</span>
            <span className="material-symbols-outlined text-[16px] text-ink-muted/60 group-hover:text-primary transition-colors">label</span>
          </div>
          <div className="flex items-end justify-between gap-2 my-1">
            <span className="font-headline-md text-headline-lg text-on-surface leading-none">
              {pad(metrics.topicsCount)}
            </span>
            <span className="text-[10px] font-label-sm text-ink-muted">TOPICS</span>
          </div>
          <div className="text-[11px] font-label-sm text-ink-muted mt-2">
            Indexed subject nodes
          </div>
        </Link>
      </div>

      {/* Asymmetric 2-Column Grid (8 cols / 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Unified Recent Activity Feed with Filter Tabs */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-hairline-rule mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-headline-md text-headline-md text-on-surface italic">
                  Recent Activity
                </h2>
                <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded border border-hairline-rule">
                  {(
                    [
                      { key: 'all', label: 'All' },
                      { key: 'post', label: 'Posts' },
                      { key: 'project', label: 'Projects' },
                      { key: 'media', label: 'Media' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActivityTab(t.key)}
                      className={`px-2 py-0.5 rounded text-[11px] font-label-sm transition-colors ${
                        activityTab === t.key
                          ? 'bg-primary text-on-primary font-medium'
                          : 'text-ink-muted hover:text-on-surface'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <Link
                className="font-label-sm text-label-sm text-primary hover:text-accent-ochre transition-colors flex items-center gap-1 group font-medium"
                href="/admin/collections/posts"
              >
                View catalog
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>

            <div className="border border-hairline-rule divide-y divide-hairline-rule bg-paper-surface shadow-xs rounded overflow-hidden">
              {filteredActivities.map((item) => {
                const dotColor =
                  item.kind === 'post'
                    ? 'bg-primary'
                    : item.kind === 'project'
                      ? 'bg-emerald-500'
                      : 'bg-sky-500'
                const kindLabel =
                  item.kind === 'post' ? 'POST' : item.kind === 'project' ? 'PROJECT' : 'MEDIA'
                const dateStr = item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : ''

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="p-4 flex items-start justify-between gap-4 hover:bg-surface-container-low transition-colors relative group activity-item"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-transparent activity-indicator transition-colors" />
                    <div className="flex items-start gap-3 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${dotColor} mt-2 shrink-0`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-label-sm text-ink-secondary border border-hairline-rule px-1.5 py-0.5 bg-surface-container-low rounded">
                            {kindLabel}
                          </span>
                          <span className="font-label-sm text-[10px] text-ink-muted uppercase">
                            {item.statusLabel}
                          </span>
                        </div>
                        <p className="font-headline-md text-base text-on-surface mt-1 font-normal group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="font-body-sm text-xs text-ink-muted mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-ink-muted shrink-0 whitespace-nowrap mt-1">
                      {dateStr}
                    </span>
                  </Link>
                )
              })}
              {filteredActivities.length === 0 && (
                <div className="p-8 text-center text-ink-muted font-body-sm">
                  No recent activity in this category.
                </div>
              )}
            </div>
          </section>

          {/* Editorial Velocity & Distribution SVG Visualization */}
          <section className="border border-hairline-rule bg-paper-surface p-5 rounded shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
              <div>
                <h2 className="font-headline-md text-lg text-on-surface italic">
                  Archive Composition &amp; Taxonomy Distribution
                </h2>
                <p className="text-xs text-ink-muted">Live breakdown across publication states and top subjects</p>
              </div>
              <span className="text-[11px] font-label-sm text-primary bg-amber-wash border border-primary/20 px-2 py-0.5 rounded">
                {pubPct}% PUBLISHED
              </span>
            </div>

            {/* Stacked Composition Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-[11px] font-label-sm text-ink-muted mb-1.5">
                <span>Published ({metrics.publishedPostsCount})</span>
                <span>Drafts ({metrics.draftPostsCount})</span>
                <span>Archived ({metrics.archivedPostsCount})</span>
              </div>
              <div className="w-full h-3 rounded overflow-hidden bg-surface-container-low flex border border-hairline-rule">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${pubPct}%` }} />
                <div className="bg-primary h-full transition-all" style={{ width: `${draftPct}%` }} />
                <div className="bg-ink-muted/40 h-full transition-all" style={{ width: `${archPct}%` }} />
              </div>
            </div>

            {/* Horizontal Topic Bars (Pure SVG + Semantic Layout) */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-label-sm text-ink-muted uppercase tracking-wider">
                Top Subjects by Treatise Count
              </div>
              {topicStats.slice(0, 5).map((topic) => {
                const maxCount = Math.max(1, ...topicStats.map((t) => t.count))
                const widthPct = Math.max(6, Math.round((topic.count / maxCount) * 100))
                return (
                  <div key={topic.id} className="grid grid-cols-12 items-center gap-3 text-xs">
                    <span className="col-span-4 sm:col-span-3 truncate font-label-sm text-on-surface">
                      #{topic.name}
                    </span>
                    <div className="col-span-6 sm:col-span-7 h-2 bg-surface-container-low rounded overflow-hidden">
                      <div className="h-full bg-primary/80 rounded" style={{ width: `${widthPct}%` }} />
                    </div>
                    <span className="col-span-2 text-right font-label-sm text-ink-muted">
                      {topic.count}
                    </span>
                  </div>
                )
              })}
              {topicStats.length === 0 && (
                <p className="text-xs text-ink-muted italic">No topics indexed yet.</p>
              )}
            </div>
          </section>

          {/* Recent Media Plates Strip */}
          <section className="border border-hairline-rule bg-paper-surface p-5 rounded shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
              <h2 className="font-headline-md text-lg text-on-surface italic">
                Recent Media Plates
              </h2>
              <Link
                href="/admin/collections/media"
                className="font-label-sm text-xs text-primary hover:underline"
              >
                Open Plates Archive →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentMedia.map((m) => (
                <Link
                  key={m.id}
                  href="/admin/collections/media"
                  className="group border border-hairline-rule rounded overflow-hidden bg-surface-container-low hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-[4/3] bg-surface-container flex items-center justify-center overflow-hidden">
                    {m.url && m.mimeType?.startsWith('image/') ? (
                      <img
                        src={m.url}
                        alt={m.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-ink-muted text-[28px]">
                        description
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-label-sm text-on-surface truncate">{m.filename}</p>
                    <p className="text-[10px] font-label-sm text-ink-muted mt-0.5">
                      {formatBytes(m.filesize)}
                    </p>
                  </div>
                </Link>
              ))}
              {recentMedia.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-ink-muted">
                  No media plates uploaded yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Content Health & SEO Readiness Ring */}
          <div className="border border-hairline-rule bg-paper-surface p-5 rounded shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
              <span className="text-label-sm font-label-sm text-ink-secondary uppercase tracking-widest font-semibold">
                Archive Readiness
              </span>
              <span className="text-[10px] font-label-sm px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium">
                AUDIT
              </span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0 -rotate-90">
                <circle
                  cx="34"
                  cy="34"
                  r={ringRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-surface-container-high"
                />
                <circle
                  cx="34"
                  cy="34"
                  r={ringRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div>
                <div className="font-headline-md text-2xl text-on-surface leading-none">
                  {readinessScore}%
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  Metadata, excerpts &amp; SEO completeness score.
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-xs border-t border-hairline-rule pt-3">
              {healthIssues.map((issue) => (
                <li key={issue.id}>
                  <Link
                    href={issue.href}
                    className="flex items-center justify-between py-1 hover:text-primary transition-colors"
                  >
                    <span className="text-ink-secondary">{issue.label}</span>
                    <span
                      className={`font-label-sm px-1.5 py-0.5 rounded text-[11px] ${
                        issue.count === 0
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-wash text-primary'
                      }`}
                    >
                      {issue.count === 0 ? 'OK' : issue.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Near-Ready Manuscript */}
          {latestPost && (
            <div className="border border-hairline-rule bg-paper-surface p-5 relative shadow-xs rounded">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-label-sm tracking-wider text-primary bg-amber-wash border border-primary/30 px-2 py-0.5 rounded font-medium">
                  LATEST MANUSCRIPT • {(latestPost.status || 'draft').toUpperCase()}
                </span>
                <span className="material-symbols-outlined text-[16px] text-ink-muted">bookmark</span>
              </div>
              <h3 className="font-headline-md text-headline-sm text-on-surface italic font-normal leading-snug">
                {latestPost.title}
              </h3>
              {latestPost.excerpt && (
                <p className="font-body-sm text-xs text-ink-secondary mt-2 line-clamp-3 leading-relaxed">
                  {latestPost.excerpt}
                </p>
              )}
              <div className="mt-4 pt-3 border-t border-hairline-rule flex flex-wrap items-center gap-y-1 text-label-sm font-label-sm text-ink-muted text-[11px]">
                {latestPost.reading_time && (
                  <>
                    <span>{latestPost.reading_time} min read</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                {latestPost.updatedAt && (
                  <span className="text-primary font-medium">
                    Updated {new Date(latestPost.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  href={`/admin/collections/posts/${latestPost.id}`}
                  className="bg-primary text-on-primary font-label-md text-label-md py-1.5 px-3 rounded hover:bg-accent-ochre transition-colors text-center shadow-xs"
                >
                  Open in Editor
                </Link>
                <Link
                  href={`/writing/${latestPost.slug}`}
                  className="border border-hairline-rule text-on-surface hover:bg-surface-container-low font-label-md text-label-md py-1.5 px-3 rounded transition-colors text-center"
                >
                  Preview
                </Link>
              </div>
            </div>
          )}

          {/* Card 3: Right Now / Field Telemetry */}
          <div className="border border-hairline-rule bg-paper-surface p-5 shadow-xs rounded">
            <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <span className="text-label-sm font-label-sm text-ink-secondary uppercase tracking-widest font-semibold">
                  Field Telemetry
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyTelemetryJson}
                  title="Copy telemetry JSON"
                  className="text-[10px] font-label-sm text-ink-muted hover:text-primary border border-hairline-rule px-1.5 py-0.5 rounded transition-colors"
                >
                  JSON
                </button>
                <span className="text-[10px] font-label-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                  {currentState?.visibility === false ? 'HIDDEN' : 'LIVE'}
                </span>
              </div>
            </div>
            <ul className="space-y-3 text-xs">
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
                {currentState?.updatedAt
                  ? `SYNCED: ${new Date(currentState.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                  : 'NOT YET SYNCED'}
              </span>
              <Link
                className="text-label-sm font-label-sm text-primary hover:underline flex items-center gap-1 font-medium"
                href="/admin/globals/current-state"
              >
                Edit Telemetry →
              </Link>
            </div>
          </div>

          {/* Card 4: Observatory Field Scratchpad */}
          <div className="border border-hairline-rule bg-paper-surface p-5 shadow-xs rounded">
            <div className="flex items-center justify-between pb-2.5 border-b border-hairline-rule mb-3">
              <span className="text-label-sm font-label-sm text-ink-secondary uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-primary">sticky_note_2</span>
                Field Scratchpad
              </span>
              <span className="text-[10px] font-label-sm text-ink-muted">{scratchpad.length} chars</span>
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => handleScratchpadChange(e.target.value)}
              rows={4}
              placeholder="Jot down observation logs, draft outlines, or equation ideas (saved locally)..."
              aria-label="Field scratchpad notes"
              className="w-full bg-surface-container-low border border-hairline-rule rounded p-2.5 text-xs font-body-sm text-on-surface placeholder:text-ink-muted focus:outline-none focus:border-primary resize-y"
            />
            <div className="mt-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleScratchpadChange('')}
                disabled={!scratchpad}
                className="text-[11px] font-label-sm text-ink-muted hover:text-rose-500 disabled:opacity-40 transition-colors"
              >
                Clear
              </button>
              <Link
                href="/admin/collections/posts/new"
                className="text-[11px] font-label-sm text-primary hover:underline"
              >
                Start Draft Post →
              </Link>
            </div>
          </div>

          {/* Card 5: System Diagnostics Ping */}
          <div className="border border-hairline-rule bg-paper-surface p-4 rounded shadow-xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-label-sm text-on-surface font-medium">
                API &amp; DB Diagnostics
              </div>
              <div className="text-[10px] font-label-sm text-ink-muted mt-0.5">
                {healthPing
                  ? `${healthPing.status} · ${healthPing.latencyMs}ms`
                  : 'Verify /api/health endpoint'}
              </div>
            </div>
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={pinging}
              className="px-2.5 py-1.5 rounded border border-hairline-rule bg-surface-container-low hover:border-primary text-[11px] font-label-sm text-on-surface transition-colors shrink-0"
            >
              {pinging ? 'Pinging...' : 'Run Ping'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
