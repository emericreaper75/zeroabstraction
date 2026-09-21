import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/PostEditor'
import { lexicalToMarkdown } from '@/lib/lexicalConverter'

export default async function PostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  const topicsResult = await payload.find({ collection: 'topics', limit: 100, sort: 'name' })
  const topics = topicsResult.docs

  if (id === 'new') {
    return <PostEditor post={null} topics={topics} initialMarkdown="" />
  }

  let post: any
  try {
    post = await payload.findByID({ collection: 'posts', id, depth: 1 })
  } catch {
    notFound()
  }

  if (!post) {
    notFound()
  }

  const initialMarkdown = lexicalToMarkdown(post.content)

  return <PostEditor post={post} topics={topics} initialMarkdown={initialMarkdown} />
}
