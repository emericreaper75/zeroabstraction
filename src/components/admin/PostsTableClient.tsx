'use client'

import React, { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { bulkUpdatePostStatusAction } from '@/app/(admin)/admin/collections/posts/actions'
import { useAdminToast } from './AdminToastProvider'

export interface PostRowItem {
  id: string | number
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  reading_time?: number | null
  featured?: boolean | null
  updatedAt?: string | null
  topics: { id: string | number; name: string }[]
}

interface PostsTableClientProps {
  posts: PostRowItem[]
  statusFilter: string
  allCount: number
  publishedCount: number
  draftCount: number
  archivedCount: number
  page: number
  limit: number
  totalPages: number
  filteredTotal: number
}

type SortKey = 'title' | 'status' | 'updatedAt' | 'reading_time'

export function PostsTableClient({
  posts,
  statusFilter,
  allCount,
  publishedCount,
  draftCount,
  archivedCount,
  page,
  limit,
  totalPages,
  filteredTotal,
}: PostsTableClientProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())
  const [isPending, startTransition] = useTransition()

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            p.topics.some((t) => t.name.toLowerCase().includes(q))
        )
      : [...posts]

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'title') cmp = a.title.localeCompare(b.title)
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
      else if (sortKey === 'reading_time') cmp = (a.reading_time || 0) - (b.reading_time || 0)
      else {
        cmp =
          new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime()
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return list
  }, [posts, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'title' ? 'asc' : 'desc')
    }
  }

  const allSelected =
    filteredPosts.length > 0 && filteredPosts.every((p) => selectedIds.has(p.id))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredPosts.map((p) => p.id)))
    }
  }

  const toggleRow = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const downloadManifest = (subset?: PostRowItem[]) => {
    const data = subset || filteredPosts
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zeroabstraction-posts-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${data.length} treatise record(s) to JSON manifest.`)
  }

  const copySlug = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(`/writing/${slug}`)
      toast.success(`Copied /writing/${slug}`)
    } catch {
      toast.error('Clipboard unavailable.')
    }
  }

  const handleBulkStatus = (status: 'published' | 'draft') => {
    const ids = Array.from(selectedIds)
    if (!ids.length) return
    startTransition(async () => {
      const res = await bulkUpdatePostStatusAction(ids, status)
      if (res.success) {
        toast.success(`Updated ${ids.length} post(s) to ${status}.`)
        setSelectedIds(new Set())
        router.refresh()
      } else {
        toast.error(res.error || 'Bulk update failed.')
      }
    })
  }

  const pageHref = (p: number) =>
    statusFilter && statusFilter !== 'all'
      ? `/admin/collections/posts?status=${statusFilter}&page=${p}`
      : `/admin/collections/posts?page=${p}`

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Page Header */}
      <header className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-label-sm text-xs text-ink-muted">
            <Link href="/admin" className="hover:text-primary transition-colors flex items-center" title="Dashboard">
              <span className="material-symbols-outlined text-[16px]">home</span>
            </Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Posts</span>
          </div>
          <span className="font-label-sm text-[11px] px-2 py-0.5 bg-amber-wash text-primary font-medium rounded">
            {allCount} total
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 id="posts-table-title" className="font-headline-xl text-3xl text-on-surface tracking-tight leading-none">
            Posts &amp; Treatises
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => downloadManifest()}
              title="Export JSON Manifest"
              aria-label="Export JSON Manifest"
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low border border-hairline-rule text-ink-secondary font-label-md text-xs hover:bg-surface-container-high hover:text-on-surface transition-colors shadow-sm rounded"
            >
              <span className="material-symbols-outlined text-[17px]">file_download</span>
              <span className="hidden sm:inline">Export</span>
            </button>
            <Link
              href="/admin/collections/posts/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-xs shadow-sm transition-colors rounded font-medium"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>New Post</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest p-4 border border-hairline-rule rounded shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl flex items-center bg-paper-surface border border-hairline-rule rounded px-3 py-2">
            <span className="material-symbols-outlined text-ink-muted text-[18px] mr-2.5">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter posts by title, slug, or topic"
              className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-ink-muted focus:outline-none"
              placeholder="Filter manuscripts, canonical slugs, topics..."
              type="search"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-ink-muted hover:text-on-surface ml-2"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <div className="flex items-center overflow-x-auto gap-1 py-0.5 font-label-sm text-label-sm">
            <Link
              href="/admin/collections/posts"
              className={`px-3 py-1.5 rounded whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-amber-wash text-primary font-medium border border-primary/30'
                  : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'
              }`}
            >
              All ({allCount})
            </Link>
            <Link
              href="/admin/collections/posts?status=published"
              className={`px-3 py-1.5 rounded whitespace-nowrap ${
                statusFilter === 'published'
                  ? 'bg-amber-wash text-primary font-medium border border-primary/30'
                  : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'
              }`}
            >
              Published ({publishedCount})
            </Link>
            <Link
              href="/admin/collections/posts?status=draft"
              className={`px-3 py-1.5 rounded whitespace-nowrap ${
                statusFilter === 'draft'
                  ? 'bg-amber-wash text-primary font-medium border border-primary/30'
                  : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'
              }`}
            >
              Drafts ({draftCount})
            </Link>
            <Link
              href="/admin/collections/posts?status=archived"
              className={`px-3 py-1.5 rounded whitespace-nowrap ${
                statusFilter === 'archived'
                  ? 'bg-amber-wash text-primary font-medium border border-primary/30'
                  : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'
              }`}
            >
              Archived ({archivedCount})
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-amber-wash border border-primary/40 rounded shadow-sm">
          <span className="font-label-sm text-xs text-on-surface font-medium">
            {selectedIds.size} treatise(s) selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBulkStatus('published')}
              className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-label-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              Publish Selected
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleBulkStatus('draft')}
              className="px-2.5 py-1 rounded bg-surface-container-lowest border border-hairline-rule text-on-surface text-[11px] font-label-sm hover:border-primary disabled:opacity-50"
            >
              Move to Draft
            </button>
            <button
              type="button"
              onClick={() => downloadManifest(filteredPosts.filter((p) => selectedIds.has(p.id)))}
              className="px-2.5 py-1 rounded bg-surface-container-lowest border border-hairline-rule text-on-surface text-[11px] font-label-sm hover:border-primary"
            >
              Export Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-2 py-1 text-[11px] font-label-sm text-ink-muted hover:text-on-surface"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-hairline-rule rounded shadow-sm overflow-hidden flex flex-col">
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="posts-table-title"
          className="admin-table-region w-full"
        >
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr className="bg-paper-surface font-label-sm text-label-sm text-ink-muted uppercase tracking-wider border-b border-hairline-rule">
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all visible posts"
                    className="table-checkbox"
                  />
                </th>
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'title' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('title')}
                    className="inline-flex items-center gap-1 hover:text-on-surface"
                  >
                    <span>Title &amp; Canonical Slug</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {sortKey === 'title' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'status' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('status')}
                    className="inline-flex items-center gap-1 hover:text-on-surface"
                  >
                    <span>Status</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {sortKey === 'status' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Topics</th>
                <th
                  className="px-4 py-3 font-medium"
                  aria-sort={sortKey === 'updatedAt' ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort('updatedAt')}
                    className="inline-flex items-center gap-1 hover:text-on-surface"
                  >
                    <span>Updated</span>
                    <span className="material-symbols-outlined text-[14px]">
                      {sortKey === 'updatedAt' ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                    </span>
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-rule text-body-sm font-body-sm">
              {filteredPosts.map((post) => {
                const isPublished = post.status === 'published'
                const isArchived = post.status === 'archived'
                const dateStr = post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'

                return (
                  <tr key={post.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(post.id)}
                        onChange={() => toggleRow(post.id)}
                        aria-label={`Select ${post.title}`}
                        className="table-checkbox"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/collections/posts/${post.id}`}
                            className="font-headline-sm text-headline-sm text-on-surface font-medium hover:text-primary transition-colors leading-snug"
                          >
                            {post.title}
                          </Link>
                          {post.featured && (
                            <span
                              title="Featured Treatise"
                              className="material-symbols-outlined text-[14px] text-amber-500"
                            >
                              star
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-label-sm text-label-sm text-ink-muted">
                          <span className="text-primary">/writing/{post.slug}</span>
                          <span>·</span>
                          <span>{post.reading_time ? `${post.reading_time} min` : '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-label-sm text-label-sm border ${
                          isPublished
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium'
                            : isArchived
                              ? 'bg-surface-container border-hairline-rule text-ink-muted'
                              : 'bg-amber-wash border-primary/20 text-primary'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPublished ? 'bg-emerald-500' : isArchived ? 'bg-ink-muted' : 'bg-primary'
                          }`}
                        />
                        <span className="capitalize">{post.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.topics.slice(0, 3).map((t) => (
                          <span
                            key={t.id}
                            className="px-2 py-0.5 bg-surface-container-low border border-hairline-subtle rounded font-label-sm text-[11px] text-ink-secondary"
                          >
                            #{t.name}
                          </span>
                        ))}
                        {post.topics.length === 0 && (
                          <span className="text-xs text-ink-muted italic">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-label-sm text-label-sm text-on-surface">
                      {dateStr}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          type="button"
                          onClick={() => copySlug(post.slug)}
                          className="p-1 text-ink-muted hover:text-primary transition-colors"
                          title="Copy public path"
                          aria-label={`Copy path for ${post.title}`}
                        >
                          <span className="material-symbols-outlined text-[17px]">content_copy</span>
                        </button>
                        <Link
                          href={`/writing/${post.slug}`}
                          className="p-1 text-ink-muted hover:text-primary transition-colors"
                          title="Preview"
                          aria-label={`Preview ${post.title}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                        <Link
                          href={`/admin/collections/posts/${post.id}`}
                          className="p-1 text-ink-muted hover:text-on-surface transition-colors"
                          title="Edit"
                          aria-label={`Edit ${post.title}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_document</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center text-ink-muted font-body-sm">
                    <span className="material-symbols-outlined text-[40px] opacity-30 block mb-2">
                      article
                    </span>
                    <p className="mb-3">No treatises match the current filter.</p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="px-3 py-1.5 rounded border border-hairline-rule text-xs font-label-sm text-primary hover:bg-surface-container-low"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3.5 bg-paper-surface border-t border-hairline-rule flex flex-col sm:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-ink-secondary">
          <div className="flex items-center gap-3">
            <span>
              Showing{' '}
              <strong className="text-on-surface font-semibold">
                {filteredTotal === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, filteredTotal)}
              </strong>{' '}
              of <strong className="text-on-surface font-semibold">{filteredTotal}</strong> treatises
            </span>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest border border-hairline-rule hover:border-primary text-on-surface"
                >
                  Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i + 1}
                  href={pageHref(i + 1)}
                  className={`px-2.5 py-1 rounded ${
                    page === i + 1
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'bg-surface-container-lowest border border-hairline-rule hover:border-primary text-on-surface'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={pageHref(page + 1)}
                  className="px-2.5 py-1 rounded bg-surface-container-lowest border border-hairline-rule hover:border-primary text-on-surface"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
