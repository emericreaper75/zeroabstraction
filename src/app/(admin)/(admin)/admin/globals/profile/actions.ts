'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface ProfilePayload {
  introduction?: string
  current_focus?: string
}

export async function updateProfileAction(data: ProfilePayload) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.updateGlobal({
      slug: 'profile',
      data: {
        introduction: data.introduction?.trim() || null,
        current_focus: data.current_focus?.trim() || null,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/globals/profile')
    revalidatePath('/about')

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateProfileAction:', err)
    return { success: false, error: err.message || 'Failed to update profile.' }
  }
}
