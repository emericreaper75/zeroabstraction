'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface SiteSettingsPayload {
  name?: string
  short_bio?: string
  email?: string
  footer_text?: string
  theme_settings?: {
    default_mode?: 'light' | 'dark' | 'system'
  }
}

export async function updateSiteSettingsAction(data: SiteSettingsPayload) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        name: data.name?.trim() || 'ZeroAbstraction',
        short_bio: data.short_bio?.trim() || null,
        email: data.email?.trim() || null,
        footer_text: data.footer_text?.trim() || null,
        theme_settings: {
          default_mode: data.theme_settings?.default_mode || 'system',
        },
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/globals/site-settings')
    revalidatePath('/')

    return { success: true }
  } catch (err: any) {
    console.error('Error in updateSiteSettingsAction:', err)
    return { success: false, error: err.message || 'Failed to update site settings.' }
  }
}
