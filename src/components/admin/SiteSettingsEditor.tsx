'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateSiteSettingsAction } from '@/app/(admin)/admin/globals/site-settings/actions'

interface SiteSettingsEditorProps {
  settings: any
}

export function SiteSettingsEditor({ settings }: SiteSettingsEditorProps) {
  const router = useRouter()
  const initialGithub =
    settings?.social_links?.find((s: any) => s.platform?.toLowerCase() === 'github')?.url || ''
  const initialLinkedin =
    settings?.social_links?.find((s: any) => s.platform?.toLowerCase() === 'linkedin')?.url || ''

  const [name, setName] = useState(settings?.name || 'ZeroAbstraction')
  const [shortBio, setShortBio] = useState(settings?.short_bio || '')
  const [email, setEmail] = useState(settings?.email || '')
  const [githubUrl, setGithubUrl] = useState(initialGithub)
  const [linkedinUrl, setLinkedinUrl] = useState(initialLinkedin)
  const [footerText, setFooterText] = useState(settings?.footer_text || '')
  const [defaultMode, setDefaultMode] = useState<'light' | 'dark' | 'system'>(
    settings?.theme_settings?.default_mode || 'system'
  )

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSave = () => {
    setFeedback(null)
    startTransition(async () => {
      const social_links: Array<{ platform: string; url: string }> = []
      if (githubUrl.trim()) social_links.push({ platform: 'GitHub', url: githubUrl.trim() })
      if (linkedinUrl.trim()) social_links.push({ platform: 'LinkedIn', url: linkedinUrl.trim() })
      if (Array.isArray(settings?.social_links)) {
        for (const item of settings.social_links) {
          if (!['github', 'linkedin'].includes(item.platform?.toLowerCase()) && item.url) {
            social_links.push({ platform: item.platform, url: item.url })
          }
        }
      }

      const res = await updateSiteSettingsAction({
        name,
        short_bio: shortBio,
        email,
        footer_text: footerText,
        social_links,
        theme_settings: { default_mode: defaultMode },
      })

      if (res.success) {
        setFeedback({ type: 'success', message: 'Site settings updated.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update site settings.' })
      }
    })
  }

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-studio-display text-[28px] font-semibold text-on-surface tracking-[-0.02em] leading-tight">
          Site Settings
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
          {isPending ? 'Saving...' : 'Save Settings'}
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

      <div className="bg-paper-surface rounded-[20px] p-6 divide-y divide-[#F1F5F9] dark:divide-zinc-800">
        <div className="pb-6 space-y-4">
          <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] text-ink-secondary">Site Name</label>
              <input
                type="text"
                className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ZeroAbstraction"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] text-ink-secondary">Default Theme</label>
              <select
                className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
                value={defaultMode}
                onChange={(e) => setDefaultMode(e.target.value as any)}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[13px] text-ink-secondary">Tagline</label>
            <textarea
              className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-3 focus:outline-none resize-none"
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="Astrophysics, engineering, and personal research archive."
              rows={2}
            />
          </div>
        </div>

        <div className="py-6 space-y-4">
          <h2 className="font-studio-display text-[16px] font-semibold text-on-surface">Contact &amp; Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] text-ink-secondary">Email</label>
              <input
                type="email"
                className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@zeroabstraction.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] text-ink-secondary">GitHub</label>
              <input
                type="url"
                className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] text-ink-secondary">LinkedIn</label>
              <input
                type="url"
                className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-1.5">
          <label className="block text-[13px] text-ink-secondary">Footer Colophon</label>
          <input
            type="text"
            className="w-full bg-[#F8FAFC] dark:bg-zinc-900 border-0 text-on-surface text-[14px] px-3.5 py-2.5 focus:outline-none"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Personal universe archival system"
          />
        </div>
      </div>
    </div>
  )
}
