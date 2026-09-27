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
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isPending ? 'sync' : 'save'}
            </span>
            {isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Portrait Plate */}
          <div className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
            <div className="bg-paper-surface px-4 py-3 border-b border-hairline-rule">
              <span className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold">LEAD OBSERVER PORTRAIT PLATE</span>
            </div>
            <div className="p-5 flex items-center gap-6">
              <div className="w-24 h-24 bg-surface-container-high border border-hairline-rule rounded flex items-center justify-center shrink-0 overflow-hidden">
                {profile?.photograph?.url ? (
                  <img src={profile.photograph.url} alt="Portrait" className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="material-symbols-outlined text-[40px] text-ink-muted/30">person</span>
                )}
              </div>
              <div className="space-y-2">
                <p className="font-body-sm text-body-sm text-ink-secondary">Manage portrait plates in the Media archive.</p>
                <Link
                  href="/admin/collections/media"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-ink-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">perm_media</span>
                  Open Media Archive
                </Link>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Introduction
              </label>
              <span className="text-label-sm font-mono text-ink-muted text-[11px]">
                {introduction.length} characters
              </span>
            </div>
            <textarea
              className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none resize-y min-h-[150px]"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="A brief introduction about yourself..."
              rows={5}
            />
          </div>

          {/* Current Focus */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Current Focus
              </label>
              <span className="text-label-sm font-mono text-ink-muted text-[11px]">
                {currentFocus.length} characters
              </span>
            </div>
            <textarea
              className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none resize-y min-h-[120px]"
              value={currentFocus}
              onChange={(e) => setCurrentFocus(e.target.value)}
              placeholder="What are you currently focused on in your research and engineering?"
              rows={4}
            />
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">PROFILE TELEMETRY</h3>
            <div className="space-y-3 text-label-sm font-label-sm text-ink-muted">
              <div className="flex justify-between py-1 border-b border-hairline-subtle">
                <span>Global Slug</span>
                <span className="text-accent-ochre font-mono">profile</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline-subtle">
                <span>Last Updated</span>
                <span className="text-on-surface">
                  {profile?.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Public Visibility</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">PUBLIC PAGE</h3>
            <Link
              href="/about"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-accent-ochre transition-colors font-label-sm text-label-sm font-medium"
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
