'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveJourneyAction, type JourneyEntry } from '@/app/(admin)/admin/collections/journey/actions'

interface JourneyEditorProps {
  initialEntries: JourneyEntry[]
}

export function JourneyEditor({ initialEntries }: JourneyEditorProps) {
  const router = useRouter()
  const [entries, setEntries] = useState<JourneyEntry[]>(initialEntries || [])
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // New entry form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<'physics' | 'ece' | 'astrophysics'>('astrophysics')
  const [newDate, setNewDate] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newMilestone, setNewMilestone] = useState(false)

  const handleSave = () => {
    setFeedback(null)
    startTransition(async () => {
      const res = await saveJourneyAction(entries)
      if (res.success) {
        setFeedback({ type: 'success', message: 'Journey entries saved successfully.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save journey entries.' })
      }
    })
  }

  const handleAddEntry = () => {
    if (!newTitle.trim()) {
      alert('Please enter a title for the journey entry.')
      return
    }

    const nextOrder = entries.length > 0 ? Math.max(...entries.map((e) => e.order || 0)) + 1 : 1
    const newEntry: JourneyEntry = {
      order: nextOrder,
      title: newTitle.trim(),
      category: newCategory,
      date: newDate || null,
      description: newDescription.trim() || null,
      milestone: newMilestone,
    }

    setEntries([...entries, newEntry])
    setNewTitle('')
    setNewDescription('')
    setNewDate('')
    setNewMilestone(false)
    setShowAddForm(false)
  }

  const handleDeleteEntry = (index: number) => {
    if (confirm('Are you sure you want to remove this milestone?')) {
      const updated = entries.filter((_, idx) => idx !== index)
      // re-index order
      const reindexed = updated.map((e, idx) => ({ ...e, order: idx + 1 }))
      setEntries(reindexed)
    }
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= entries.length) return

    const newArr = [...entries]
    const temp = newArr[index]
    newArr[index] = newArr[targetIndex]
    newArr[targetIndex] = temp

    // re-index order
    const reindexed = newArr.map((e, idx) => ({ ...e, order: idx + 1 }))
    setEntries(reindexed)
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>GLOBALS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">JOURNEY ARCHIVE</span>
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

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Journey &amp; Timeline</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Monotonic sequence controller — ordered milestones and epoch markers.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-label-sm px-2.5 py-1 bg-amber-wash text-accent-ochre border border-primary/20 rounded font-medium">
              {entries.length} MILESTONES
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md uppercase tracking-wider transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                {showAddForm ? 'close' : 'add'}
              </span>
              {showAddForm ? 'Cancel' : 'Add Milestone'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPending ? 'sync' : 'save'}
              </span>
              {isPending ? 'Saving...' : 'Save Sequence'}
            </button>
          </div>
        </div>
      </header>

      {/* Add New Milestone Form */}
      {showAddForm && (
        <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded space-y-4">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium border-b border-hairline-rule pb-2">
            New Journey Milestone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Title <span className="text-accent-ochre">*</span>
              </label>
              <input
                type="text"
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none"
                placeholder="e.g. Master's in Astrophysical Systems"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Category
              </label>
              <select
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
              >
                <option value="astrophysics">Astrophysics</option>
                <option value="physics">Physics</option>
                <option value="ece">ECE</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Date
              </label>
              <input
                type="date"
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="flex items-center pt-6 gap-2">
              <input
                type="checkbox"
                id="new-milestone-flag"
                className="w-4 h-4 accent-primary cursor-pointer"
                checked={newMilestone}
                onChange={(e) => setNewMilestone(e.target.checked)}
              />
              <label htmlFor="new-milestone-flag" className="text-label-sm font-label-sm text-on-surface uppercase tracking-wider cursor-pointer">
                Major Landmark / Epoch Milestone
              </label>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Description
              </label>
              <textarea
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2 focus:border-primary focus:outline-none resize-y min-h-[80px]"
                placeholder="Description of research, findings, or institutional milestone..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-hairline-rule">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-surface-container-low text-ink-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddEntry}
              className="px-4 py-1.5 bg-primary hover:bg-accent-ochre text-on-primary font-label-sm text-label-sm uppercase tracking-wider transition-colors"
            >
              Add to Sequence
            </button>
          </div>
        </div>
      )}

      {/* Milestone Sequence */}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-stretch">
              {/* Sequence Reorder Buttons */}
              <div className="w-12 bg-surface-container-low border-r border-hairline-rule flex flex-col items-center justify-center gap-1 group-hover:bg-amber-wash transition-colors">
                <button
                  type="button"
                  onClick={() => handleMove(i, 'up')}
                  disabled={i === 0}
                  className="p-0.5 text-ink-muted hover:text-primary disabled:opacity-20"
                  title="Move up"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(i, 'down')}
                  disabled={i === entries.length - 1}
                  className="p-0.5 text-ink-muted hover:text-primary disabled:opacity-20"
                  title="Move down"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                </button>
              </div>

              {/* Sequence Number */}
              <div className="w-16 bg-paper-surface border-r border-hairline-rule flex items-center justify-center">
                <span className="font-headline-md text-headline-md text-primary font-normal">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 mb-1">
                  {entry.date && (
                    <span className="font-label-sm text-label-sm text-primary bg-amber-wash px-2 py-0.5 border border-primary/20 rounded font-medium">
                      {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  )}
                  {entry.category && (
                    <span className="font-label-sm text-label-sm text-ink-muted bg-surface-container-high px-2 py-0.5 rounded uppercase">
                      {entry.category}
                    </span>
                  )}
                  {entry.milestone && (
                    <span className="font-label-sm text-label-sm text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded font-medium">
                      ★ KEY MILESTONE
                    </span>
                  )}
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-medium leading-snug">
                  {entry.title || `Milestone ${i + 1}`}
                </h3>
                {entry.description && (
                  <p className="font-body-sm text-body-sm text-ink-secondary mt-1 line-clamp-2">
                    {entry.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center px-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleDeleteEntry(i)}
                  className="p-1.5 text-ink-muted hover:text-rose-600 transition-colors"
                  title="Remove milestone"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="border border-hairline-rule bg-white shadow-xs rounded p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-ink-muted/20 block mb-4">timeline</span>
            <p className="text-ink-muted font-body-md mb-2">No journey milestones configured yet.</p>
            <p className="text-ink-muted font-body-sm mb-4">Add your academic and research epochs to populate the timeline.</p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add First Milestone
            </button>
          </div>
        )}
      </div>

      {/* Bottom Telemetry */}
      <footer className="bg-surface-container-lowest border border-hairline-rule px-4 py-2 flex items-center justify-between font-label-sm text-label-sm text-ink-muted shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="text-on-surface font-medium">Sequence Integrity: OK</span>
        </div>
        <span>{entries.length} entries in sequence</span>
      </footer>
    </div>
  )
}
