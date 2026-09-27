import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { JourneyEditor } from '@/components/admin/JourneyEditor'

export default async function JourneyCollectionPage() {
  const payload = await getPayload({ config: configPromise })

  let journey: any = null
  try {
    journey = await payload.findGlobal({ slug: 'journey', overrideAccess: true })
  } catch { /* not yet configured */ }

  const entries = journey?.entries || []

  return <JourneyEditor initialEntries={entries} />
}
