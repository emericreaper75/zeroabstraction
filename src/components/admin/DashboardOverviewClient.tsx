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

interface OngoingTask {
  id: string
  label: string
  done: boolean
}

function formatPlateTitle(filename: string): string {
  const stem = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim()
  if (!stem) return 'Plate'
  return stem.replace(/\b\w/g, (c) => c.toUpperCase())
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getStatusPillClasses(statusLabel: string): string {
  const s = statusLabel.toUpperCase()
  if (s === 'COMPLETED' || s === 'LIVE') {
    return 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300'
  }
  if (s === 'PUBLISHED' || s === 'INGESTED') {
    return 'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300'
  }
  return 'bg-[#F1F5F9] text-[#475569] dark:bg-zinc-800 dark:text-zinc-300'
}

export function DashboardOverviewClient({
  userName,
  metrics,
  activities,
  latestPost,
  topicStats,
  recentMedia,
  readinessScore,
  healthIssues,
}: DashboardOverviewProps) {
  const toast = useAdminToast()
  const [greeting, setGreeting] = useState('Good afternoon')
  const [pillFilter, setPillFilter] = useState<'drafts' | 'published' | 'archived' | 'reports'>('drafts')
  const [scratchpad, setScratchpad] = useState('')
  const [healthPing, setHealthPing] = useState<{ ok: boolean; latencyMs: number } | null>(null)
  const [pinging, setPinging] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')

  const [tasks, setTasks] = useState<OngoingTask[]>(() => {
    const base: OngoingTask[] = [
      { id: 't1', label: 'Verify rig calibration', done: true },
      {
        id: 't2',
        label: latestPost ? `Review draft of ${latestPost.title}` : 'Review latest manuscript',
        done: false,
      },
      { id: 't3', label: `Verify ${metrics.mediaCount} ingested plates`, done: true },
    ]
    if (metrics.draftPostsCount > 0) {
      base.push({ id: 't4', label: `Finalize ${metrics.draftPostsCount} drafts`, done: false })
    }
    return base
  })

  useEffect(() => {
    setGreeting(getGreeting())
    try {
      const savedNotes = localStorage.getItem('atelier-field-scratchpad')
      if (savedNotes) setScratchpad(savedNotes)
      const savedTasks = localStorage.getItem('atelier-ongoing-tasks')
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks)
        if (Array.isArray(parsed) && parsed.length > 0) setTasks(parsed)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      try {
        localStorage.setItem('atelier-ongoing-tasks', JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    const text = newTaskText.trim()
    if (!text) return
    setTasks((prev) => {
      const next = [...prev, { id: `t-${Date.now()}`, label: text, done: false }]
      try {
        localStorage.setItem('atelier-ongoing-tasks', JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
    setNewTaskText('')
  }

  const removeTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id)
      try {
        localStorage.setItem('atelier-ongoing-tasks', JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const handleScratchpadChange = (val: string) => {
    setScratchpad(val)
    try {
      localStorage.setItem('atelier-field-scratchpad', val)
    } catch {
      /* ignore */
    }
  }

  const runHealthCheck = async () => {
    setPinging(true)
    const start = performance.now()
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      const elapsed = Math.round(performance.now() - start)
      setHealthPing({ ok: res.ok, latencyMs: elapsed })
      toast.success(`System Health OK · ${elapsed}ms`)
    } catch {
      setHealthPing({ ok: false, latencyMs: 0 })
      toast.error('Health check failed.')
    } finally {
      setPinging(false)
    }
  }

  const filteredActivities = useMemo(() => {
    if (pillFilter === 'published') {
      const pub = activities.filter((a) => a.statusLabel === 'PUBLISHED')
      return (pub.length > 0 ? pub : activities).slice(0, 5)
    }
    if (pillFilter === 'archived') {
      const arch = activities.filter((a) => a.statusLabel === 'ARCHIVED')
      return (arch.length > 0 ? arch : activities).slice(0, 5)
    }
    if (pillFilter === 'reports') {
      return activities.filter((a) => a.kind !== 'post').slice(0, 5)
    }
    return activities.slice(0, 5)
  }, [activities, pillFilter])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const totalPosts = Math.max(1, metrics.postsCount)
  const pubPct = Math.round((metrics.publishedPostsCount / totalPosts) * 100)
  const draftPct = Math.round((metrics.draftPostsCount / totalPosts) * 100)

  // Radial Readiness Ring
  const ringR = 24
  const ringC = 2 * Math.PI * ringR
  const ringOffset = ringC - (readinessScore / 100) * ringC

  // Thick-Stroke Donut Chart (132x132) with 3px white gap between segments
  const donutR = 46
  const donutC = 2 * Math.PI * donutR
  const gap = 3
  const topicTotal = Math.max(1, topicStats.slice(0, 2).reduce((acc, t) => acc + t.count, 0))
  const t1Len = Math.max(24, ((topicStats[0]?.count || 1) / topicTotal) * (donutC * 0.72) - gap)
  const t2Len = Math.max(24, ((topicStats[1]?.count || 1) / topicTotal) * (donutC * 0.72) - gap)
  const t3Len = Math.max(16, donutC - t1Len - t2Len - gap * 3)

  const topTopics = topicStats.slice(0, 2)

  return (
    <div className="space-y-5">
      {/* Greeting & Filter Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-1">
        {/* Left: Greeting + Live Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-paper-surface flex items-center justify-center text-[#0F172A] dark:text-slate-100 shrink-0" title="Observatory Workbench">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 12l7-7" />
              <circle cx="12" cy="12" r="3" />
              <path d="M16 2h6v6" />
            </svg>
          </div>
          <div>
            <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
              {greeting}, {userName}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-[13px] text-ink-secondary">
              <span className="inline-flex items-center gap-1.5 text-[#059669] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                Live
              </span>
              <span className="text-ink-muted">·</span>
              <span>{metrics.draftPostsCount} drafts awaiting</span>
            </div>
          </div>
        </div>

        {/* Center: Floating Horizontal Pill Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: 'drafts', label: 'Drafts' },
              { key: 'published', label: 'Published' },
              { key: 'archived', label: 'Archived' },
              { key: 'reports', label: 'Reports' },
            ] as const
          ).map((tab) => {
            const active = pillFilter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setPillFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  active
                    ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-paper-surface text-ink-secondary hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right: Compact Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/collections/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New</span>
          </Link>
          <Link
            href="/admin/collections/projects/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-paper-surface text-on-surface text-[13px] font-medium hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-ink-secondary">
              rocket_launch
            </span>
            <span>Rig</span>
          </Link>
          <Link
            href="/admin/collections/media"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-paper-surface text-on-surface text-[13px] font-medium hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-ink-secondary">
              add_photo_alternate
            </span>
            <span>Plate</span>
          </Link>
          <Link
            href="/admin/globals/current-state"
            title="Field Telemetry"
            aria-label="Field Telemetry"
            className="w-9 h-9 rounded-full bg-paper-surface text-ink-secondary hover:text-on-surface flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">sensors</span>
          </Link>
        </div>
      </div>

      {/* 3-Column Studio Grid Architecture (25% / 50% / 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN (3 cols — 25%): Focus & Readiness Card */}
        <div className="lg:col-span-3 flex">
          <div className="w-full bg-paper-surface rounded-[20px] p-6 flex flex-col justify-between space-y-5">
            {/* Section 1: Active Manuscript */}
            <div className="pb-5 border-b border-[#F1F5F9] dark:border-zinc-800 space-y-2.5">
              <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
                Active Manuscript
              </h2>
              {latestPost ? (
                <>
                  <p className="text-[14px] font-medium text-on-surface leading-snug">
                    {latestPost.title}
                  </p>
                  <Link
                    href={`/admin/collections/posts/${latestPost.id}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-secondary hover:text-on-surface transition-colors pt-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Resume</span>
                    <span className="text-ink-muted">›</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/admin/collections/posts/new"
                  className="text-[13px] text-[#2563EB] hover:underline"
                >
                  Create your first manuscript ›
                </Link>
              )}
            </div>

            {/* Section 2: Readiness */}
            <div className="pb-5 border-b border-[#F1F5F9] dark:border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-studio-display text-[16px] font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-ink-secondary">
                    verified
                  </span>
                  Readiness
                </h2>
                <span className="font-mono-telemetry text-[12px] text-ink-secondary">
                  {readinessScore}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <svg width="60" height="60" viewBox="0 0 60 60" className="shrink-0 -rotate-90">
                  <circle
                    cx="30"
                    cy="30"
                    r={ringR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-[#E2E8F0] dark:text-zinc-800"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r={ringR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={ringC}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    className={`${readinessScore >= 100 ? 'text-[#059669]' : 'text-[#2563EB]'} transition-all duration-500`}
                  />
                </svg>

                <ul className="flex-1 space-y-2 text-[12px]">
                  {healthIssues.map((issue) => (
                    <li key={issue.id}>
                      <Link
                        href={issue.href}
                        className="flex items-center justify-between gap-2 text-[#475569] dark:text-slate-300 hover:text-on-surface transition-colors"
                      >
                        <span className="truncate">{issue.label}</span>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 font-mono-telemetry text-[10px] font-semibold ${
                            issue.count === 0
                              ? 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-[#FFF7ED] text-[#D97706] dark:bg-amber-950/60 dark:text-amber-300'
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

            {/* Section 3: On Going Tasks (Apricot Wash Inset) */}
            <div className="rounded-[14px] bg-[#FFF7ED] dark:bg-amber-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-studio-display text-[15px] font-semibold text-on-surface">
                  On Going Tasks
                </h2>
                <span className="font-mono-telemetry text-[11px] text-ink-muted">
                  {tasks.filter((t) => t.done).length}/{tasks.length}
                </span>
              </div>
              <ul className="space-y-2.5">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-start justify-between gap-2 group">
                    <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#0F172A] cursor-pointer shrink-0"
                      />
                      <span
                        className={`text-[13px] leading-snug transition-colors ${
                          task.done
                            ? 'text-ink-muted line-through'
                            : 'text-on-surface group-hover:text-[#0F172A]'
                        }`}
                      >
                        {task.label}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      aria-label={`Remove task ${task.label}`}
                      className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-rose-500 transition-opacity shrink-0"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </li>
                ))}
              </ul>
              <form onSubmit={addTask} className="pt-1 flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add task..."
                  aria-label="Add ongoing task"
                  className="flex-1 bg-white/70 dark:bg-zinc-900/60 rounded-lg px-2.5 py-1.5 text-[12px] text-on-surface placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-[#0F172A]/20"
                />
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  aria-label="Add task"
                  className="p-1.5 rounded-lg bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 disabled:opacity-30 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (6 cols — 50%): Operations & Activity */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Top Card: Overview & Content Composition */}
          <div className="bg-paper-surface rounded-[20px] p-6 space-y-5">
            <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
              Overview &amp; Content Composition
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:divide-x md:divide-[#F1F5F9] dark:md:divide-zinc-800 items-center">
              {/* Left Split: Thick-Stroke Donut Chart + Topic Legend */}
              <div className="md:col-span-5 flex flex-col items-center space-y-4">
                <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
                  <circle
                    cx="66"
                    cy="66"
                    r={donutR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="22"
                    strokeDasharray={`${t3Len} ${donutC}`}
                    strokeDashoffset={-(t1Len + gap + t2Len + gap)}
                    className="text-[#CBD5E1] dark:text-zinc-700"
                  />
                  <circle
                    cx="66"
                    cy="66"
                    r={donutR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="22"
                    strokeDasharray={`${t2Len} ${donutC}`}
                    strokeDashoffset={-(t1Len + gap)}
                    className="text-[#2563EB]"
                  />
                  <circle
                    cx="66"
                    cy="66"
                    r={donutR}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="22"
                    strokeDasharray={`${t1Len} ${donutC}`}
                    className="text-[#0F172A] dark:text-slate-100"
                  />
                </svg>

                <div className="w-full space-y-2 pt-1">
                  {topTopics.map((topic, idx) => (
                    <div key={topic.id} className="flex items-center justify-between text-[13px]">
                      <span className="flex items-center gap-2 text-on-surface truncate pr-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            idx === 0 ? 'bg-[#0F172A] dark:bg-slate-100' : 'bg-[#2563EB]'
                          }`}
                        />
                        <span className="truncate">#{topic.name}</span>
                      </span>
                      <span className="font-mono-telemetry text-[12px] text-[#475569] dark:text-slate-300 shrink-0">
                        {topic.count} {topic.count === 1 ? 'post' : 'posts'}
                      </span>
                    </div>
                  ))}
                  {topTopics.length === 0 && (
                    <div className="text-center text-[12px] text-ink-muted">No topics indexed</div>
                  )}
                </div>
              </div>

              {/* Right Split: Clean 2-Column Metric Grid */}
              <div className="md:col-span-7 md:pl-6 grid grid-cols-2 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
                <Link
                  href="/admin/collections/posts?status=draft"
                  className="pb-4 pr-4 border-r border-[#F1F5F9] dark:border-zinc-800 hover:opacity-75 transition-opacity"
                >
                  <div className="font-mono-telemetry text-[24px] font-semibold text-on-surface leading-none">
                    {pad(metrics.draftPostsCount)}
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1.5">Drafts</div>
                </Link>

                <Link
                  href="/admin/collections/posts"
                  className="pb-4 pl-4 hover:opacity-75 transition-opacity"
                >
                  <div className="font-mono-telemetry text-[24px] font-semibold text-on-surface leading-none">
                    {pad(metrics.postsCount)}
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1.5">
                    Posts ({metrics.publishedPostsCount} live)
                  </div>
                </Link>

                <Link
                  href="/admin/collections/projects"
                  className="col-span-2 py-4 hover:opacity-75 transition-opacity"
                >
                  <div className="font-mono-telemetry text-[24px] font-semibold text-on-surface leading-none">
                    {pad(metrics.projectsCount)}
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1.5">Rigs</div>
                </Link>

                <Link
                  href="/admin/collections/media"
                  className="pt-4 pr-4 border-r border-[#F1F5F9] dark:border-zinc-800 hover:opacity-75 transition-opacity"
                >
                  <div className="font-mono-telemetry text-[24px] font-semibold text-on-surface leading-none">
                    {pad(metrics.mediaCount)}
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1.5">Plates</div>
                </Link>

                <Link
                  href="/admin/collections/topics"
                  className="pt-4 pl-4 hover:opacity-75 transition-opacity"
                >
                  <div className="font-mono-telemetry text-[24px] font-semibold text-on-surface leading-none">
                    {pad(metrics.topicsCount)}
                  </div>
                  <div className="text-[13px] text-ink-secondary mt-1.5">Topics</div>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Card: Recent Activity & Pipeline Status */}
          <div className="bg-paper-surface rounded-[20px] p-6 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
                Recent Activity &amp; Pipeline Status
              </h2>
              <Link
                href="/admin/collections/posts"
                className="text-[12px] text-ink-secondary hover:text-on-surface transition-colors"
              >
                View all ›
              </Link>
            </div>

            <div className="divide-y divide-[#F1F5F9] dark:divide-zinc-800">
              {filteredActivities.map((item) => {
                const icon =
                  item.kind === 'post'
                    ? 'article'
                    : item.kind === 'project'
                      ? 'rocket_launch'
                      : 'image'
                const dateStr = item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-surface-container-low/60 -mx-2 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-[18px] text-ink-secondary shrink-0">
                        {icon}
                      </span>
                      <span className="text-[14px] font-medium text-on-surface truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`font-mono-telemetry text-[10px] font-semibold uppercase tracking-[0.06em] px-2.5 py-1 rounded-full ${getStatusPillClasses(
                          item.statusLabel
                        )}`}
                      >
                        {item.statusLabel}
                      </span>
                      <span className="font-mono-telemetry text-[12px] text-ink-secondary w-14 text-right">
                        {dateStr}
                      </span>
                    </div>
                  </Link>
                )
              })}
              {filteredActivities.length === 0 && (
                <div className="py-10 text-center text-[13px] text-ink-muted">
                  No recent activity in this view.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (3 cols — 25%): Plates, Notes & System Health */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Plates Card: 3-column 3:4 Thumbnail Grid */}
          <div className="bg-paper-surface rounded-[20px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
                Plates
              </h2>
              <Link
                href="/admin/collections/media"
                className="text-[12px] text-ink-secondary hover:text-on-surface transition-colors"
              >
                All ›
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {recentMedia.slice(0, 3).map((m) => (
                <Link
                  key={m.id}
                  href="/admin/collections/media"
                  className="group space-y-1.5 min-w-0"
                >
                  <div className="aspect-[3/4] rounded-[12px] overflow-hidden bg-surface-container-low">
                    {m.url && m.mimeType?.startsWith('image/') ? (
                      <img
                        src={m.url}
                        alt={m.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-ink-muted text-[20px]">
                          image
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#475569] dark:text-slate-300 truncate text-center">
                    {formatPlateTitle(m.filename)}
                  </p>
                </Link>
              ))}
              {recentMedia.length === 0 && (
                <div className="col-span-3 py-8 text-center text-[12px] text-ink-muted">
                  No plates uploaded.
                </div>
              )}
            </div>
          </div>

          {/* Quick Field Notes Card */}
          <div className="bg-paper-surface rounded-[20px] p-6 space-y-3 flex-1 flex flex-col">
            <h2 className="font-studio-display text-[16px] font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-ink-secondary">
                sticky_note_2
              </span>
              Quick Field Notes
            </h2>
            <textarea
              value={scratchpad}
              onChange={(e) => handleScratchpadChange(e.target.value)}
              rows={4}
              placeholder="Quick field notes..."
              aria-label="Quick field notes"
              className="w-full flex-1 bg-[#F8FAFC] dark:bg-zinc-900 border-0 rounded-[12px] p-3.5 text-[13px] text-on-surface placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 resize-none"
            />
          </div>

          {/* System Health Card */}
          <div className="bg-paper-surface rounded-[20px] p-6 space-y-3">
            <h2 className="font-studio-display text-[16px] font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-ink-secondary">
                monitor_heart
              </span>
              System Health
            </h2>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300 text-[12px] font-medium">
                <span className="material-symbols-outlined text-[15px]">sensors</span>
                {healthPing
                  ? `${healthPing.ok ? 'Healthy' : 'Error'} · ${healthPing.latencyMs}ms`
                  : 'System Health'}
              </span>
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={pinging}
                className="px-3.5 py-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[12px] font-medium text-on-surface transition-colors"
              >
                {pinging ? '...' : 'Ping'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
