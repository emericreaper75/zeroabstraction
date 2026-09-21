import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TopicsManager } from '@/components/admin/TopicsManager'

export default async function TopicsCollectionPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'topics', limit: 100, sort: 'name' })

  // Get post counts per topic safely
  const topicCounts = await Promise.all(
    result.docs.map(async (topic: any) => {
      try {
        const countRes = await payload.count({
          collection: 'posts',
          where: { topics: { contains: topic.id } },
        })
        return { ...topic, postCount: countRes.totalDocs }
      } catch {
        return { ...topic, postCount: 0 }
      }
    })
  )

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      {/* Page Header */}
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <span>OBSERVATORY</span>
          <span>/</span>
          <span>COLLECTIONS</span>
          <span>/</span>
          <span className="text-on-surface font-medium tracking-wide">TAXONOMY &amp; TAGS</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">
              Topics &amp; Taxonomy
            </h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">
              Classification schema for essays, engineering rigs, and observational data.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-amber-wash text-accent-ochre font-medium">
              {result.totalDocs} TOPICS INDEXED
            </span>
          </div>
        </div>
      </header>

      {/* Interactive Topics Manager */}
      <TopicsManager initialTopics={topicCounts} totalDocs={result.totalDocs} />
    </div>
  )
}
