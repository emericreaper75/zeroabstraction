import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AdminSidebarClient, type AdminSidebarCounts } from './AdminSidebarClient'

export async function getAdminSidebarCounts(): Promise<AdminSidebarCounts> {
  const payload = await getPayload({ config: configPromise })

  const [postsCount, publishedPostsCount, projectsCount, mediaCount, topicsCount, usersCount] =
    await Promise.all([
      payload.count({ collection: 'posts' }).then((res) => res.totalDocs),
      payload
        .count({ collection: 'posts', where: { status: { equals: 'published' } } })
        .then((res) => res.totalDocs),
      payload.count({ collection: 'projects' }).then((res) => res.totalDocs),
      payload.count({ collection: 'media' }).then((res) => res.totalDocs),
      payload.count({ collection: 'topics' }).then((res) => res.totalDocs),
      payload.count({ collection: 'users' }).then((res) => res.totalDocs),
    ])

  return {
    postsCount,
    publishedPostsCount,
    draftPostsCount: Math.max(0, postsCount - publishedPostsCount),
    projectsCount,
    mediaCount,
    topicsCount,
    usersCount,
  }
}

export async function AdminSidebar() {
  const counts = await getAdminSidebarCounts()
  return <AdminSidebarClient counts={counts} />
}
