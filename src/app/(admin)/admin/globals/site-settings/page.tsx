import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function SiteSettingsPage() {
  const payload = await getPayload({ config: configPromise })

  let settings: any = null
  try {
    settings = await payload.findGlobal({ slug: 'site-settings' })
  } catch { /* not configured yet */ }

  const sections = [
    {
      number: '01',
      title: 'Frontispiece',
      icon: 'home',
      fields: [
        { label: 'Site Title', key: 'site_title', placeholder: 'ZeroAbstraction', type: 'text' },
        { label: 'Tagline', key: 'tagline', placeholder: 'Personal Universe', type: 'text' },
        { label: 'Description', key: 'description', placeholder: 'A brief site description for SEO...', type: 'textarea' },
      ],
    },
    {
      number: '02',
      title: 'Syndication',
      icon: 'rss_feed',
      fields: [
        { label: 'GitHub URL', key: 'github_url', placeholder: 'https://github.com/...', type: 'text' },
        { label: 'Twitter / X', key: 'twitter_url', placeholder: 'https://x.com/...', type: 'text' },
        { label: 'Email', key: 'contact_email', placeholder: 'hello@zeroabstraction.com', type: 'text' },
      ],
    },
    {
      number: '03',
      title: 'Taxonomy Routing',
      icon: 'category',
      fields: [
        { label: 'Default Topic', key: 'default_topic', placeholder: 'General', type: 'text' },
        { label: 'Posts Per Page', key: 'posts_per_page', placeholder: '10', type: 'number' },
      ],
    },
    {
      number: '04',
      title: 'Optics & Substrate',
      icon: 'palette',
      fields: [
        { label: 'Default Theme', key: 'default_theme', placeholder: 'light', type: 'text' },
        { label: 'Enable KaTeX', key: 'enable_katex', placeholder: '', type: 'checkbox' },
      ],
    },
    {
      number: '05',
      title: 'Colophon & Legals',
      icon: 'gavel',
      fields: [
        { label: 'Copyright Text', key: 'copyright', placeholder: '© 2025 Manoj Amavasya', type: 'text' },
        { label: 'License', key: 'license', placeholder: 'CC BY-NC-SA 4.0', type: 'text' },
      ],
    },
  ]

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>GLOBALS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">SITE SETTINGS</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Site Settings</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Colophon, syndication, and substrate configuration.</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
            <span className="material-symbols-outlined text-[16px]">save</span>
            Save Settings
          </button>
        </div>
      </header>

      {/* Numbered Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.number} className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
            <div className="bg-paper-surface px-5 py-4 border-b border-hairline-rule flex items-center gap-4">
              <span className="font-headline-md text-headline-md text-primary font-normal w-10">{section.number}</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-ink-muted">{section.icon}</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-medium">{section.title}</h2>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none resize-y min-h-[80px]"
                      defaultValue={settings?.[field.key] || ''}
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="atelier-checkbox" defaultChecked={settings?.[field.key] || false} />
                      <span className="font-body-sm text-body-sm text-ink-secondary">Enabled</span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full bg-surface-container-lowest border border-hairline-rule text-on-surface font-body-md text-body-md px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none"
                      defaultValue={settings?.[field.key] || ''}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
