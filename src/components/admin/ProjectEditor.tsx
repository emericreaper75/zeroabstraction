'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RichContentEditor } from './RichContentEditor'
import { saveProjectAction, deleteProjectAction } from '@/app/(admin)/admin/collections/projects/actions'
import { AdminDialog } from './AdminDialog'
import { useAdminToast } from './AdminToastProvider'

interface ProjectEditorProps {
  project: any | null
  topics: any[]
  initialDescriptionMarkdown: string
  initialLessonsMarkdown: string
  allMedia?: any[]
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

export function ProjectEditor({
  project,
  topics,
  initialDescriptionMarkdown,
  initialLessonsMarkdown,
  allMedia = [],
  allPosts = [],
}: ProjectEditorProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const isNew = !project
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const [title, setTitle] = useState(project?.title || '')
  const [slug, setSlug] = useState(project?.slug || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew)
  const [summary, setSummary] = useState(project?.summary || '')
  const [descriptionMarkdown, setDescriptionMarkdown] = useState(initialDescriptionMarkdown || '')
  const [lessonsMarkdown, setLessonsMarkdown] = useState(initialLessonsMarkdown || '')
  const [activeTab, setActiveTab] = useState<'description' | 'lessons'>('description')

  const [year, setYear] = useState<string>(project?.year ? String(project.year) : new Date().getFullYear().toString())
  const [status, setStatus] = useState<'in_progress' | 'completed' | 'archived'>(
    project?.status || 'in_progress'
  )
  const [selectedTopics, setSelectedTopics] = useState<(string | number)[]>(() => {
    if (!project?.topics) return []
    return project.topics.map((t: any) => (typeof t === 'object' ? t.id : t))
  })
  const [technologiesText, setTechnologiesText] = useState(() => {
    if (!project?.technologies || !Array.isArray(project.technologies)) return ''
    return project.technologies.map((t: any) => (typeof t === 'object' ? t.name : t)).join(', ')
  })
  const [coverImage, setCoverImage] = useState<string | number | ''>(() => {
    if (!project?.cover_image) return ''
    return typeof project.cover_image === 'object' ? project.cover_image.id : project.cover_image
  })
  const [gallery, setGallery] = useState<Array<{ image: string | number }>>(() => {
    if (!project?.gallery || !Array.isArray(project.gallery)) return []
    return project.gallery.map((g: any) => ({
      image: typeof g.image === 'object' ? g.image.id : g.image,
    }))
  })
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>(() => {
    if (!project?.links || !Array.isArray(project.links)) return []
    return project.links.map((l: any) => ({ label: l.label || '', url: l.url || '' }))
  })
  const [relatedPosts, setRelatedPosts] = useState<(string | number)[]>(() => {
    if (!project?.related_posts || !Array.isArray(project.related_posts)) return []
    return project.related_posts.map((p: any) => (typeof p === 'object' ? p.id : p))
  })
  const [featured, setFeatured] = useState(Boolean(project?.featured))

  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!slugManuallyEdited) {
      setSlug(slugify(val))
    }
  }

  const handleSave = () => {
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a project title.' })
      return
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a canonical slug.' })
      return
    }

    setFeedback(null)

    const techArray = technologiesText
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean)

    startTransition(async () => {
      const res = await saveProjectAction({
        id: project?.id,
        title,
        slug,
        summary,
        descriptionMarkdown,
        lessonsMarkdown: lessonsMarkdown || undefined,
        year: year ? parseInt(year, 10) : null,
        status,
        topics: selectedTopics,
        technologies: techArray,
        featured,
        cover_image: coverImage || null,
        gallery,
        related_posts: relatedPosts,
        links,
      })

      if (res.success && res.doc) {
        toast.success(isNew ? 'Project created.' : 'Project saved.')
        setFeedback({
          type: 'success',
          message: isNew ? 'Project created successfully.' : 'Project updated successfully.',
        })
        if (isNew) {
          router.push(`/admin/collections/projects/${res.doc.id}`)
          router.refresh()
        } else {
          router.refresh()
        }
      } else {
        toast.error(res.error || 'Failed to save project.')
        setFeedback({
          type: 'error',
          message: res.error || 'An error occurred while saving the project.',
        })
      }
    })
  }

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

  const handleDelete = () => {
    if (!project?.id) return
    setConfirmDeleteOpen(true)
  }

  const executeDelete = async () => {
    if (!project?.id) return
    setConfirmDeleteOpen(false)
    setIsDeleting(true)
    const res = await deleteProjectAction(project.id)
    setIsDeleting(false)

    if (res.success) {
      toast.success('Project deleted.')
      router.push('/admin/collections/projects')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete project.')
      setFeedback({ type: 'error', message: res.error || 'Failed to delete project.' })
    }
  }

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted pt-2">
        <Link href="/admin" className="hover:text-primary transition-colors">
          OBSERVATORY
        </Link>
        <span>/</span>
        <Link href="/admin/collections/projects" className="hover:text-primary transition-colors">
          PROJECTS
        </Link>
        <span>/</span>
        <span className="text-on-surface font-medium tracking-wide">
          {isNew ? 'NEW RIG' : 'EDIT PROJECT'}
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
            {isNew ? 'New Project' : title || 'Untitled Project'}
          </h1>
          {!isNew && (
            <div className="flex items-center gap-3 font-label-sm text-label-sm text-ink-muted mt-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container-high text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {status.replace('_', ' ').toUpperCase()}
              </span>
              <span>Year: {year}</span>
              <span>ID: {project.id}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isNew && slug && (
            <Link
              href={`/projects/${slug}`}
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
            {isPending ? 'Saving...' : isNew ? 'Create Project' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
              Project Title <span className="text-accent-ochre">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., FPGA High-Speed Signal Processor..."
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
                /projects/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value))
                  setSlugManuallyEdited(true)
                }}
                placeholder="project-slug"
                className="flex-1 bg-transparent text-on-surface font-body-md text-body-md px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
              Executive Summary
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief overview of the project engineering goals and apparatus..."
              rows={3}
              className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors rounded-none resize-y min-h-[100px]"
            />
          </div>

          {/* Content Tabs: Description vs Lessons Learned */}
          <div className="space-y-3">
            <div className="flex border-b border-hairline-rule">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 font-label-md text-label-md uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'description'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-ink-muted hover:text-on-surface'
                }`}
              >
                Project Description (Manuscript)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lessons')}
                className={`px-4 py-2 font-label-md text-label-md uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'lessons'
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-ink-muted hover:text-on-surface'
                }`}
              >
                Lessons Learned &amp; Observations
              </button>
            </div>

            {activeTab === 'description' ? (
              <RichContentEditor
                value={descriptionMarkdown}
                onChange={setDescriptionMarkdown}
                label="Full Project Technical Documentation"
                minHeight="400px"
              />
            ) : (
              <RichContentEditor
                value={lessonsMarkdown}
                onChange={setLessonsMarkdown}
                label="Engineering Insights &amp; Post-Mortem"
                minHeight="300px"
              />
            )}
          </div>
        </div>

        {/* Sidebar Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Project Specification
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Execution Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={technologiesText}
                  onChange={(e) => setTechnologiesText(e.target.value)}
                  placeholder="e.g., C++, VHDL, Xilinx, Python"
                  className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none"
                />
              </div>

              <div className="pt-2 border-t border-hairline-subtle flex items-center justify-between">
                <label
                  htmlFor="featured-project"
                  className="text-label-sm font-label-sm text-on-surface font-medium uppercase tracking-wider cursor-pointer"
                >
                  Featured Project
                </label>
                <input
                  id="featured-project"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Taxonomy Classification
            </h3>
            <div className="space-y-3">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Assigned Topics ({selectedTopics.length})
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
                    </label>
                  )
                })}
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

          {/* Image Gallery */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline-rule">
              <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold">
                Gallery Images ({gallery.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (allMedia.length > 0) {
                    setGallery([...gallery, { image: allMedia[0].id }])
                  }
                }}
                disabled={allMedia.length === 0}
                className="text-[11px] font-label-sm text-primary hover:underline uppercase disabled:opacity-50"
              >
                + Add Image
              </button>
            </div>
            <div className="space-y-2">
              {gallery.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.image}
                    onChange={(e) => {
                      const val = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)
                      const updated = [...gallery]
                      updated[idx] = { image: val }
                      setGallery(updated)
                    }}
                    className="flex-1 bg-white border border-hairline-rule text-body-sm px-2 py-1.5 focus:border-primary rounded-none"
                  >
                    {allMedia.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.alt_text || m.filename || `Media #${m.id}`}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                    className="text-ink-muted hover:text-rose-600 px-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
              {gallery.length === 0 && (
                <p className="text-ink-muted text-body-sm py-1 italic">No gallery images added.</p>
              )}
            </div>
          </div>

          {/* External Links */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline-rule">
              <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold">
                External Links ({links.length})
              </h3>
              <button
                type="button"
                onClick={() => setLinks([...links, { label: '', url: '' }])}
                className="text-[11px] font-label-sm text-primary hover:underline uppercase"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link, idx) => (
                <div key={idx} className="p-2 border border-hairline-subtle bg-paper-base/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-label-sm text-ink-muted">LINK #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setLinks(links.filter((_, i) => i !== idx))}
                      className="text-ink-muted hover:text-rose-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...links]
                      updated[idx] = { ...updated[idx], label: e.target.value }
                      setLinks(updated)
                    }}
                    placeholder="Label (e.g. GitHub Repository)"
                    className="w-full bg-white border border-hairline-rule text-body-sm px-2 py-1 focus:border-primary rounded-none"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...links]
                      updated[idx] = { ...updated[idx], url: e.target.value }
                      setLinks(updated)
                    }}
                    placeholder="https://..."
                    className="w-full bg-white border border-hairline-rule text-body-sm px-2 py-1 focus:border-primary rounded-none font-mono text-[12px]"
                  />
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-ink-muted text-body-sm py-1 italic">No links added.</p>
              )}
            </div>
          </div>

          {/* Connected Universe */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">
              Connected Universe
            </h3>
            <div className="space-y-3">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Related Posts ({relatedPosts.length})
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 border border-hairline-rule p-2 bg-paper-base/30">
                {allPosts.map((p: any) => {
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
                {allPosts.length === 0 && (
                  <p className="text-ink-muted text-xs py-1">No posts available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        labelledBy="delete-project-title"
        className="w-[min(420px,92vw)]"
      >
        <div className="p-5 bg-paper-surface space-y-4">
          <h1 id="delete-project-title" className="font-headline-sm text-lg text-on-surface">
            Delete Project Rig?
          </h1>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Permanently delete <strong className="text-on-surface">{title || 'this project'}</strong>? This action cannot be undone.
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
              Delete Project
            </button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
