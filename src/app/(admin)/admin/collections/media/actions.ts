'use server'

import fs from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

function sanitizeFilename(rawName: string, fallbackExt: string): string {
  const base = path.basename(rawName.trim()).replace(/[\s]+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '')
  if (!base) return `plate-${Date.now()}${fallbackExt}`
  if (!path.extname(base) && fallbackExt) {
    return `${base}${fallbackExt}`
  }
  return base
}

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

    const customFilename = (formData.get('custom_filename') as string) || ''
    const fallbackExt = path.extname(file.name)
    const finalName = customFilename.trim()
      ? sanitizeFilename(customFilename, fallbackExt)
      : file.name

    const altText = (formData.get('alt_text') as string) || finalName
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
        name: finalName,
        mimetype: file.type,
        size: file.size,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/media')
    revalidatePath('/admin')

    return { success: true, doc }
  } catch (err: any) {
    console.error('Error in uploadMediaAction:', err)
    return { success: false, error: err.message || 'Failed to upload media.' }
  }
}

export async function renameMediaAction(
  id: string | number,
  newFilename: string,
  newAltText?: string
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    const existing: any = await payload.findByID({
      collection: 'media',
      id,
      overrideAccess: true,
    })

    if (!existing) {
      return { success: false, error: 'Media asset not found.' }
    }

    const currentName: string = existing.filename || `plate-${id}`
    const fallbackExt = path.extname(currentName)
    const sanitizedName = sanitizeFilename(newFilename, fallbackExt)

    if (sanitizedName === currentName) {
      const updated = await payload.update({
        collection: 'media',
        id,
        data: {
          ...(newAltText !== undefined ? { alt_text: newAltText } : {}),
        },
        overrideAccess: true,
      })
      revalidatePath('/admin/collections/media')
      revalidatePath('/admin')
      return { success: true, doc: updated }
    }

    // Read existing file bytes (local media dir first, fallback to URL)
    let buffer: Buffer | null = null
    const localPath = path.resolve(process.cwd(), 'media', currentName)
    try {
      buffer = await fs.readFile(localPath)
    } catch {
      if (existing.url) {
        const res = await fetch(existing.url)
        if (res.ok) {
          buffer = Buffer.from(await res.arrayBuffer())
        }
      }
    }

    if (!buffer) {
      return { success: false, error: 'Could not read source file bytes to rename.' }
    }

    const updated = await payload.update({
      collection: 'media',
      id,
      data: {
        ...(newAltText !== undefined ? { alt_text: newAltText } : {}),
      },
      file: {
        data: buffer,
        name: sanitizedName,
        mimetype: existing.mimeType || 'application/octet-stream',
        size: buffer.length,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/media')
    revalidatePath('/admin')

    return { success: true, doc: updated }
  } catch (err: any) {
    console.error('Error in renameMediaAction:', err)
    return { success: false, error: err.message || 'Failed to rename media.' }
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
    revalidatePath('/admin')

    return { success: true }
  } catch (err: any) {
    console.error('Error in deleteMediaAction:', err)
    return { success: false, error: err.message || 'Failed to delete media.' }
  }
}
