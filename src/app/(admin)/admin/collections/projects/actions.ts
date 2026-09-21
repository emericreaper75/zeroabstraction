'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { markdownToLexical } from '@/lib/lexicalConverter'

export interface SaveProjectPayload {
  id?: string | number | null
  title: string
  slug: string
  summary?: string
  descriptionMarkdown?: string
  lessonsMarkdown?: string
  year?: number | null
  status?: 'in_progress' | 'completed' | 'archived'
  topics?: (number | string)[]
  technologies?: string[]
  featured?: boolean
}

export async function saveProjectAction(formData: SaveProjectPayload) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    if (!formData.title || !formData.title.trim()) {
      return { success: false, error: 'Title is required.' }
    }

    if (!formData.slug || !formData.slug.trim()) {
      return { success: false, error: 'Canonical slug is required.' }
    }

    const descriptionLexical = markdownToLexical(formData.descriptionMarkdown || '')
    const lessonsLexical = formData.lessonsMarkdown
      ? markdownToLexical(formData.lessonsMarkdown)
      : null

    const techArray = (formData.technologies || [])
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name }))

    const dataToSave: any = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      summary: formData.summary || '',
      description: descriptionLexical,
      year: formData.year ? Number(formData.year) : null,
      status: formData.status || 'in_progress',
      topics: formData.topics && formData.topics.length > 0 ? formData.topics : [],
      technologies: techArray,
      featured: Boolean(formData.featured),
    }

    if (lessonsLexical) {
      dataToSave.lessons = lessonsLexical
    }

    let savedDoc: any

    if (formData.id && formData.id !== 'new') {
      savedDoc = await payload.update({
        collection: 'projects',
        id: formData.id,
        data: dataToSave,
        overrideAccess: true,
      })
    } else {
      savedDoc = await payload.create({
        collection: 'projects',
        data: dataToSave,
        overrideAccess: true,
      })
    }

    revalidatePath('/admin/collections/projects')
    revalidatePath(`/admin/collections/projects/${savedDoc.id}`)
    revalidatePath('/projects')
    if (savedDoc.slug) {
      revalidatePath(`/projects/${savedDoc.slug}`)
    }

    return { success: true, doc: savedDoc }
  } catch (err: any) {
    console.error('Error in saveProjectAction:', err)
    return { success: false, error: err.message || 'Failed to save project.' }
  }
}

export async function deleteProjectAction(id: string | number) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.delete({
      collection: 'projects',
      id,
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/projects')
    revalidatePath('/projects')

    return { success: true }
  } catch (err: any) {
    console.error('Error in deleteProjectAction:', err)
    return { success: false, error: err.message || 'Failed to delete project.' }
  }
}
