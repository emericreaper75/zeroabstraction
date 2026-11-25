import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostsTableClient, type PostRowItem } from '@/components/admin/PostsTableClient'

export default async function PostsCollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  await requireUser()

  const params = await searchParams
  const payload = await getPayload({ config: configPromise })
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const limit = 15
  const statusFilter =
    params.status === 'published' || params.status === 'draft' || params.status === 'archived'
      ? params.status
      : 'all'

  const where = statusFilter !== 'all' ? { status: { equals: statusFilter } } : undefined

  const [postsResult, allCountRes, publishedCountRes, draftCountRes, archivedCountRes] =
    await Promise.all([
      payload.find({
        collection: 'posts',
        limit,
        page,
        sort: '-updatedAt',
        where,
        depth: 1,
        overrideAccess: true,
      }),
      payload.count({ collection: 'posts' }),
      payload.count({ collection: 'posts', where: { status: { equals: 'published' } } }),
      payload.count({ collection: 'posts', where: { status: { equals: 'draft' } } }),
      payload.count({ collection: 'posts', where: { status: { equals: 'archived' } } }),
    ])

  const posts: PostRowItem[] = postsResult.docs.map((post: any) => ({
    id: post.id,
    title: post.title || 'Untitled',
    slug: post.slug || '',
    status: post.status || 'draft',
    reading_time: post.reading_time ?? null,
    featured: Boolean(post.featured),
    updatedAt: post.updatedAt || null,
    topics: Array.isArray(post.topics)
      ? post.topics
          .filter((t: any) => t && typeof t === 'object')
          .map((t: any) => ({ id: t.id, name: t.name }))
      : [],
  }))

  return (
    <PostsTableClient
      posts={posts}
      statusFilter={statusFilter}
      allCount={allCountRes.totalDocs}
      publishedCount={publishedCountRes.totalDocs}
      draftCount={draftCountRes.totalDocs}
      archivedCount={archivedCountRes.totalDocs}
      page={page}
      limit={limit}
      totalPages={postsResult.totalPages}
      filteredTotal={postsResult.totalDocs}
    />
  )
}
