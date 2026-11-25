'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '@/app/(admin)/admin/globals/profile/actions'

interface ProfileEditorProps {
  profile: any
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const router = useRouter()
  const [introduction, setIntroduction] = useState(profile?.introduction || '')
  const [currentFocus, setCurrentFocus] = useState(profile?.current_focus || '')

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSave = () => {
    setFeedback(null)
    startTransition(async () => {
      const res = await updateProfileAction({
        introduction,
        current_focus: currentFocus,
      })

      if (res.success) {
        setFeedback({ type: 'success', message: 'Profile updated successfully.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update profile.' })
      }
    })
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>GLOBALS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">PROFILE &amp; ATELIER</span>
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
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Profile &amp; About</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Lead observer dossier and public biography configuration.</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? 'sync' : 'save'}
            </span>
            {isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Form (8 cols) */}
        <div className="lg:col-span-8 bg-paper-surface rounded-[20px] p-6 space-y-5">
          {/* Portrait Plate */}
          <div className="pb-5 border-b border-[#F1F5F9] dark:border-zinc-800 flex items-center gap-5">
            <div className="w-20 h-20 bg-[#F8FAFC] dark:bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
              {profile?.photograph?.url ? (
                <img src={profile.photograph.url} alt="Portrait" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[36px] text-ink-muted/40">person</span>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="font-studio-display text-[15px] font-semibold text-on-surface">Lead Observer Portrait</h2>
              <Link
                href="/admin/collections/media"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F8FAFC] dark:bg-zinc-900 text-ink-secondary text-[12px] font-medium hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">photo_library</span>
                Open Media Plates
              </Link>
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-medium text-ink-secondary">
                Introduction
              </label>
              <span className="font-mono-telemetry text-[11px] text-ink-muted">
                {introduction.length} chars
              </span>
            </div>
            <textarea
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none rounded-[12px] resize-y min-h-[150px]"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="A brief introduction about yourself..."
              rows={5}
            />
          </div>

          {/* Current Focus */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-medium text-ink-secondary">
                Current Focus
              </label>
              <span className="font-mono-telemetry text-[11px] text-ink-muted">
                {currentFocus.length} chars
              </span>
            </div>
            <textarea
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none rounded-[12px] resize-y min-h-[120px]"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder="What are you currently focused on in your research and engineering?"
              rows={4}
            />
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-paper-surface rounded-[20px] p-6 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
          <div className="pb-5">
            <h3 className="font-studio-display text-[16px] font-semibold text-on-surface mb-3">Profile Telemetry</h3>
            <div className="space-y-2.5 text-[13px] text-ink-secondary">
              <div className="flex justify-between py-1">
                <span>Global Slug</span>
                <span className="text-on-surface font-mono-telemetry">profile</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Last Updated</span>
                <span className="text-on-surface font-mono-telemetry text-[12px]">
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Public Visibility</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <h3 className="font-studio-display text-[16px] font-semibold text-on-surface mb-3">Public Page</h3>
            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2563EB] hover:underline text-[13px] font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              View /about page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
