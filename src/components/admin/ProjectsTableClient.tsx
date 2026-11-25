'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAdminToast } from './AdminToastProvider'

export interface ProjectRowItem {
  id: string | number
  title: string
  slug: string
  status: string
  year?: number | null
  featured?: boolean | null
  linksCount: number
  updatedAt?: string | null
}

export function ProjectsTableClient({ projects }: { projects: ProjectRowItem[] }) {
  const toast = useAdminToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'archived'>('all')
  const [sortKey, setSortKey] = useState<'title' | 'year' | 'status'>('year')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return projects
      .filter((p) => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false
        if (!q) return true
        return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortKey === 'title') cmp = a.title.localeCompare(b.title)
        else if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
        else cmp = (a.year || 0) - (b.year || 0)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [projects, search, statusFilter, sortKey, sortDir])

  const toggleSort = (key: 'title' | 'year' | 'status') => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir(key === 'title' ? 'asc' : 'desc')
    }
  }

  const exportManifest = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zeroabstraction-projects-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} project(s) to JSON manifest.`)
  }

  const copySlug = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`/projects/${slug}`)
      toast.success(`Copied /projects/${slug}`)
    } catch {
      toast.error('Clipboard unavailable.')
    }
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h1 id="projects-table-title" className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
            Rigs
          </h1>
          <span className="font-mono-telemetry text-[11px] px-2.5 py-0.5 bg-paper-surface text-ink-secondary rounded-full">
            {projects.length}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={exportManifest}
            title="Export JSON Manifest"
            aria-label="Export JSON Manifest"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-paper-surface text-ink-secondary text-[13px] font-medium hover:text-on-surface transition-colors rounded-full"
          >
            <span className="material-symbols-outlined text-[17px]">file_download</span>
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link
            href="/admin/collections/projects/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] hover:opacity-90 transition-opacity rounded-full font-medium"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>New Rig</span>
          </Link>
        </div>
      </header>

      {/* Unified Card: Toolbar + Table */}
      <div className="bg-paper-surface rounded-[20px] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#F1F5F9] dark:border-zinc-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md flex items-center bg-[#F8FAFC] dark:bg-zinc-900 rounded-full px-3.5 py-2">
            <span className="material-symbols-outlined text-ink-muted text-[18px] mr-2">search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rigs..."
              aria-label="Filter projects"
              className="w-full bg-transparent text-[13px] text-on-surface placeholder:text-ink-muted focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[13px]">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'in_progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
                { key: 'archived', label: 'Archived' },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setStatusFilter(t.key)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  statusFilter === t.key
                    ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-[#F8FAFC] dark:bg-zinc-900 text-ink-secondary hover:text-on-surface'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="projects-table-title"
          className="admin-table-region w-full"
        >
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-paper-surface typo-label border-b border-[#F1F5F9] dark:border-zinc-800">
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'title' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" onClick={() => toggleSort('title')} className="inline-flex items-center gap-1 hover:text-on-surface">
                    <span>Rig Title</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {sortKey === 'title' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'status' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" onClick={() => toggleSort('status')} className="inline-flex items-center gap-1 hover:text-on-surface">
                    <span>Status</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {sortKey === 'status' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'year' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" onClick={() => toggleSort('year')} className="inline-flex items-center gap-1 hover:text-on-surface">
                    <span>Year</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {sortKey === 'year' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Links</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-rule text-body-sm font-body-sm">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/collections/projects/${project.id}`}
                          className="font-headline-sm text-headline-sm text-on-surface font-medium hover:text-primary transition-colors leading-snug"
                        >
                          {project.title}
                        </Link>
                        {project.featured && (
                          <span className="material-symbols-outlined text-[14px] text-amber-500" title="Featured Rig">
                            star
                          </span>
                        )}
                      </div>
                      <span className="font-label-sm text-label-sm text-primary">/projects/{project.slug}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-surface-container-low border border-hairline-rule font-label-sm text-[11px] text-ink-secondary uppercase">
                      {project.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-label-sm text-label-sm text-on-surface">
                    {project.year || '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-label-sm text-xs text-ink-muted">
                    {project.linksCount > 0 ? `${project.linksCount} ext` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        type="button"
                        onClick={() => copySlug(project.slug)}
                        className="p-1 text-ink-muted hover:text-primary transition-colors"
                        title="Copy public path"
                        aria-label={`Copy path for ${project.title}`}
                      >
                        <span className="material-symbols-outlined text-[17px]">content_copy</span>
                      </button>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="p-1 text-ink-muted hover:text-primary transition-colors"
                        title="Preview"
                        aria-label={`Preview ${project.title}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                      <Link
                        href={`/admin/collections/projects/${project.id}`}
                        className="p-1 text-ink-muted hover:text-on-surface transition-colors"
                        title="Edit"
                        aria-label={`Edit ${project.title}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit_document</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-ink-muted font-body-sm">
                    No projects match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
