'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCurrentStateAction } from '@/app/(admin)/admin/globals/current-state/actions'
import { useAdminToast } from './AdminToastProvider'

interface CurrentStateEditorProps {
  currentState: any
}

export function CurrentStateEditor({ currentState }: CurrentStateEditorProps) {
  const router = useRouter()
  const toast = useAdminToast()
  const [studying, setStudying] = useState(currentState?.studying || '')
  const [building, setBuilding] = useState(currentState?.building || '')
  const [reading, setReading] = useState(currentState?.reading || '')
  const [thinkingAbout, setThinkingAbout] = useState(currentState?.thinking_about || '')
  const [visibility, setVisibility] = useState<boolean>(currentState?.visibility ?? true)

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSave = () => {
    setFeedback(null)
    startTransition(async () => {
      const res = await updateCurrentStateAction({
        studying,
        building,
        reading,
        thinking_about: thinkingAbout,
        visibility,
      })

      if (res.success) {
        toast.success('Field telemetry synced.')
        setFeedback({ type: 'success', message: 'Current state updated.' })
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to update current state.')
        setFeedback({ type: 'error', message: res.error || 'Failed to update current state.' })
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

  const fields = [
    { key: 'studying', label: 'Studying', icon: 'auto_stories', maxChars: 320, value: studying, setter: setStudying },
    { key: 'building', label: 'Building', icon: 'memory', maxChars: 320, value: building, setter: setBuilding },
    { key: 'reading', label: 'Reading', icon: 'article', maxChars: 320, value: reading, setter: setReading },
    { key: 'thinking_about', label: 'Thinking', icon: 'psychology', maxChars: 320, value: thinkingAbout, setter: setThinkingAbout },
  ]

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
          Current State
        </h1>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setVisibility(!visibility)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-paper-surface text-[12px] font-medium transition-colors"
            title="Toggle public visibility"
          >
            <span className={`w-2 h-2 rounded-full ${visibility ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span className="text-on-surface">{visibility ? 'Live' : 'Muted'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? 'sync' : 'check'}
            </span>
            {isPending ? 'Saving...' : 'Save State'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field.key} className="bg-paper-surface rounded-[20px] p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-ink-secondary">{field.icon}</span>
                <span className="font-studio-display text-[15px] font-semibold text-on-surface">{field.label}</span>
              </div>
              <span className="font-mono-telemetry text-[11px] text-ink-muted">
                {field.value.length}/{field.maxChars}
              </span>
            </div>
            <textarea
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none rounded-[12px] resize-none"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={`What are you ${field.label.toLowerCase()}?`}
              maxLength={field.maxChars}
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
