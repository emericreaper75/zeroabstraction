'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateCurrentStateAction } from '@/app/(admin)/admin/globals/current-state/actions'

interface CurrentStateEditorProps {
  currentState: any
}

export function CurrentStateEditor({ currentState }: CurrentStateEditorProps) {
  const router = useRouter()
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
        setFeedback({ type: 'success', message: 'Current state updated successfully.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update current state.' })
      }
    })
  }

  const fields = [
    {
      key: 'studying',
      label: 'STUDYING',
      icon: 'auto_stories',
      description: 'Current field of study or research focus',
      maxChars: 320,
      value: studying,
      setter: setStudying,
    },
    {
      key: 'building',
      label: 'BUILDING',
      icon: 'memory',
      description: 'Active engineering or development project',
      maxChars: 320,
      value: building,
      setter: setBuilding,
    },
    {
      key: 'reading',
      label: 'READING',
      icon: 'article',
      description: 'Current literature, papers, or books',
      maxChars: 320,
      value: reading,
      setter: setReading,
    },
    {
      key: 'thinking_about',
      label: 'CONTEMPLATING',
      icon: 'psychology',
      description: 'Ideas, questions, or intellectual pursuits',
      maxChars: 320,
      value: thinkingAbout,
      setter: setThinkingAbout,
    },
  ]

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>GLOBALS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">CURRENT STATE</span>
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
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Current State</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Live broadcast beacon — what you&apos;re doing right now.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Status Indicator & Visibility Toggle */}
            <button
              type="button"
              onClick={() => setVisibility(!visibility)}
              className="flex items-center gap-2 p-2 px-3.5 border border-hairline-rule bg-white shadow-xs rounded hover:border-primary/40 transition-colors"
              title="Click to toggle visibility"
            >
              <span className="relative flex h-3 w-3">
                {visibility ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-stone-400" />
                )}
              </span>
              <span className={`font-label-md text-label-md tracking-wider font-medium ${visibility ? 'text-emerald-700' : 'text-stone-500'}`}>
                {visibility ? 'BEACON ACTIVE' : 'BEACON MUTED'}
              </span>
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
              {isPending ? 'Saving...' : 'Save State'}
            </button>
          </div>
        </div>
      </header>

      {/* UTC Synchronization */}
      <div className="border border-hairline-rule bg-white p-4 shadow-xs rounded flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-primary">schedule</span>
          <div>
            <span className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest">UTC SYNCHRONIZATION</span>
            <p className="font-label-md text-label-md text-on-surface mt-0.5 font-mono">
              {currentState?.updatedAt
                ? `Last updated: ${new Date(currentState.updatedAt).toISOString().replace('T', ' ').slice(0, 19)} UTC`
                : 'Not yet synchronized'}
            </p>
          </div>
        </div>
        <span className="font-label-sm text-label-sm text-primary bg-amber-wash px-2 py-0.5 border border-primary/20 rounded font-medium">EPOCH 2025.2</span>
      </div>

      {/* Telemetry Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const charCount = field.value.length

          return (
            <div key={field.key} className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
              <div className="bg-paper-surface px-4 py-3 border-b border-hairline-rule flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">{field.icon}</span>
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest font-semibold">{field.label}</span>
                </div>
                <span className="font-label-sm text-label-sm text-ink-muted">{charCount} / {field.maxChars} chars</span>
              </div>
              <div className="p-4 space-y-2">
                <p className="font-body-sm text-body-sm text-ink-muted">{field.description}</p>
                <textarea
                  className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none resize-y min-h-[100px]"
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={`What are you ${field.label.toLowerCase()}?`}
                  maxLength={field.maxChars}
                  rows={3}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
