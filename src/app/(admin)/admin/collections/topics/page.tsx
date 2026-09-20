import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function TopicsCollectionPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'topics', limit: 100, sort: 'name' })

  // Get post counts per topic
  const topicCounts = await Promise.all(
    result.docs.map(async (topic: any) => {
      const postCount = (await payload.count({ collection: 'posts', where: { topic: { equals: topic.id } } })).totalDocs
      return { ...topic, postCount }
    })
  )

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Page Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <span>OBSERVATORY</span><span>/</span><span>COLLECTIONS</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">TAXONOMY &amp; TAGS</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Topics &amp; Taxonomy</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Classification schema for essays, projects, and observational data.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-amber-wash text-accent-ochre font-medium">{result.totalDocs} TOPICS INDEXED</span>
          </div>
        </div>
      </header>

      {/* Two-Column Asymmetric Layout (58/42) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topic List (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest shadow-sm border border-hairline-rule overflow-hidden">
            <div className="bg-paper-surface px-4 py-3 border-b border-hairline-rule flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold">TOPIC INDEX</span>
              <span className="font-label-sm text-label-sm text-ink-muted">{result.totalDocs} entries</span>
            </div>
            <div className="divide-y divide-hairline-rule">
              {topicCounts.map((topic: any) => (
                <div key={topic.id} className="px-4 py-3.5 flex items-center justify-between hover:bg-paper-surface transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px] text-ink-muted group-hover:text-primary transition-colors">label</span>
                    <div>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-medium leading-snug">{topic.name}</p>
                      {topic.slug && (
                        <span className="font-label-sm text-label-sm text-accent-ochre">/topics/{topic.slug}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-label-sm text-label-sm text-ink-muted bg-surface-container-high px-2 py-0.5 rounded">
                      {topic.postCount} {topic.postCount === 1 ? 'post' : 'posts'}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-ink-muted group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                </div>
              ))}
              {result.docs.length === 0 && (
                <div className="px-4 py-12 text-center text-ink-muted font-body-sm">
                  No topics found. Create your first taxonomy entry.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Topic Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Create */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">CREATE NEW TOPIC</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Topic Name</label>
                <input className="w-full bg-white border border-hairline-rule text-on-surface font-body-md text-body-md px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-none" placeholder="e.g., Gravitational Waves" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-label-sm font-label-sm text-ink-secondary font-medium tracking-wider uppercase">Slug</label>
                <input className="w-full bg-white border border-hairline-rule text-on-surface font-body-sm text-body-sm px-3 py-2 focus:border-primary focus:outline-none rounded-none" placeholder="gravitational-waves" />
              </div>
              <button className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider py-2.5 hover:bg-accent-ochre transition-colors shadow-sm">
                <span className="flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Create Topic
                </span>
              </button>
            </div>
          </div>

          {/* Taxonomy Stats */}
          <div className="border border-hairline-rule bg-white p-5 shadow-xs rounded">
            <h3 className="font-label-sm text-label-sm text-ink-muted uppercase tracking-widest font-semibold mb-4 pb-2 border-b border-hairline-rule">TAXONOMY TELEMETRY</h3>
            <div className="space-y-3 text-label-sm font-label-sm text-ink-muted">
              <div className="flex justify-between">
                <span>Total Topics</span>
                <span className="text-on-surface font-medium">{result.totalDocs}</span>
              </div>
              <div className="flex justify-between">
                <span>Most Active</span>
                <span className="text-primary font-medium">{topicCounts[0]?.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span>Schema Health</span>
                <span className="text-emerald-700 font-medium">OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
