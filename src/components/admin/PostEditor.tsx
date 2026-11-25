'use client'

import React, { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RichContentEditor } from './RichContentEditor'
import { savePostAction, deletePostAction } from '@/app/(admin)/admin/collections/posts/actions'
import { AdminDialog } from './AdminDialog'
import { useAdminToast } from './AdminToastProvider'

interface PostEditorProps {
  post: any | null
  topics: any[]
  initialMarkdown: string
  allMedia?: any[]
  allProjects?: any[]
  allPosts?: any[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PostEditor({
  post,
  topics,
  initialMarkdown,
  allMedia = [],
  allProjects = [],
  allPosts = [],
}: PostEditorProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const isNew = !post
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew)
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [contentMarkdown, setContentMarkdown] = useState(initialMarkdown || '')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(post?.status || 'draft')
  const [publishedAt, setPublishedAt] = useState<string>(
    post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ''
  )
  const [selectedTopics, setSelectedTopics] = useState<(string | number)[]>(() => {
    if (!post?.topics) return []
    return post.topics.map((t: any) => (typeof t === 'object' ? t.id : t))
  })
  const [coverImage, setCoverImage] = useState<string | number | ''>(() => {
    if (!post?.cover_image) return ''
    return typeof post.cover_image === 'object' ? post.cover_image.id : post.cover_image
  })
  const [relatedProjects, setRelatedProjects] = useState<(string | number)[]>(() => {
    if (!post?.related_projects) return []
    return post.related_projects.map((p: any) => (typeof p === 'object' ? p.id : p))
  })
  const [relatedPosts, setRelatedPosts] = useState<(string | number)[]>(() => {
    if (!post?.related_posts) return []
    return post.related_posts.map((p: any) => (typeof p === 'object' ? p.id : p))
  })
  const [seoTitle, setSeoTitle] = useState(post?.seo_metadata?.title || '')
  const [seoDescription, setSeoDescription] = useState(post?.seo_metadata?.description || '')
  const [featured, setFeatured] = useState(Boolean(post?.featured))

  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Handle title changes and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!slugManuallyEdited) {
      setSlug(slugify(val))
    }
  }

  // Handle saving post
  const handleSave = () => {
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a title for the post.' })
      return
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a canonical slug.' })
      return
    }

    setFeedback(null)

    startTransition(async () => {
      const res = await savePostAction({
        id: post?.id,
        title,
        slug,
        excerpt,
        contentMarkdown,
        status,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
        topics: selectedTopics,
        featured,
        cover_image: coverImage || null,
        related_projects: relatedProjects,
        related_posts: relatedPosts,
        seo_metadata: {
          title: seoTitle,
          description: seoDescription,
        },
      })

      if (res.success && res.doc) {
        toast.success(isNew ? 'Manuscript created.' : 'Manuscript saved.')
        setFeedback({
          type: 'success',
          message: isNew ? 'Manuscript created successfully.' : 'Manuscript updated successfully.',
        })
        if (isNew) {
          router.push(`/admin/collections/posts/${res.doc.id}`)
          router.refresh()
        } else {
          router.refresh()
        }
      } else {
        toast.error(res.error || 'Failed to save post.')
        setFeedback({
          type: 'error',
          message: res.error || 'An error occurred while saving the post.',
        })
      }
    })
  }

  // Cmd/Ctrl+S shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const wordCount = useMemo(
    () => (contentMarkdown || '').trim().split(/\s+/).filter(Boolean).length,
    [contentMarkdown]
  )
  const estMinutes = Math.max(1, Math.ceil(wordCount / 200))

  // Handle post deletion
  const handleDelete = () => {
    if (!post?.id) return
    setConfirmDeleteOpen(true)
  }

  const executeDelete = async () => {
    if (!post?.id) return
    setConfirmDeleteOpen(false)
    setIsDeleting(true)
    const res = await deletePostAction(post.id)
    setIsDeleting(false)

    if (res.success) {
      toast.success('Manuscript deleted.')
      router.push('/admin/collections/posts')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete post.')
      setFeedback({ type: 'error', message: res.error || 'Failed to delete post.' })
    }
  }

  const updatedDateStr = post?.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted pt-2">
        <Link href="/admin" className="hover:text-primary transition-colors">
          OBSERVATORY
        </Link>
        <span>/</span>
        <Link href="/admin/collections/posts" className="hover:text-primary transition-colors">
          POSTS
        </Link>
        <span>/</span>
        <span className="text-on-surface font-medium tracking-wide">
          {isNew ? 'NEW ENTRY' : 'EDIT MANUSCRIPT'}
        </span>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 border flex items-center justify-between text-body-sm transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {feedback.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-ink-muted hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Title Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
            {isNew ? 'New Post' : title || 'Untitled Post'}
          </h1>
          {!isNew && (
            <div className="flex items-center gap-3 font-mono-telemetry text-[11px] text-ink-muted mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-[0.06em] text-[10px] ${
                  status === 'published'
                    ? 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300'
                    : status === 'archived'
                    ? 'bg-[#F1F5F9] text-[#475569] dark:bg-zinc-800 dark:text-zinc-300'
                    : 'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300'
                }`}
              >
                {status}
              </span>
              {updatedDateStr && <span>Last saved: {updatedDateStr}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isNew && slug && (
            <Link
              href={`/writing/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-paper-surface text-ink-secondary text-[13px] font-medium hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View Live
            </Link>
          )}

          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-paper-surface text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[13px] font-medium transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? 'sync' : 'check'}
            </span>
            {isPending ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Form Grid (70% / 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Editor Card (8 cols) */}
        <div className="lg:col-span-8 bg-paper-surface rounded-[20px] p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-secondary">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter manuscript title..."
              className="w-full h-12 bg-[#F8FAFC] dark:bg-zinc-900 text-on-surface font-studio-display text-[20px] font-medium px-3.5 focus:outline-none transition-colors"
            />
          </div>

          {/* Canonical Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-medium text-ink-secondary">
                Canonical Slug <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setSlug(slugify(title))
                  setSlugManuallyEdited(false)
                }}
                className="text-[11px] font-mono-telemetry text-[#2563EB] hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center bg-[#F8FAFC] dark:bg-zinc-900 rounded-[12px]">
              <span className="px-3 py-2.5 text-ink-muted font-label-sm text-label-sm bg-surface-container-low border-r border-hairline-rule select-none">
                /writing/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value))
                  setSlugManuallyEdited(true)
                }}
                placeholder="manuscript-slug"
                className="flex-1 bg-transparent text-on-surface font-body-md text-body-md px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt / Abstract */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Abstract / Excerpt
              </label>
              <span className="text-label-sm font-mono text-ink-muted text-[11px]">
                {excerpt.length} characters
              </span>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief abstract or synopsis of this manuscript..."
              rows={3}
              className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors rounded-none resize-y min-h-[100px]"
            />
          </div>

          {/* Body Content (Full RichContentEditor) */}
          <RichContentEditor
            value={contentMarkdown}
            onChange={setContentMarkdown}
            label="Body Content (Manuscript Text)"
            minHeight="450px"
          />
        </div>

        {/* Sidebar Metadata Column (4 cols) — Unified White Card */}
        <div className="lg:col-span-4 bg-paper-surface rounded-[20px] p-6 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
          {/* Publication Control */}
          <div className="pb-5">
            <h3 className="font-studio-display text-[16px] font-semibold text-on-surface mb-4">
              Publication Control
            </h3>
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-[12px] text-ink-secondary">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'draft' | 'published' | 'archived'
                    setStatus(newStatus)
                    if (newStatus === 'published' && !publishedAt) {
                      setPublishedAt(new Date().toISOString().slice(0, 16))
                    }
                  }}
                  className="w-full bg-[#F8FAFC] dark:bg-zinc-900 text-on-surface text-[13px] px-3 py-2.5 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] text-ink-secondary">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-zinc-900 text-on-surface font-mono-telemetry text-[12px] px-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[13px] font-medium text-on-surface">
                  Featured Post
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  onClick={() => setFeatured(!featured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    featured ? 'bg-[#0F172A] dark:bg-slate-100' : 'bg-[#E2E8F0] dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${
                      featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Topic Classification */}
          <div className="py-5">
            <h3 className="font-studio-display text-[16px] font-semibold text-on-surface mb-3">
              Taxonomy
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((t: any) => {
                const isChecked = selectedTopics.includes(t.id)
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (isChecked) {
                        setSelectedTopics(selectedTopics.filter((id) => id !== t.id))
                      } else {
                        setSelectedTopics([...selectedTopics, t.id])
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                      isChecked
                        ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-[#F8FAFC] dark:bg-zinc-900 text-ink-secondary hover:text-on-surface'
                    }`}
                  >
                    #{t.name}
                  </button>
                )
              })}
              {topics.length === 0 && (
                <p className="text-ink-muted text-[12px]">No topics created yet.</p>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="py-5">
            <h3 className="font-studio-display text-[16px] font-semibold text-on-surface mb-3">
              Cover Plate
            </h3>
            <select
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value ? (isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)) : '')}
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 text-on-surface text-[13px] px-3 py-2.5 focus:outline-none"
            >
              <option value="">No cover plate</option>
              {allMedia.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.alt_text || m.filename || `Media #${m.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Connected Universe */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Connected Universe
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase mb-2">
                  Related Projects ({relatedProjects.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 border border-hairline-rule p-2 bg-paper-base/30">
                  {allProjects.map((p: any) => {
                    const isChecked = relatedProjects.includes(p.id)
                    return (
                      <label key={p.id} className="flex items-center gap-2 p-1 text-body-sm cursor-pointer hover:bg-white">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRelatedProjects([...relatedProjects, p.id])
                            } else {
                              setRelatedProjects(relatedProjects.filter((id) => id !== p.id))
                            }
                          }}
                          className="w-3.5 h-3.5 accent-primary"
                        />
                        <span className="truncate">{p.title}</span>
                      </label>
                    )
                  })}
                  {allProjects.length === 0 && (
                    <p className="text-ink-muted text-xs py-1">No projects available.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase mb-2">
                  Related Posts ({relatedPosts.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 border border-hairline-rule p-2 bg-paper-base/30">
                  {allPosts
                    .filter((p: any) => p.id !== post?.id)
                    .map((p: any) => {
                      const isChecked = relatedPosts.includes(p.id)
                      return (
                        <label key={p.id} className="flex items-center gap-2 p-1 text-body-sm cursor-pointer hover:bg-white">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRelatedPosts([...relatedPosts, p.id])
                              } else {
                                setRelatedPosts(relatedPosts.filter((id) => id !== p.id))
                              }
                            }}
                            className="w-3.5 h-3.5 accent-primary"
                          />
                          <span className="truncate">{p.title}</span>
                        </label>
                      )
                    })}
                  {allPosts.filter((p: any) => p.id !== post?.id).length === 0 && (
                    <p className="text-ink-muted text-xs py-1">No other posts available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              SEO Metadata
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                    Meta Title
                  </label>
                  <span className="text-[10px] font-label-sm text-ink-muted">
                    {(seoTitle || title).length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Custom SEO title...'}
                  className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                    Meta Description
                  </label>
                  <span className="text-[10px] font-label-sm text-ink-muted">
                    {(seoDescription || excerpt).length}/160
                  </span>
                </div>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Custom meta description..."
                  rows={2}
                  className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none resize-none"
                />
              </div>
              {/* Live SERP Preview */}
              <div className="mt-3 p-3 bg-surface-container-low border border-hairline-subtle rounded space-y-1">
                <span className="text-[10px] font-label-sm text-ink-muted uppercase tracking-wider">
                  SERP Preview
                </span>
                <p className="text-xs font-medium text-primary truncate">
                  {seoTitle || title || 'Untitled Treatise'} — ZeroAbstraction
                </p>
                <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 truncate">
                  zeroabstraction.dev/writing/{slug || 'slug'}
                </p>
                <p className="text-[11px] text-ink-secondary line-clamp-2">
                  {seoDescription || excerpt || 'Add an excerpt or meta description to preview search snippet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Telemetry & Metadata */}
          <div className="border border-hairline-rule bg-paper-surface p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Document Telemetry
            </h3>
            <div className="space-y-2 text-label-sm font-label-sm text-ink-muted">
              <div className="flex justify-between">
                <span>Word Count</span>
                <span className="text-on-surface font-medium">{wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Reading Time</span>
                <span className="text-on-surface font-medium">{estMinutes} min read</span>
              </div>
              <div className="flex justify-between">
                <span>Save Shortcut</span>
                <kbd className="text-[10px] px-1.5 py-0.5 border border-hairline-rule rounded bg-surface-container-low">⌘S / Ctrl+S</kbd>
              </div>
              {post && (
                <>
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="text-on-surface">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Saved</span>
                    <span className="text-on-surface">{updatedDateStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Document ID</span>
                    <span className="text-on-surface font-mono">{post.id}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdminDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        labelledBy="delete-post-title"
        className="w-[min(420px,92vw)]"
      >
        <div className="p-5 bg-paper-surface space-y-4">
          <h1 id="delete-post-title" className="font-headline-sm text-lg text-on-surface">
            Delete Manuscript?
          </h1>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Permanently delete <strong className="text-on-surface">{title || 'this post'}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              autoFocus
              onClick={() => setConfirmDeleteOpen(false)}
              className="px-3.5 py-1.5 rounded border border-hairline-rule text-xs font-label-sm text-on-surface hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDelete}
              className="px-3.5 py-1.5 rounded bg-rose-600 text-white text-xs font-label-sm hover:bg-rose-700"
            >
              Delete Post
            </button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
