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
        setFeedback({ type: 'success', message: 'Profile updated.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update profile.' })
      }
    })
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
          Profile
        </h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900 text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPending ? 'sync' : 'check'}
          </span>
          {isPending ? 'Saving...' : 'Save Profile'}
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 bg-paper-surface rounded-[20px] p-6 space-y-5">
          <div className="pb-5 border-b border-[#F1F5F9] dark:border-zinc-800 flex items-center gap-5">
            <div className="w-16 h-16 bg-[#F8FAFC] dark:bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
              {profile?.photograph?.url ? (
                <img src={profile.photograph.url} alt="Portrait" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[32px] text-ink-muted/40">person</span>
              )}
            </div>
            <div className="space-y-1.5">
              <h2 className="font-studio-display text-[15px] font-semibold text-on-surface">Portrait</h2>
              <Link
                href="/admin/collections/media"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-zinc-900 text-ink-secondary text-[12px] font-medium hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">photo_library</span>
                Plates
              </Link>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-medium text-ink-secondary">Introduction</label>
              <span className="font-mono-telemetry text-[11px] text-ink-muted">{introduction.length}</span>
            </div>
            <textarea
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none rounded-[12px] resize-y min-h-[140px]"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="A brief introduction..."
              rows={5}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-medium text-ink-secondary">Current Focus</label>
              <span className="font-mono-telemetry text-[11px] text-ink-muted">{currentFocus.length}</span>
            </div>
            <textarea
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none rounded-[12px] resize-y min-h-[110px]"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder="Current research and engineering focus..."
              rows={4}
            />
          </div>
        </div>

        <div className="lg:col-span-4 bg-paper-surface rounded-[20px] p-6 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
          <div className="pb-5 space-y-2.5 text-[13px] text-ink-secondary">
            <h3 className="font-studio-display text-[16px] font-semibold text-on-surface mb-3">Status</h3>
            <div className="flex justify-between py-1">
              <span>Slug</span>
              <span className="text-on-surface font-mono-telemetry">profile</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Updated</span>
              <span className="text-on-surface font-mono-telemetry text-[12px]">
                {profile?.updatedAt
                  ? new Date(profile.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Never'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Visibility</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="pt-5">
            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#2563EB] hover:underline text-[13px] font-medium"
            >
              <span>View /about</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
