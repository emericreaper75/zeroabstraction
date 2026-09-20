import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function CurrentStatePage() {
  const payload = await getPayload({ config: configPromise })

  let currentState: any = null
  try {
    currentState = await payload.findGlobal({ slug: 'current-state' })
  } catch { /* not configured yet */ }

  const fields = [
    { key: 'studying', label: 'STUDYING', icon: 'auto_stories', description: 'Current field of study or research focus', maxChars: 320 },
    { key: 'building', label: 'BUILDING', icon: 'memory', description: 'Active engineering or development project', maxChars: 320 },
    { key: 'reading', label: 'READING', icon: 'article', description: 'Current literature, papers, or books', maxChars: 320 },
    { key: 'thinking_about', label: 'CONTEMPLATING', icon: 'psychology', description: 'Ideas, questions, or intellectual pursuits', maxChars: 320 },
  ]

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <Link href="/admin" className="hover:text-primary transition-colors">OBSERVATORY</Link>
          <span>/</span><span>GLOBALS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">CURRENT STATE</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Current State</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Live broadcast beacon — what you&apos;re doing right now.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 p-2 px-3.5 border border-hairline-rule bg-white shadow-xs rounded">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
              </span>
              <span className="font-label-md text-label-md text-emerald-700 tracking-wider font-medium">BEACON ACTIVE</span>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-accent-ochre text-on-primary font-label-md text-label-md uppercase tracking-wider shadow-sm transition-colors">
              <span className="material-symbols-outlined text-[16px]">save</span>
              Save State
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
          const value = currentState?.[field.key] || ''
          const charCount = value.length

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
                  defaultValue={value}
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
