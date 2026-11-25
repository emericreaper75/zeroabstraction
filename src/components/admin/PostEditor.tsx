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

          {/* Cover Image */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Cover Image
            </h3>
            <div className="space-y-3">
              <select
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value ? (isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)) : '')}
                className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
              >
                <option value="">No cover image</option>
                {allMedia.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.alt_text || m.filename || `Media #${m.id}`}
                  </option>
                ))}
              </select>
            </div>
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
