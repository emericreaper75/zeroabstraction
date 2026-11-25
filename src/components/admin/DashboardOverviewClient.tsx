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

function formatBytes(bytes?: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
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
  const [greeting, setGreeting] = useState('Welcome')
  const [activityTab, setActivityTab] = useState<'all' | 'post' | 'project' | 'media'>('all')
  const [scratchpad, setScratchpad] = useState('')
  const [healthPing, setHealthPing] = useState<{ ok: boolean; latencyMs: number } | null>(null)
  const [pinging, setPinging] = useState(false)

  useEffect(() => {
    setGreeting(getGreeting())
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
      toast.success('Telemetry JSON copied.')
    } catch {
      toast.error('Clipboard unavailable.')
    }
  }

  const runHealthCheck = async () => {
    setPinging(true)
    const start = performance.now()
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      const elapsed = Math.round(performance.now() - start)
      setHealthPing({ ok: res.ok, latencyMs: elapsed })
      toast.success(`Health OK · ${elapsed}ms`)
    } catch {
      setHealthPing({ ok: false, latencyMs: 0 })
      toast.error('Health check failed.')
    } finally {
      setPinging(false)
    }
  }

  const filteredActivities = useMemo(() => {
    if (activityTab === 'all') return activities.slice(0, 6)
    return activities.filter((a) => a.kind === activityTab).slice(0, 6)
  }, [activities, activityTab])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const totalPosts = Math.max(1, metrics.postsCount)
  const pubPct = Math.round((metrics.publishedPostsCount / totalPosts) * 100)
  const draftPct = Math.round((metrics.draftPostsCount / totalPosts) * 100)
  const archPct = Math.max(0, 100 - pubPct - draftPct)

  const ringRadius = 22
  const ringCircumference = 2 * Math.PI * ringRadius
  const ringOffset = ringCircumference - (readinessScore / 100) * ringCircumference

  return (
    <div className="space-y-6">
      {/* Compact Header + Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-hairline-rule pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-wash border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">hub</span>
          </div>
          <div>
            <h1 className="font-headline-md text-2xl sm:text-3xl text-on-surface italic font-normal tracking-tight leading-none">
              {greeting}, {userName}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] font-label-sm text-ink-muted">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
              <span>·</span>
              <span>{metrics.draftPostsCount} drafts awaiting</span>
            </div>
          </div>
        </div>

        {/* Icon-First Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/collections/posts/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-primary text-on-primary text-xs font-label-md hover:bg-accent-ochre transition-colors shadow-sm font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span>New Post</span>
          </Link>
          <Link
            href="/admin/collections/projects/new"
            title="New Project Rig"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-hairline-rule bg-paper-surface text-on-surface text-xs font-label-md hover:border-primary/50 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
            <span>Rig</span>
          </Link>
          <Link
            href="/admin/collections/media"
            title="Upload Media Plate"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-hairline-rule bg-paper-surface text-on-surface text-xs font-label-md hover:border-primary/50 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
            <span>Plate</span>
          </Link>
          <Link
            href="/admin/globals/current-state"
            title="Update Field Telemetry"
            aria-label="Update Field Telemetry"
            className="inline-flex items-center justify-center p-2 rounded border border-hairline-rule bg-paper-surface text-ink-secondary hover:border-primary/50 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">sensors</span>
          </Link>
        </div>
      </div>

      {/* Priority KPI Strip (Drafts & Posts Highlighted) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Highlighted KPI 1: Draft Queue (Most Actionable) */}
        <Link
          href="/admin/collections/posts?status=draft"
          className="p-4 rounded border border-primary/50 bg-paper-surface hover:border-primary transition-colors group shadow-xs"
        >
          <div className="flex items-center justify-between text-primary">
            <span className="material-symbols-outlined text-[20px]">draw</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-wash text-primary font-medium">
              Priority
            </span>
          </div>
          <div className="text-3xl text-on-surface mt-2 leading-none font-normal">
            {pad(metrics.draftPostsCount)}
          </div>
          <div className="text-xs text-ink-secondary mt-1.5">Drafts</div>
        </Link>

        {/* Highlighted KPI 2: Posts */}
        <Link
          href="/admin/collections/posts"
          className="p-4 rounded border border-hairline-rule bg-paper-surface hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center justify-between text-ink-muted group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">article</span>
            <svg viewBox="0 0 48 16" className="w-12 h-4 text-primary/70" aria-hidden="true">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.75" points="2,13 14,10 26,11 36,5 46,3" />
            </svg>
          </div>
          <div className="font-headline-md text-3xl text-on-surface mt-2 leading-none">
            {pad(metrics.postsCount)}
          </div>
          <div className="text-xs font-label-sm text-ink-muted mt-1.5">
            Posts <span className="text-emerald-600 dark:text-emerald-400">({metrics.publishedPostsCount} live)</span>
          </div>
        </Link>

        {/* KPI 3: Projects */}
        <Link
          href="/admin/collections/projects"
          className="p-4 rounded border border-hairline-rule bg-paper-surface hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center justify-between text-ink-muted group-hover:text-emerald-500 transition-colors">
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
            <svg viewBox="0 0 48 16" className="w-12 h-4 text-emerald-500/70" aria-hidden="true">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.75" points="2,12 14,12 26,8 36,9 46,4" />
            </svg>
          </div>
          <div className="font-headline-md text-3xl text-on-surface mt-2 leading-none">
            {pad(metrics.projectsCount)}
          </div>
          <div className="text-xs font-label-sm text-ink-muted mt-1.5">Projects</div>
        </Link>

        {/* KPI 4: Media */}
        <Link
          href="/admin/collections/media"
          className="p-4 rounded border border-hairline-rule bg-paper-surface hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center justify-between text-ink-muted group-hover:text-sky-500 transition-colors">
            <span className="material-symbols-outlined text-[20px]">photo_library</span>
            <svg viewBox="0 0 48 16" className="w-12 h-4 text-sky-500/70" aria-hidden="true">
              <polyline fill="none" stroke="currentColor" strokeWidth="1.75" points="2,14 14,9 26,11 36,5 46,4" />
            </svg>
          </div>
          <div className="font-headline-md text-3xl text-on-surface mt-2 leading-none">
            {metrics.mediaCount}
          </div>
          <div className="text-xs font-label-sm text-ink-muted mt-1.5">Plates</div>
        </Link>

        {/* KPI 5: Topics */}
        <Link
          href="/admin/collections/topics"
          className="col-span-2 lg:col-span-1 p-4 rounded border border-hairline-rule bg-paper-surface hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center justify-between text-ink-muted group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">label</span>
            <span className="material-symbols-outlined text-[15px] opacity-40">arrow_forward</span>
          </div>
          <div className="font-headline-md text-3xl text-on-surface mt-2 leading-none">
            {pad(metrics.topicsCount)}
          </div>
          <div className="text-xs font-label-sm text-ink-muted mt-1.5">Topics</div>
        </Link>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Highlighted Card: Latest Manuscript / Resume Work */}
          {latestPost && (
            <div className="border border-primary/40 bg-paper-surface p-5 rounded-lg shadow-xs relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-label-sm text-primary bg-amber-wash px-2 py-0.5 rounded font-medium">
                  <span className="material-symbols-outlined text-[14px]">bookmark</span>
                  Active Manuscript
                </span>
                <div className="flex items-center gap-2 text-[11px] font-label-sm text-ink-muted">
                  {latestPost.reading_time && (
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      {latestPost.reading_time}m
                    </span>
                  )}
                  <span
                    className={`px-1.5 py-0.5 rounded uppercase text-[10px] ${
                      latestPost.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-wash text-primary'
                    }`}
                  >
                    {latestPost.status || 'draft'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-headline-md text-xl text-on-surface italic font-normal leading-snug">
                  {latestPost.title}
                </h2>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/writing/${latestPost.slug}`}
                    title="Preview"
                    aria-label="Preview latest manuscript"
                    className="p-2 rounded border border-hairline-rule text-ink-secondary hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </Link>
                  <Link
                    href={`/admin/collections/posts/${latestPost.id}`}
                    className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-xs py-2 px-4 rounded hover:bg-accent-ochre transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_document</span>
                    Resume
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Icon-Driven Recent Activity */}
          <section>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">history</span>
                <h2 className="font-headline-md text-lg text-on-surface italic">Recent</h2>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded border border-hairline-rule">
                {(
                  [
                    { key: 'all', icon: 'apps', label: 'All' },
                    { key: 'post', icon: 'article', label: 'Posts' },
                    { key: 'project', icon: 'qr_code_2', label: 'Rigs' },
                    { key: 'media', icon: 'image', label: 'Plates' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActivityTab(t.key)}
                    title={t.label}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-label-sm transition-colors ${
                      activityTab === t.key
                        ? 'bg-primary text-on-primary font-medium'
                        : 'text-ink-muted hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">{t.icon}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-hairline-rule divide-y divide-hairline-subtle bg-paper-surface shadow-xs rounded overflow-hidden">
              {filteredActivities.map((item) => {
                const icon =
                  item.kind === 'post' ? 'article' : item.kind === 'project' ? 'qr_code_2' : 'image'
                const iconColor =
                  item.kind === 'post'
                    ? 'text-primary'
                    : item.kind === 'project'
                      ? 'text-emerald-500'
                      : 'text-sky-500'
                const dateStr = item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : ''

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`material-symbols-outlined text-[18px] shrink-0 ${iconColor}`}>
                        {icon}
                      </span>
                      <span className="text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] font-label-sm px-1.5 py-0.5 rounded bg-surface-container-low text-ink-muted">
                        {item.statusLabel}
                      </span>
                      <span className="font-label-sm text-[11px] text-ink-muted w-12 text-right">
                        {dateStr}
                      </span>
                    </div>
                  </Link>
                )
              })}
              {filteredActivities.length === 0 && (
                <div className="p-8 text-center text-ink-muted text-xs">No recent items.</div>
              )}
            </div>
          </section>

          {/* Compact Visual Composition + Recent Plates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Archive Composition */}
            <section className="border border-hairline-rule bg-paper-surface p-4 rounded shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-label-sm text-on-surface font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">bar_chart</span>
                  Composition
                </span>
                <span className="text-[11px] font-label-sm text-primary">{pubPct}% live</span>
              </div>
              <div className="w-full h-2.5 rounded overflow-hidden bg-surface-container-low flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${pubPct}%` }} title="Published" />
                <div className="bg-primary h-full" style={{ width: `${draftPct}%` }} title="Drafts" />
                <div className="bg-ink-muted/40 h-full" style={{ width: `${archPct}%` }} title="Archived" />
              </div>
              <div className="space-y-2 pt-1">
                {topicStats.slice(0, 4).map((topic) => {
                  const maxCount = Math.max(1, ...topicStats.map((t) => t.count))
                  const widthPct = Math.max(8, Math.round((topic.count / maxCount) * 100))
                  return (
                    <div key={topic.id} className="grid grid-cols-12 items-center gap-2 text-[11px]">
                      <span className="col-span-5 truncate font-label-sm text-ink-secondary">
                        #{topic.name}
                      </span>
                      <div className="col-span-5 h-1.5 bg-surface-container-low rounded overflow-hidden">
                        <div className="h-full bg-primary/80 rounded" style={{ width: `${widthPct}%` }} />
                      </div>
                      <span className="col-span-2 text-right font-label-sm text-ink-muted">
                        {topic.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Recent Media Plates */}
            <section className="border border-hairline-rule bg-paper-surface p-4 rounded shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-label-sm text-on-surface font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-sky-500">photo_library</span>
                  Plates
                </span>
                <Link
                  href="/admin/collections/media"
                  className="text-[11px] font-label-sm text-primary hover:underline"
                >
                  All →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recentMedia.slice(0, 4).map((m) => (
                  <Link
                    key={m.id}
                    href="/admin/collections/media"
                    title={`${m.filename} (${formatBytes(m.filesize)})`}
                    className="group aspect-[16/10] border border-hairline-rule rounded overflow-hidden bg-surface-container-low relative hover:border-primary/50 transition-colors"
                  >
                    {m.url && m.mimeType?.startsWith('image/') ? (
                      <img
                        src={m.url}
                        alt={m.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-ink-muted text-[22px]">
                          description
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Highlighted Card: Archive Readiness Ring */}
          <div className="border border-hairline-rule bg-paper-surface p-4 rounded shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-label-sm text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                Readiness
              </span>
              <span className="text-xs font-label-sm text-primary font-semibold">{readinessScore}%</span>
            </div>
            <div className="flex items-center gap-4">
              <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={ringRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-surface-container-high"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={ringRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <ul className="flex-1 space-y-1 text-[11px]">
                {healthIssues.map((issue) => (
                  <li key={issue.id}>
                    <Link
                      href={issue.href}
                      className="flex items-center justify-between hover:text-primary transition-colors"
                    >
                      <span className="text-ink-secondary truncate pr-2">{issue.label}</span>
                      <span
                        className={`font-label-sm px-1.5 py-0.5 rounded text-[10px] ${
                          issue.count === 0
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-wash text-primary font-semibold'
                        }`}
                      >
                        {issue.count === 0 ? '✓' : issue.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Icon-Labeled Field Telemetry */}
          <div className="border border-hairline-rule bg-paper-surface p-4 rounded shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-hairline-rule mb-3">
              <span className="text-xs font-label-sm text-on-surface font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Right Now
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={copyTelemetryJson}
                  title="Copy telemetry JSON"
                  aria-label="Copy telemetry JSON"
                  className="p-1 text-ink-muted hover:text-primary rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">data_object</span>
                </button>
                <Link
                  href="/admin/globals/current-state"
                  title="Edit Telemetry"
                  aria-label="Edit Field Telemetry"
                  className="p-1 text-ink-muted hover:text-primary rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                </Link>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs">
              {[
                { icon: 'auto_stories', label: 'Studying', value: currentState?.studying },
                { icon: 'memory', label: 'Building', value: currentState?.building },
                { icon: 'article', label: 'Reading', value: currentState?.reading },
                { icon: 'psychology', label: 'Thinking', value: currentState?.thinking_about },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2.5" title={item.label}>
                  <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-on-surface leading-snug line-clamp-2">
                    {item.value || <span className="italic text-ink-muted">—</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compact Scratchpad */}
          <div className="border border-hairline-rule bg-paper-surface p-4 rounded shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-label-sm text-on-surface font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">sticky_note_2</span>
                Notes
              </span>
              {scratchpad && (
                <button
                  type="button"
                  onClick={() => handleScratchpadChange('')}
                  title="Clear notes"
                  aria-label="Clear scratchpad"
                  className="text-ink-muted hover:text-rose-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
                </button>
              )}
            </div>
            <textarea
              value={scratchpad}
              onChange={(e) => handleScratchpadChange(e.target.value)}
              rows={3}
              placeholder="Quick field notes..."
              aria-label="Field scratchpad notes"
              className="w-full bg-surface-container-low border border-hairline-rule rounded p-2 text-xs text-on-surface placeholder:text-ink-muted focus:outline-none focus:border-primary resize-y"
            />
          </div>

          {/* Compact API Health Ping */}
          <div className="border border-hairline-rule bg-paper-surface px-4 py-3 rounded shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-label-sm text-ink-secondary">
              <span className="material-symbols-outlined text-[16px] text-emerald-500">monitor_heart</span>
              <span>
                {healthPing
                  ? `${healthPing.ok ? 'OK' : 'ERR'} · ${healthPing.latencyMs}ms`
                  : 'System Health'}
              </span>
            </div>
            <button
              type="button"
              onClick={runHealthCheck}
              disabled={pinging}
              className="px-2.5 py-1 rounded border border-hairline-rule bg-surface-container-low hover:border-primary text-[11px] font-label-sm text-on-surface transition-colors"
            >
              {pinging ? '...' : 'Ping'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
