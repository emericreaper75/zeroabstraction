import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProjectsTableClient, type ProjectRowItem } from '@/components/admin/ProjectsTableClient'

export default async function ProjectsCollectionPage() {
  await requireUser()

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    limit: 50,
    sort: '-updatedAt',
    overrideAccess: true,
  })

  const projects: ProjectRowItem[] = result.docs.map((p: any) => ({
    id: p.id,
    title: p.title || 'Untitled',
    slug: p.slug || '',
    status: p.status || 'in_progress',
    year: p.year ?? null,
    featured: Boolean(p.featured),
    linksCount: Array.isArray(p.links) ? p.links.length : 0,
    updatedAt: p.updatedAt || null,
  }))

  return <ProjectsTableClient projects={projects} />
}
