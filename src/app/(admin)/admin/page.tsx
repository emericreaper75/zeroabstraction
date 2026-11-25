import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  DashboardOverviewClient,
  type ActivityEntry,
  type HealthIssue,
  type TopicStat,
} from '@/components/admin/DashboardOverviewClient'

export default async function AdminDashboard() {
  const user = await requireUser()
  const payload = await getPayload({ config: configPromise })

  const [
    postsRes,
    publishedPostsCount,
    draftPostsCount,
    archivedPostsCount,
    projectsRes,
    completedProjectsCount,
    mediaRes,
    topicsRes,
  ] = await Promise.all([
    payload.find({ collection: 'posts', limit: 50, sort: '-updatedAt', overrideAccess: true }),
    payload
      .count({ collection: 'posts', where: { status: { equals: 'published' } } })
      .then((r) => r.totalDocs),
    payload
      .count({ collection: 'posts', where: { status: { equals: 'draft' } } })
      .then((r) => r.totalDocs),
    payload
      .count({ collection: 'posts', where: { status: { equals: 'archived' } } })
      .then((r) => r.totalDocs),
    payload.find({ collection: 'projects', limit: 20, sort: '-updatedAt', overrideAccess: true }),
    payload
      .count({ collection: 'projects', where: { status: { equals: 'completed' } } })
      .then((r) => r.totalDocs),
    payload.find({ collection: 'media', limit: 10, sort: '-createdAt', overrideAccess: true }),
    payload.find({ collection: 'topics', limit: 50, sort: 'name', overrideAccess: true }),
  ])

  let currentState: any = null
  try {
    currentState = await payload.findGlobal({ slug: 'current-state', overrideAccess: true })
  } catch {
    /* no current state yet */
  }

  let journeyCount = 0
  try {
    const journey: any = await payload.findGlobal({ slug: 'journey', overrideAccess: true })
    journeyCount = Array.isArray(journey?.entries) ? journey.entries.length : 0
  } catch {
    /* no journey yet */
  }

  // Merge recent activity across Posts, Projects, and Media
  const activities: ActivityEntry[] = [
    ...postsRes.docs.slice(0, 8).map((p: any) => ({
      id: `post-${p.id}`,
      kind: 'post' as const,
      title: p.title || 'Untitled Treatise',
      subtitle: p.excerpt || `/writing/${p.slug || ''}`,
      statusLabel: (p.status || 'draft').toUpperCase(),
      href: `/admin/collections/posts/${p.id}`,
      updatedAt: p.updatedAt || p.createdAt || '',
    })),
    ...projectsRes.docs.slice(0, 6).map((pr: any) => ({
      id: `project-${pr.id}`,
      kind: 'project' as const,
      title: pr.title || 'Untitled Rig',
      subtitle: pr.summary || `/projects/${pr.slug || ''}`,
      statusLabel: (pr.status || 'in_progress').replace('_', ' ').toUpperCase(),
      href: `/admin/collections/projects/${pr.id}`,
      updatedAt: pr.updatedAt || pr.createdAt || '',
    })),
    ...mediaRes.docs.slice(0, 6).map((m: any) => ({
      id: `media-${m.id}`,
      kind: 'media' as const,
      title: m.filename || `Media #${m.id}`,
      subtitle: m.alt_text || m.alt || m.mimeType || 'Asset plate',
      statusLabel: 'INGESTED',
      href: '/admin/collections/media',
      updatedAt: m.updatedAt || m.createdAt || '',
    })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  // Compute Topic stats from fetched posts
  const topicCountMap = new Map<string, number>()
  for (const post of postsRes.docs as any[]) {
    if (Array.isArray(post.topics)) {
      for (const t of post.topics) {
        const tid = String(typeof t === 'object' ? t.id : t)
        topicCountMap.set(tid, (topicCountMap.get(tid) || 0) + 1)
      }
    }
  }
  const topicStats: TopicStat[] = topicsRes.docs
    .map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: topicCountMap.get(String(t.id)) || 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Compute Archive Readiness & Health Issues
  const postsMissingExcerpt = postsRes.docs.filter((p: any) => !p.excerpt?.trim()).length
  const postsMissingSeo = postsRes.docs.filter((p: any) => !p.seo_metadata?.description?.trim()).length
  const postsMissingCover = postsRes.docs.filter((p: any) => !p.cover_image).length
  const totalChecks = Math.max(1, postsRes.docs.length * 3)
  const failedChecks = postsMissingExcerpt + postsMissingSeo + postsMissingCover
  const readinessScore = Math.max(0, Math.round(((totalChecks - failedChecks) / totalChecks) * 100))

  const healthIssues: HealthIssue[] = [
    {
      id: 'missing-excerpt',
      label: 'Posts missing excerpt',
      count: postsMissingExcerpt,
      href: '/admin/collections/posts',
      severity: postsMissingExcerpt > 0 ? 'warn' : 'ok',
    },
    {
      id: 'missing-seo',
      label: 'Posts missing SEO description',
      count: postsMissingSeo,
      href: '/admin/collections/posts',
      severity: postsMissingSeo > 0 ? 'warn' : 'ok',
    },
    {
      id: 'missing-cover',
      label: 'Posts missing cover plate',
      count: postsMissingCover,
      href: '/admin/collections/posts',
      severity: postsMissingCover > 0 ? 'warn' : 'ok',
    },
  ]

  const email = (user as any)?.email || ''
  const userName = email
    ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
    : 'Observer'

  const latestRaw: any = postsRes.docs[0] || null

  return (
    <DashboardOverviewClient
      userName={userName}
      metrics={{
        postsCount: postsRes.totalDocs,
        publishedPostsCount,
        draftPostsCount,
        archivedPostsCount,
        projectsCount: projectsRes.totalDocs,
        completedProjectsCount,
        mediaCount: mediaRes.totalDocs,
        topicsCount: topicsRes.totalDocs,
        journeyCount,
      }}
      activities={activities}
      latestPost={
        latestRaw
          ? {
              id: latestRaw.id,
              title: latestRaw.title,
              slug: latestRaw.slug,
              excerpt: latestRaw.excerpt,
              reading_time: latestRaw.reading_time,
              status: latestRaw.status,
              updatedAt: latestRaw.updatedAt,
            }
          : null
      }
      currentState={
        currentState
          ? {
              studying: currentState.studying,
              building: currentState.building,
              reading: currentState.reading,
              thinking_about: currentState.thinking_about,
              visibility: currentState.visibility,
              updatedAt: currentState.updatedAt,
            }
          : null
      }
      topicStats={topicStats}
      recentMedia={mediaRes.docs.slice(0, 4).map((m: any) => ({
        id: m.id,
        filename: m.filename || `plate-${m.id}`,
        url: m.url,
        mimeType: m.mimeType,
        filesize: m.filesize,
      }))}
      readinessScore={readinessScore}
      healthIssues={healthIssues}
    />
  )
}
