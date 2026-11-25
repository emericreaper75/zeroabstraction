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
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>COLLECTIONS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">ENGINEERING RIGS</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 id="projects-table-title" className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">
              Projects &amp; Rigs
            </h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">
              Engineering rigs, instrumentation experiments, and software platforms.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={exportManifest}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-hairline-rule text-ink-secondary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high hover:text-on-surface transition-colors shadow-sm rounded"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Manifest</span>
            </button>
            <Link
              href="/admin/collections/projects/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors rounded"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              New Project
            </Link>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-surface-container-lowest p-4 border border-hairline-rule rounded shadow-sm">
        <div className="relative flex-1 max-w-xl flex items-center bg-paper-surface border border-hairline-rule rounded px-3 py-2">
          <span className="material-symbols-outlined text-ink-muted text-[18px] mr-2.5">search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter rigs by title or slug..."
            aria-label="Filter projects"
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-ink-muted focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto font-label-sm text-label-sm">
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
              className={`px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
                statusFilter === t.key
                  ? 'bg-amber-wash text-primary font-medium border border-primary/30'
                  : 'bg-paper-surface text-ink-secondary hover:bg-surface-container'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-hairline-rule rounded shadow-sm overflow-hidden flex flex-col">
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="projects-table-title"
          className="admin-table-region w-full"
        >
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-paper-surface font-label-sm text-label-sm text-ink-muted uppercase tracking-wider border-b border-hairline-rule">
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'title' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" onClick={() => toggleSort('title')} className="inline-flex items-center gap-1 hover:text-on-surface">
                    <span>Title &amp; Slug</span>
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
