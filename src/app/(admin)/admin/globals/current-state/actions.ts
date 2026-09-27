'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface CurrentStatePayload {
  studying?: string
  building?: string
  reading?: string
  thinking_about?: string
  visibility?: boolean
}

export async function updateCurrentStateAction(data: CurrentStatePayload) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.updateGlobal({
      slug: 'current-state',
      data: {
        studying: data.studying?.trim() || null,
        building: data.building?.trim() || null,
        reading: data.reading?.trim() || null,
        thinking_about: data.thinking_about?.trim() || null,
        visibility: data.visibility ?? true,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/globals/current-state')
    revalidatePath('/') // homepage uses current-state

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateCurrentStateAction:', err)
    return { success: false, error: err.message || 'Failed to update current state.' }
  }
}
