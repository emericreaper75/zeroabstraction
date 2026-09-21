'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RichContentEditor } from './RichContentEditor'
import { saveProjectAction, deleteProjectAction } from '@/app/(admin)/admin/collections/projects/actions'

interface ProjectEditorProps {
  project: any | null
  topics: any[]
  initialDescriptionMarkdown: string
  initialLessonsMarkdown: string
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
}: ProjectEditorProps) {
  const router = useRouter()
  const isNew = !project

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
      })

      if (res.success && res.doc) {
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
        setFeedback({
          type: 'error',
          message: res.error || 'An error occurred while saving the project.',
        })
      }
    })
  }

  const handleDelete = async () => {
    if (!project?.id) return
    const confirmed = window.confirm(`Are you sure you want to delete "${title || 'this project'}"? This action cannot be undone.`)
    if (!confirmed) return

    setIsDeleting(true)
    const res = await deleteProjectAction(project.id)
    setIsDeleting(false)

    if (res.success) {
      router.push('/admin/collections/projects')
      router.refresh()
    } else {
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
        </div>
      </div>
    </div>
  )
}
