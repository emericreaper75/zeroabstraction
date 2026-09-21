'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { markdownToLexical } from '@/lib/lexicalConverter'

export interface SavePostPayload {
  id?: string | number | null
  title: string
  slug: string
  excerpt?: string
  contentMarkdown: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string | null
  topics?: (number | string)[]
  reading_time?: number
  featured?: boolean
}

export async function savePostAction(formData: SavePostPayload) {
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

    const lexicalContent = markdownToLexical(formData.contentMarkdown || '')

    // Calculate reading time
    const words = (formData.contentMarkdown || '').trim().split(/\s+/).filter(Boolean).length
    const readingTime = formData.reading_time || Math.max(1, Math.ceil(words / 200))

    const dataToSave: any = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt || '',
      content: lexicalContent,
      status: formData.status || 'draft',
      published_at:
        formData.published_at || (formData.status === 'published' ? new Date().toISOString() : null),
      reading_time: readingTime,
      topics: formData.topics && formData.topics.length > 0 ? formData.topics : [],
      featured: Boolean(formData.featured),
    }

    let savedDoc: any

    if (formData.id && formData.id !== 'new') {
      savedDoc = await payload.update({
        collection: 'posts',
        id: formData.id,
        data: dataToSave,
        overrideAccess: true,
      })
    } else {
      savedDoc = await payload.create({
        collection: 'posts',
        data: dataToSave,
        overrideAccess: true,
      })
    }

    revalidatePath('/admin/collections/posts')
    revalidatePath(`/admin/collections/posts/${savedDoc.id}`)
    revalidatePath('/writing')
    if (savedDoc.slug) {
      revalidatePath(`/writing/${savedDoc.slug}`)
    }

    return { success: true, doc: savedDoc }
  } catch (err: any) {
    console.error('Error in savePostAction:', err)
    return { success: false, error: err.message || 'Failed to save post.' }
  }
}

export async function deletePostAction(id: string | number) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.delete({
      collection: 'posts',
      id,
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/posts')
    revalidatePath('/writing')

    return { success: true }
  } catch (err: any) {
    console.error('Error in deletePostAction:', err)
    return { success: false, error: err.message || 'Failed to delete post.' }
  }
}
