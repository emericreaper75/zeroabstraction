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
  const [platePickerMode, setPlatePickerMode] = useState<'cover' | 'gallery' | null>(null)

  const [title, setTitle] = useState(project?.title || '')
  const [slug, setSlug] = useState(project?.slug || '')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew)
  const [summary, setSummary] = useState(project?.summary || '')
  const [descriptionMarkdown, setDescriptionMarkdown] = useState(initialDescriptionMarkdown || '')
  const [lessonsMarkdown, setLessonsMarkdown] = useState(initialLessonsMarkdown || '')
  const [activeTab, setActiveTab] = useState<'description' | 'lessons'>('description')

  const [year, setYear] = useState<string>(
    project?.year ? String(project.year) : new Date().getFullYear().toString()
  )
  const [status, setStatus] = useState<'in_progress' | 'completed' | 'archived'>(
    project?.status || 'in_progress'
  )
  const [selectedTopics, setSelectedTopics] = useState<(string | number)[]>(() => {
    if (!project?.topics) return []
    return project.topics.map((t: any) => (typeof t === 'object' ? t.id : t))
  })
  const [technologies, setTechnologies] = useState<string[]>(() => {
    if (!project?.technologies || !Array.isArray(project.technologies)) return []
    return project.technologies
      .map((t: any) => (typeof t === 'object' ? t.name : t))
      .filter(Boolean)
  })
  const [techInput, setTechInput] = useState('')
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

  const addTechChip = (raw: string) => {
    const items = raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!items.length) return
    setTechnologies((prev) => {
      const next = [...prev]
      for (const item of items) {
        if (!next.includes(item)) next.push(item)
      }
      return next
    })
    setTechInput('')
  }

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTechChip(techInput)
    } else if (e.key === 'Backspace' && !techInput && technologies.length > 0) {
      setTechnologies((prev) => prev.slice(0, -1))
    }
  }

  const handleSave = (overrideStatus?: 'in_progress' | 'completed' | 'archived') => {
    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a rig title.' })
      return
    }
    if (!slug.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a canonical slug.' })
      return
    }

    const effectiveStatus = overrideStatus || status
    if (overrideStatus) setStatus(overrideStatus)
    setFeedback(null)

    startTransition(async () => {
      const res = await saveProjectAction({
        id: project?.id,
        title,
        slug,
        summary,
        descriptionMarkdown,
        lessonsMarkdown: lessonsMarkdown || undefined,
        year: year ? parseInt(year, 10) : null,
        status: effectiveStatus,
        topics: selectedTopics,
        technologies,
        featured,
        cover_image: coverImage || null,
        gallery,
        related_posts: relatedPosts,
        links,
      })

      if (res.success && res.doc) {
        toast.success(isNew ? 'Rig created.' : 'Rig saved.')
        setFeedback({
          type: 'success',
          message: isNew ? 'Rig created successfully.' : 'Rig updated successfully.',
        })
        if (isNew) {
          router.push(`/admin/collections/projects/${res.doc.id}`)
          router.refresh()
        } else {
          router.refresh()
        }
      } else {
        toast.error(res.error || 'Failed to save rig.')
        setFeedback({
          type: 'error',
          message: res.error || 'An error occurred while saving the rig.',
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

  const executeDelete = async () => {
    if (!project?.id) return
    setConfirmDeleteOpen(false)
    setIsDeleting(true)
    const res = await deleteProjectAction(project.id)
    setIsDeleting(false)

    if (res.success) {
      toast.success('Rig deleted.')
      router.push('/admin/collections/projects')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete rig.')
      setFeedback({ type: 'error', message: res.error || 'Failed to delete rig.' })
    }
  }

  const coverMediaObj = allMedia.find((m: any) => String(m.id) === String(coverImage))

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-mono-telemetry text-[11px] text-ink-muted uppercase tracking-[0.06em]">
        <Link href="/admin" className="hover:text-on-surface transition-colors">
          OBSERVATORY
        </Link>
        <span>/</span>
        <Link href="/admin/collections/projects" className="hover:text-on-surface transition-colors">
          RIGS
        </Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">
          {isNew ? 'NEW RIG' : 'EDIT RIG'}
        </span>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-[14px] flex items-center justify-between text-[13px] ${
            feedback.type === 'success'
              ? 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'bg-[#FEF2F2] text-[#DC2626] dark:bg-rose-950/50 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {feedback.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{feedback.message}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
            {isNew ? 'New Rig' : title || 'Untitled Rig'}
          </h1>
          <p className="text-[13px] text-ink-secondary mt-0.5">
            {isNew ? 'Configure instrumentation rig or software platform' : `Updated · /projects/${slug}`}
          </p>
        </div>

        {/* Sticky Pill Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isNew && (
            <>
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={isDeleting}
                className="px-3.5 py-2 rounded-full bg-paper-surface text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[13px] font-medium transition-colors"
              >
                Delete
              </button>
              <Link
                href={`/projects/${slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-paper-surface text-ink-secondary hover:text-on-surface text-[13px] font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Preview</span>
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => handleSave('in_progress')}
            disabled={isPending}
            className="px-4 py-2 rounded-full bg-paper-surface text-on-surface hover:bg-surface-container-low text-[13px] font-medium transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? 'sync' : 'check'}
            </span>
            <span>{isPending ? 'Saving...' : isNew ? 'Create Rig' : 'Save Rig'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Studio Grid: 70% Left Editor Card / 30% Right Unified Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT CARD (8 cols — ~70%) */}
        <div className="lg:col-span-8 bg-paper-surface rounded-[20px] p-6 space-y-5">
          {/* Compact Title Input + Inline Slug Row */}
          <div className="space-y-2">
            <label htmlFor="rig-title" className="block text-[13px] font-medium text-ink-secondary">
              Project / Rig Title
            </label>
            <input
              id="rig-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Cryogenic Focal Plane Array for Submillimeter Polarimetry"
              className="w-full h-12 bg-[#F8FAFC] dark:bg-zinc-900 px-3.5 text-[20px] font-studio-display font-medium text-on-surface placeholder:text-ink-muted focus:outline-none"
            />
            <div className="flex items-center gap-2 px-1 text-[12px] font-mono-telemetry text-ink-muted">
              <span>/rigs/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true)
                  setSlug(e.target.value)
                }}
                aria-label="Canonical slug"
                placeholder="project-slug"
                className="flex-1 bg-transparent text-on-surface focus:outline-none py-0.5"
              />
              {slugManuallyEdited && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugManuallyEdited(false)
                    setSlug(slugify(title))
                  }}
                  className="text-[11px] text-[#2563EB] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <label htmlFor="rig-summary" className="block text-[13px] font-medium text-ink-secondary">
              Executive Summary
            </label>
            <textarea
              id="rig-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise technical abstract for the rig index..."
              rows={2}
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 px-3.5 py-3 text-[14px] text-on-surface placeholder:text-ink-muted focus:outline-none resize-none"
            />
          </div>

          {/* Underline Tab Switcher */}
          <div className="border-b border-[#F1F5F9] dark:border-zinc-800 flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-[#0F172A] text-on-surface dark:border-slate-100'
                  : 'border-transparent text-ink-muted hover:text-on-surface'
              }`}
            >
              Rig Description (Manuscript)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lessons')}
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
                activeTab === 'lessons'
                  ? 'border-[#0F172A] text-on-surface dark:border-slate-100'
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
              label="Technical Manuscript & Architecture"
              minHeight="380px"
            />
          ) : (
            <RichContentEditor
              value={lessonsMarkdown}
              onChange={setLessonsMarkdown}
              label="Lessons Learned & Calibration Notes"
              minHeight="380px"
            />
          )}
        </div>

        {/* RIGHT COLUMN (4 cols — ~30%): ONE Unified White Inspector Card */}
        <div className="lg:col-span-4 bg-paper-surface rounded-[20px] p-6 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
          {/* Section 1: Specification */}
          <div className="pb-5 space-y-4">
            <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
              Specification
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[12px] text-ink-secondary">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] dark:bg-zinc-900 px-3 py-2.5 text-[13px] text-on-surface focus:outline-none"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[12px] text-ink-secondary">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full bg-[#F8FAFC] dark:bg-zinc-900 px-3 py-2.5 text-[13px] font-mono-telemetry text-on-surface focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive JetBrains Mono Tech Chips */}
            <div className="space-y-1.5">
              <label className="block text-[12px] text-ink-secondary">
                Technologies <span className="text-ink-muted">(Enter to add)</span>
              </label>
              <div className="bg-[#F8FAFC] dark:bg-zinc-900 rounded-[12px] p-2.5 flex flex-wrap gap-1.5 items-center">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-paper-surface font-mono-telemetry text-[11px] text-on-surface"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => setTechnologies((prev) => prev.filter((t) => t !== tech))}
                      aria-label={`Remove ${tech}`}
                      className="text-ink-muted hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                  onBlur={() => addTechChip(techInput)}
                  placeholder={technologies.length === 0 ? 'C++, VHDL, Xilinx, Python...' : 'Add...'}
                  className="flex-1 min-w-[90px] bg-transparent text-[13px] text-on-surface placeholder:text-ink-muted focus:outline-none py-0.5"
                />
              </div>
            </div>

            {/* Pill Toggle Switch for Featured */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[13px] font-medium text-on-surface">Featured Rig</span>
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured((f) => !f)}
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

          {/* Section 2: Taxonomy */}
          <div className="py-5 space-y-3">
            <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
              Taxonomy
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic: any) => {
                const isSelected = selectedTopics.includes(topic.id)
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        prev.includes(topic.id)
                          ? prev.filter((id) => id !== topic.id)
                          : [...prev, topic.id]
                      )
                    }
                    className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-[#F8FAFC] dark:bg-zinc-900 text-ink-secondary hover:text-on-surface'
                    }`}
                  >
                    #{topic.name}
                  </button>
                )
              })}
              {topics.length === 0 && (
                <p className="text-[12px] text-ink-muted">No topics indexed.</p>
              )}
            </div>
          </div>

          {/* Section 3: Media & Plates (Visual Tile Picker) */}
          <div className="py-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
                Media &amp; Plates
              </h2>
              <Link
                href="/admin/collections/media"
                className="text-[12px] text-[#2563EB] hover:underline"
              >
                Upload ›
              </Link>
            </div>

            {/* Cover Plate Tile */}
            <div className="space-y-1.5">
              <span className="block text-[12px] text-ink-secondary">Cover Plate</span>
              {coverMediaObj ? (
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-[12px] bg-[#F8FAFC] dark:bg-zinc-900">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {coverMediaObj.url && (
                      <img
                        src={coverMediaObj.url}
                        alt={coverMediaObj.filename || ''}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <span className="text-[12px] font-medium text-on-surface truncate">
                      {coverMediaObj.filename}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPlatePickerMode('cover')}
                      className="text-[11px] text-[#2563EB] px-2 py-1"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      aria-label="Remove cover plate"
                      className="text-ink-muted hover:text-rose-500 p-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlatePickerMode('cover')}
                  className="w-full p-3.5 rounded-[12px] bg-[#F8FAFC] hover:bg-[#F1F5F9] dark:bg-zinc-900 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 text-[13px] text-ink-secondary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                  <span>Select Cover Plate</span>
                </button>
              )}
            </div>

            {/* Gallery Plates */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-ink-secondary">
                  Gallery ({gallery.length})
                </span>
                <button
                  type="button"
                  onClick={() => setPlatePickerMode('gallery')}
                  className="text-[12px] text-[#2563EB] hover:underline"
                >
                  + Add Plate
                </button>
              </div>
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((g, idx) => {
                    const m = allMedia.find((item: any) => String(item.id) === String(g.image))
                    return (
                      <div key={`${g.image}-${idx}`} className="relative group aspect-square rounded-[10px] overflow-hidden bg-[#F8FAFC] dark:bg-zinc-900">
                        {m?.url ? (
                          <img src={m.url} alt={m.filename || ''} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-ink-muted">
                            #{g.image}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                          aria-label="Remove gallery plate"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: External Links */}
          <div className="py-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
                External Links
              </h2>
              <button
                type="button"
                onClick={() => setLinks((prev) => [...prev, { label: '', url: '' }])}
                className="text-[12px] text-[#2563EB] hover:underline"
              >
                + Add Link
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => {
                      const next = [...links]
                      next[idx] = { ...next[idx], label: e.target.value }
                      setLinks(next)
                    }}
                    placeholder="GitHub"
                    className="w-24 bg-[#F8FAFC] dark:bg-zinc-900 px-2.5 py-2 text-[12px] text-on-surface focus:outline-none"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...links]
                      next[idx] = { ...next[idx], url: e.target.value }
                      setLinks(next)
                    }}
                    placeholder="https://..."
                    className="flex-1 bg-[#F8FAFC] dark:bg-zinc-900 px-2.5 py-2 text-[12px] text-on-surface focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setLinks((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label="Remove link"
                    className="p-1 text-ink-muted hover:text-rose-500"
                  >
                    ×
                  </button>
                </div>
              ))}
              {links.length === 0 && (
                <p className="text-[12px] text-ink-muted">No external links added.</p>
              )}
            </div>
          </div>

          {/* Section 5: Connected Universe */}
          <div className="pt-5 space-y-3">
            <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">
              Connected Universe
            </h2>
            <div className="max-h-36 overflow-y-auto space-y-1.5">
              {allPosts.map((p: any) => {
                const checked = relatedPosts.includes(p.id)
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-zinc-900 cursor-pointer text-[13px] text-on-surface"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) setRelatedPosts((prev) => [...prev, p.id])
                        else setRelatedPosts((prev) => prev.filter((id) => id !== p.id))
                      }}
                      className="w-4 h-4 rounded accent-[#0F172A]"
                    />
                    <span className="truncate">{p.title}</span>
                  </label>
                )
              })}
              {allPosts.length === 0 && (
                <p className="text-[12px] text-ink-muted">No posts available to link.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Plate Picker Dialog */}
      <AdminDialog
        open={Boolean(platePickerMode)}
        onClose={() => setPlatePickerMode(null)}
        labelledBy="plate-picker-title"
        className="w-[min(640px,94vw)] rounded-[20px]"
      >
        <div className="p-6 bg-paper-surface space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] dark:border-zinc-800">
            <h1 id="plate-picker-title" className="font-studio-display text-[16px] font-semibold text-on-surface">
              {platePickerMode === 'cover' ? 'Select Cover Plate' : 'Add Gallery Plate'}
            </h1>
            <button
              type="button"
              autoFocus
              onClick={() => setPlatePickerMode(null)}
              aria-label="Close plate picker"
              className="p-1 text-ink-muted hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
            {allMedia.map((m: any) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  if (platePickerMode === 'cover') {
                    setCoverImage(m.id)
                  } else {
                    setGallery((prev) =>
                      prev.some((g) => String(g.image) === String(m.id))
                        ? prev
                        : [...prev, { image: m.id }]
                    )
                  }
                  setPlatePickerMode(null)
                }}
                className="group text-left space-y-1.5"
              >
                <div className="aspect-square rounded-[12px] overflow-hidden bg-[#F8FAFC] dark:bg-zinc-900 group-hover:ring-2 group-hover:ring-[#0F172A]">
                  {m.url ? (
                    <img src={m.url} alt={m.filename || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-muted">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-ink-secondary truncate">{m.filename}</p>
              </button>
            ))}
            {allMedia.length === 0 && (
              <div className="col-span-full py-10 text-center text-[13px] text-ink-muted">
                No ingested plates available. Upload one in Media &amp; Plates.
              </div>
            )}
          </div>
        </div>
      </AdminDialog>

      {/* Delete Confirmation Dialog */}
      <AdminDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        labelledBy="delete-project-title"
        className="w-[min(420px,92vw)] rounded-[20px]"
      >
        <div className="p-6 bg-paper-surface space-y-4">
          <h1 id="delete-project-title" className="font-studio-display text-[16px] font-semibold text-on-surface">
            Delete Rig?
          </h1>
          <p className="text-[13px] text-ink-secondary leading-relaxed">
            Permanently delete <strong className="text-on-surface">{title || 'this rig'}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              autoFocus
              onClick={() => setConfirmDeleteOpen(false)}
              className="px-4 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-zinc-800 text-[13px] font-medium text-on-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeDelete}
              className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-[13px] font-medium hover:bg-rose-700"
            >
              Delete Rig
            </button>
          </div>
        </div>
      </AdminDialog>
    </div>
  )
}
