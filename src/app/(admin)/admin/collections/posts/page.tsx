import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function PostsCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const payload = await getPayload({ config: configPromise })
  const page = parseInt(params.page || '1', 10)
  const limit = 10

  const postsResult = await payload.find({
    collection: 'posts',
    limit,
    page,
    sort: '-updatedAt',
  })

  const allCount = postsResult.totalDocs
  const publishedCount = (await payload.count({ collection: 'posts', where: { status: { equals: 'published' } } })).totalDocs
  const draftCount = allCount - publishedCount

  const statusFilter = params.status || 'all'

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Page Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
            <span>OBSERVATORY</span>
            <span>/</span>
            <span>COLLECTIONS</span>
            <span>/</span>
            <span className="text-ink-primary font-medium tracking-wide">ESSAYS &amp; TREATISES</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-surface-container-high text-ink-secondary">SYS: 0x892A</span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-amber-wash text-accent-ochre font-medium">100% HEALTH</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Posts &amp; Treatises</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Peer-reviewed astronomical treatises and observational reports.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-ink-secondary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors shadow-sm" type="button">
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Manifest</span>
            </button>
            <Link href="/admin/collections/posts/new" className="flex items-center gap-1.5 px-4 py-2 bg-accent-amber hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>New Post</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl flex items-center bg-paper-surface px-3 py-2">
            <span className="material-symbols-outlined text-ink-muted text-[18px] mr-2.5">search</span>
            <input className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-ink-muted focus:outline-none" placeholder="Search manuscripts, canonical slugs, topics..." type="text" />
            <kbd className="font-label-sm text-label-sm text-ink-muted bg-surface-container-high px-2 py-0.5 ml-2">⌘K</kbd>
          </div>
          <div className="flex items-center overflow-x-auto gap-1 py-0.5 font-label-sm text-label-sm">
            <Link href="/admin/collections/posts" className={`px-3 py-1.5 whitespace-nowrap ${statusFilter === 'all' ? 'bg-amber-wash text-accent-ochre font-medium shadow-sm' : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'}`}>All ({allCount})</Link>
            <Link href="/admin/collections/posts?status=published" className={`px-3 py-1.5 whitespace-nowrap ${statusFilter === 'published' ? 'bg-amber-wash text-accent-ochre font-medium shadow-sm' : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'}`}>Published ({publishedCount})</Link>
            <Link href="/admin/collections/posts?status=draft" className={`px-3 py-1.5 whitespace-nowrap ${statusFilter === 'draft' ? 'bg-amber-wash text-accent-ochre font-medium shadow-sm' : 'bg-paper-surface hover:bg-surface-container text-ink-secondary transition-colors'}`}>Drafts ({draftCount})</Link>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-paper-surface font-label-sm text-label-sm text-ink-muted uppercase tracking-wider">
                <th className="w-10 px-4 py-3 text-center">
                  <input type="checkbox" className="table-checkbox" />
                </th>
                <th className="px-4 py-3 font-medium">Title &amp; Canonical Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Topics</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-rule text-body-sm font-body-sm">
              {postsResult.docs.map((post: any) => {
                const isPublished = post.status === 'published' || !!post.published_at
                const dateStr = post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : ''

                return (
                  <tr key={post.id} className="hover:bg-paper-surface transition-colors group">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" className="table-checkbox" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-0.5">
                        <Link href={`/admin/collections/posts/${post.id}`} className="font-headline-sm text-headline-sm text-on-surface font-medium hover:text-accent-ochre transition-colors leading-snug">
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 font-label-sm text-label-sm text-ink-muted">
                          <span className="text-accent-ochre">/posts/{post.slug}</span>
                          <span>·</span>
                          <span>ID: {post.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 bg-paper-surface font-label-sm text-label-sm ${isPublished ? 'text-on-surface font-medium' : 'text-ink-secondary'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-600' : 'bg-tertiary'}`} />
                        <span>{isPublished ? 'Published' : 'Draft'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {post.topic && (
                          <span className="px-2 py-0.5 bg-paper-surface font-label-sm text-label-sm text-ink-secondary">
                            #{typeof post.topic === 'object' ? post.topic.name : post.topic}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-label-sm text-label-sm text-on-surface">
                      {dateStr}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <Link href={`/writing/${post.slug}`} className="p-1 text-ink-muted hover:text-accent-ochre transition-colors" title="Preview">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                        <Link href={`/admin/collections/posts/${post.id}`} className="p-1 text-ink-muted hover:text-on-surface transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit_document</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {postsResult.docs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-muted font-body-sm">
                    No posts found. Create your first treatise.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3.5 bg-paper-surface flex flex-col sm:flex-row items-center justify-between gap-4 font-label-sm text-label-sm text-ink-secondary">
          <div className="flex items-center gap-3">
            <span>Showing <strong className="text-on-surface font-semibold">{((page - 1) * limit) + 1}–{Math.min(page * limit, allCount)}</strong> of <strong className="text-on-surface font-semibold">{allCount}</strong> treatises</span>
          </div>
          <div className="flex items-center space-x-1">
            {page > 1 && (
              <Link href={`/admin/collections/posts?page=${page - 1}`} className="px-2.5 py-1 bg-surface-container-lowest hover:bg-paper-surface text-on-surface">Prev</Link>
            )}
            {Array.from({ length: postsResult.totalPages }, (_, i) => (
              <Link key={i + 1} href={`/admin/collections/posts?page=${i + 1}`} className={`px-2.5 py-1 ${page === i + 1 ? 'bg-accent-amber text-on-primary font-semibold' : 'bg-surface-container-lowest hover:bg-paper-surface text-on-surface'}`}>{i + 1}</Link>
            ))}
            {page < postsResult.totalPages && (
              <Link href={`/admin/collections/posts?page=${page + 1}`} className="px-2.5 py-1 bg-surface-container-lowest hover:bg-paper-surface text-on-surface">Next</Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <footer className="bg-surface-container-lowest border border-hairline-rule px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 font-label-sm text-label-sm text-ink-muted shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
          <span className="text-on-surface font-medium">PostgreSQL Active (0ms)</span>
          <span>·</span>
          <span>S3 &amp; WAL Synced</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[12px]">
          <span>BRANCH: MAIN</span>
          <span>·</span>
          <span>EPOCH 2025.2</span>
        </div>
      </footer>
    </div>
  )
}
