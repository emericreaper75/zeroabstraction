'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface JourneyEntry {
  id?: string
  order: number
  title: string
  date?: string | null
  description?: string | null
  category?: 'physics' | 'ece' | 'astrophysics' | null
  milestone?: boolean
}

export async function saveJourneyAction(entries: JourneyEntry[]) {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })

    if (!user) {
      return { success: false, error: 'Unauthorized: Admin session required.' }
    }

    const formattedEntries = entries.map((entry, idx) => ({
      order: typeof entry.order === 'number' ? entry.order : idx + 1,
      title: entry.title.trim(),
      date: entry.date ? new Date(entry.date).toISOString() : null,
      description: entry.description?.trim() || null,
      category: entry.category || null,
      milestone: Boolean(entry.milestone),
    }))

    await payload.updateGlobal({
      slug: 'journey',
      data: {
        entries: formattedEntries,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin/collections/journey')
    revalidatePath('/journey')

    return { success: true }
  } catch (err: any) {
    console.error('Error in saveJourneyAction:', err)
    return { success: false, error: err.message || 'Failed to save journey entries.' }
  }
}
