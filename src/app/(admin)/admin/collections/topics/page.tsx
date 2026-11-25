import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { TopicsManager } from '@/components/admin/TopicsManager'

export default async function TopicsCollectionPage() {
  await requireUser();

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
    <div className="flex flex-col w-full pb-12 space-y-5">
      {/* Page Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="typo-breadcrumb">Observatory / Collections / Topics</div>
          <h1 className="typo-page-title text-on-surface">Topics &amp; Taxonomy</h1>
        </div>
        <span className="typo-pill px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300">
          {result.totalDocs} Topics
        </span>
      </header>

      {/* Interactive Topics Manager */}
      <TopicsManager initialTopics={topicCounts} totalDocs={result.totalDocs} />
    </div>
  )
}
