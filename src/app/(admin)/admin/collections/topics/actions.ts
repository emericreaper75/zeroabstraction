'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface CreateTopicPayload {
  name: string
  slug: string
  description?: string
  type?: string
}

export async function createTopicAction(formData: CreateTopicPayload) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    if (!formData.name || !formData.name.trim()) {
      return { success: false, error: 'Topic name is required.' }
    }

    if (!formData.slug || !formData.slug.trim()) {
      return { success: false, error: 'Topic slug is required.' }
    }

    const doc = await payload.create({
      collection: 'topics',
      data: {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description || '',
        type: (formData.type as any) || 'other',
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/topics')
    return { success: true, doc }
  } catch (err: any) {
    console.error('Error in createTopicAction:', err)
    return { success: false, error: err.message || 'Failed to create topic.' }
  }
}

export async function deleteTopicAction(id: string | number) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.delete({
      collection: 'topics',
      id,
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/topics')
    return { success: true }
  } catch (err: any) {
    console.error('Error in deleteTopicAction:', err)
    return { success: false, error: err.message || 'Failed to delete topic.' }
  }
}
