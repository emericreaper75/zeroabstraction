'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateSiteSettingsAction } from '@/app/(admin)/admin/globals/site-settings/actions'

interface SiteSettingsEditorProps {
  settings: any
}

export function SiteSettingsEditor({ settings }: SiteSettingsEditorProps) {
  const router = useRouter()
  const [name, setName] = useState(settings?.name || 'ZeroAbstraction')
  const [shortBio, setShortBio] = useState(settings?.short_bio || '')
  const [email, setEmail] = useState(settings?.email || '')
  const [footerText, setFooterText] = useState(settings?.footer_text || '')
  const [defaultMode, setDefaultMode] = useState<'light' | 'dark' | 'system'>(
    settings?.theme_settings?.default_mode || 'system'
  )

  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSave = () => {
    setFeedback(null)
    startTransition(async () => {
      const res = await updateSiteSettingsAction({
        name,
        short_bio: shortBio,
        email,
        footer_text: footerText,
        theme_settings: {
          default_mode: defaultMode,
        },
      })

      if (res.success) {
        setFeedback({ type: 'success', message: 'Site settings updated successfully.' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update site settings.' })
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
          <span className="text-on-surface font-medium tracking-wide">SITE SETTINGS</span>
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
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Site Settings</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Colophon, identity, and substrate configuration.</p>
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
            {isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-6">
        {/* Identity & Frontispiece */}
        <div className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
          <div className="bg-paper-surface px-5 py-4 border-b border-hairline-rule flex items-center gap-4">
            <span className="font-headline-md text-headline-md text-primary font-normal w-10">01</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-ink-muted">badge</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Frontispiece &amp; Identity</h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Site Name / Title
              </label>
              <input
                type="text"
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ZeroAbstraction"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Short Biography / Tagline
              </label>
              <textarea
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none resize-y min-h-[80px]"
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="Astrophysics, engineering, and personal research archive."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Contact & Communications */}
        <div className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
          <div className="bg-paper-surface px-5 py-4 border-b border-hairline-rule flex items-center gap-4">
            <span className="font-headline-md text-headline-md text-primary font-normal w-10">02</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-ink-muted">alternate_email</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Communications</h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Contact Email
              </label>
              <input
                type="email"
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@zeroabstraction.com"
              />
            </div>
          </div>
        </div>

        {/* Optics & Substrate */}
        <div className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
          <div className="bg-paper-surface px-5 py-4 border-b border-hairline-rule flex items-center gap-4">
            <span className="font-headline-md text-headline-md text-primary font-normal w-10">03</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-ink-muted">palette</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Optics &amp; Theme Mode</h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Default Theme Mode
              </label>
              <select
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none"
                value={defaultMode}
                onChange={(e) => setDefaultMode(e.target.value as any)}
              >
                <option value="system">System (follows OS preference)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Colophon & Footer */}
        <div className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
          <div className="bg-paper-surface px-5 py-4 border-b border-hairline-rule flex items-center gap-4">
            <span className="font-headline-md text-headline-md text-primary font-normal w-10">04</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-ink-muted">gavel</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">Colophon &amp; Footer</h2>
            </div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">
                Footer Text / Colophon
              </label>
              <input
                type="text"
                className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="Personal universe archival system · All rights reserved."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
