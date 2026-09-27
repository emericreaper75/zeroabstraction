'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function uploadMediaAction(formData: FormData) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided.' }
    }

    const altText = (formData.get('alt_text') as string) || file.name
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let type: 'image' | 'video' | 'document' = 'document'
    if (file.type.startsWith('image/')) type = 'image'
    else if (file.type.startsWith('video/')) type = 'video'

    const doc = await payload.create({
      collection: 'media',
      data: {
        alt_text: altText,
        type,
      },
      file: {
        data: buffer,
        name: file.name,
        mimetype: file.type,
        size: file.size,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/media')

    return { success: true, doc }
  } catch (err: any) {
    console.error('Error in uploadMediaAction:', err)
    return { success: false, error: err.message || 'Failed to upload media.' }
  }
}

export async function deleteMediaAction(id: string | number) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.delete({
      collection: 'media',
      id,
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/media')

    return { success: true }
  } catch (err: any) {
    console.error('Error in deleteMediaAction:', err)
    return { success: false, error: err.message || 'Failed to delete media.' }
  }
}
