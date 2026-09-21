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
  const { id } = await params
  const payload = await getPayload({ config: configPromise })

  const topicsResult = await payload.find({ collection: 'topics', limit: 100, sort: 'name' })
  const topics = topicsResult.docs

  if (id === 'new') {
    return (
      <ProjectEditor
        project={null}
        topics={topics}
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
      initialDescriptionMarkdown={initialDescriptionMarkdown}
      initialLessonsMarkdown={initialLessonsMarkdown}
    />
  )
}
