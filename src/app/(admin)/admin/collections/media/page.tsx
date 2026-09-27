import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MediaManager } from '@/components/admin/MediaManager'

export default async function MediaCollectionPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'media',
    limit: 50,
    sort: '-createdAt',
    overrideAccess: true,
  })

  return <MediaManager initialDocs={result.docs as any} totalDocs={result.totalDocs} />
}
