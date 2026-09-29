import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { ProjectEditor } from '@/components/admin/ProjectEditor'
import { lexicalToMarkdown } from '@/lib/lexicalConverter'

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireUser();

  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  const topicsResult = await payload.find({ collection: 'topics', limit: 100, sort: 'name' })
  const topics = topicsResult.docs

  const mediaResult = await payload.find({ collection: 'media', limit: 100, sort: '-createdAt' })
  const allMedia = mediaResult.docs

  const postsResult = await payload.find({ collection: 'posts', limit: 100, sort: 'title' })
  const allPosts = postsResult.docs

  if (id === 'new') {
    return (
      <ProjectEditor
        project={null}
        topics={topics}
        allMedia={allMedia}
        allPosts={allPosts}
        initialDescriptionMarkdown=""
        initialLessonsMarkdown=""
      />
    )
  }

  let project: any = null
  try {
    project = await payload.findByID({ collection: 'projects', id, depth: 1 })
  } catch {
    notFound()
  }

  if (!project) {
    notFound()
  }

  const initialDescriptionMarkdown = lexicalToMarkdown(project.description)
  const initialLessonsMarkdown = lexicalToMarkdown(project.lessons)

  return (
    <ProjectEditor
      project={project}
      topics={topics}
      allMedia={allMedia}
      allPosts={allPosts}
      initialDescriptionMarkdown={initialDescriptionMarkdown}
      initialLessonsMarkdown={initialLessonsMarkdown}
    />
  )
}
