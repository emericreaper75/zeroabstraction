'use client'

import React, { useState, useTransition } from 'react'
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
        setFeedback({ type: 'success', message: 'Journey saved.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save journey.' })
      }
    })
  }

  const handleAddEntry = () => {
    if (!newTitle.trim()) return
    const nextOrder = entries.length > 0 ? Math.max(...entries.map((e) => e.order || 0)) + 1 : 1
    setEntries([
      ...entries,
      {
        order: nextOrder,
        title: newTitle.trim(),
        category: newCategory,
        date: newDate || null,
        description: newDescription.trim() || null,
        milestone: newMilestone,
      },
    ])
    setNewTitle('')
    setNewDescription('')
    setNewDate('')
    setNewMilestone(false)
    setShowAddForm(false)
  }

  const handleDeleteEntry = (index: number) => {
    const updated = entries.filter((_, idx) => idx !== index)
    setEntries(updated.map((e, idx) => ({ ...e, order: idx + 1 })))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= entries.length) return
    const newArr = [...entries]
    const temp = newArr[index]
    newArr[index] = newArr[targetIndex]
    newArr[targetIndex] = temp
    setEntries(newArr.map((e, idx) => ({ ...e, order: idx + 1 })))
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
          Journey
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-paper-surface text-on-surface text-[13px] font-medium hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">{showAddForm ? 'close' : 'add'}</span>
            {showAddForm ? 'Cancel' : 'Add Milestone'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">{isPending ? 'sync' : 'check'}</span>
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-[14px] flex items-center justify-between text-[13px] ${
            feedback.type === 'success'
              ? 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'bg-[#FEF2F2] text-[#DC2626] dark:bg-rose-950/50 dark:text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} aria-label="Dismiss">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-paper-surface rounded-[20px] p-6 space-y-4">
          <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">New Milestone</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              className="bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
              placeholder="Milestone title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <select
              className="bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
            >
              <option value="astrophysics">Astrophysics</option>
              <option value="physics">Physics</option>
              <option value="ece">ECE</option>
            </select>
            <input
              type="date"
              className="bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <textarea
            className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none resize-none"
            placeholder="Notes..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[13px] text-on-surface cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[#0F172A]"
                checked={newMilestone}
                onChange={(e) => setNewMilestone(e.target.checked)}
              />
              <span>Major Landmark</span>
            </label>
            <button
              type="button"
              onClick={handleAddEntry}
              className="px-4 py-1.5 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="bg-paper-surface rounded-[20px] p-6 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
        {entries.map((entry, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono-telemetry text-[12px] text-ink-muted w-6">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-on-surface truncate">{entry.title}</span>
                  {entry.milestone && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 font-mono-telemetry text-[10px] font-semibold uppercase">
                      Landmark
                    </span>
                  )}
                </div>
                {entry.description && (
                  <p className="text-[13px] text-ink-secondary truncate mt-0.5">{entry.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono-telemetry text-[11px] text-ink-muted uppercase">{entry.category}</span>
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                aria-label="Move up"
                className="p-1 text-ink-muted hover:text-on-surface disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === entries.length - 1}
                aria-label="Move down"
                className="p-1 text-ink-muted hover:text-on-surface disabled:opacity-30"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEntry(idx)}
                aria-label="Delete milestone"
                className="p-1 text-ink-muted hover:text-rose-500"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="py-10 text-center text-[13px] text-ink-muted">
            No milestones yet.
          </div>
        )}
      </div>
    </div>
  )
}
