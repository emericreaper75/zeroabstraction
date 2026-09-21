'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RichContentEditor } from './RichContentEditor'
import { savePostAction, deletePostAction } from '@/app/(admin)/admin/collections/posts/actions'

interface PostEditorProps {
  post: any | null
  topics: any[]
  initialMarkdown: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PostEditor({ post, topics, initialMarkdown }: PostEditorProps) {
  const router = useRouter()
  const isNew = !post

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
      })

      if (res.success && res.doc) {
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
        setFeedback({
          type: 'error',
          message: res.error || 'An error occurred while saving the post.',
        })
      }
    })
  }

  // Handle post deletion
  const handleDelete = async () => {
    if (!post?.id) return
    const confirmed = window.confirm(`Are you sure you want to delete "${title || 'this post'}"? This action cannot be undone.`)
    if (!confirmed) return

    setIsDeleting(true)
    const res = await deletePostAction(post.id)
    setIsDeleting(false)

    if (res.success) {
      router.push('/admin/collections/posts')
      router.refresh()
    } else {
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
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-hairline-rule pb-6">
        <div className="space-y-1">
          <h1 className="font-headline-xl text-headline-lg text-on-surface tracking-tight leading-none">
            {isNew ? 'New Post' : title || 'Untitled Post'}
          </h1>
          {!isNew && (
            <div className="flex items-center gap-3 font-label-sm text-label-sm text-ink-muted mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 ${
                  status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : status === 'archived'
                    ? 'bg-stone-100 text-stone-600'
                    : 'bg-surface-container-high text-ink-secondary'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    status === 'published'
                      ? 'bg-emerald-600'
                      : status === 'archived'
                      ? 'bg-stone-400'
                      : 'bg-tertiary'
                  }`}
                />
                {status.toUpperCase()}
              </span>
              {updatedDateStr && <span>Last saved: {updatedDateStr}</span>}
              <span>ID: {post.id}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isNew && slug && (
            <Link
              href={`/writing/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low text-ink-secondary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-high transition-colors shadow-xs"
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
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-label-md text-label-md uppercase tracking-wider transition-colors shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? 'sync' : 'save'}
            </span>
            {isPending ? 'Saving...' : isNew ? 'Create Post' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editor Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
              Title <span className="text-accent-ochre">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter manuscript title..."
              className="w-full bg-white border border-hairline-rule text-on-surface font-headline-md text-headline-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors rounded-none italic"
            />
          </div>

          {/* Canonical Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Canonical Slug <span className="text-accent-ochre">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setSlug(slugify(title))
                  setSlugManuallyEdited(false)
                }}
                className="text-[11px] font-label-sm text-ink-muted hover:text-primary transition-colors underline"
              >
                Regenerate from title
              </button>
            </div>
            <div className="flex items-center bg-white border border-hairline-rule">
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

        {/* Sidebar Metadata Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Control */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Publication Control
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
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
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full bg-white border border-hairline-rule text-on-surface font-label-sm text-label-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                />
              </div>

              <div className="pt-2 border-t border-hairline-subtle flex items-center justify-between">
                <label
                  htmlFor="featured-post"
                  className="text-label-sm font-label-sm text-on-surface font-medium uppercase tracking-wider cursor-pointer"
                >
                  Featured Post
                </label>
                <input
                  id="featured-post"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Topic Classification */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Topic Classification
            </h3>
            <div className="space-y-3">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Select Topics ({selectedTopics.length})
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 border border-hairline-rule p-2 bg-paper-base/30">
                {topics.map((t: any) => {
                  const isChecked = selectedTopics.includes(t.id)
                  return (
                    <label
                      key={t.id}
                      className="flex items-center gap-2 p-1.5 hover:bg-white cursor-pointer transition-colors text-body-sm text-on-surface"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTopics([...selectedTopics, t.id])
                          } else {
                            setSelectedTopics(selectedTopics.filter((id) => id !== t.id))
                          }
                        }}
                        className="w-3.5 h-3.5 accent-primary"
                      />
                      <span className="flex-1">{t.name}</span>
                      {t.slug && (
                        <span className="text-label-sm font-mono text-ink-muted text-[11px]">
                          /{t.slug}
                        </span>
                      )}
                    </label>
                  )
                })}
                {topics.length === 0 && (
                  <p className="text-ink-muted text-body-sm py-2 text-center italic">
                    No topics created yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Telemetry & Metadata */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Document Telemetry
            </h3>
            <div className="space-y-2 text-label-sm font-label-sm text-ink-muted">
              <div className="flex justify-between">
                <span>Type</span>
                <span className="text-on-surface font-medium">Post / Essay</span>
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
    </div>
  )
}
