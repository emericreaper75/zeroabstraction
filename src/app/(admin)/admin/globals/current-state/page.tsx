import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CurrentStateEditor } from '@/components/admin/CurrentStateEditor'

export default async function CurrentStatePage() {
  const payload = await getPayload({ config: configPromise })

  let currentState: any = null
  try {
    currentState = await payload.findGlobal({ slug: 'current-state', overrideAccess: true })
  } catch { /* not configured yet */ }

  return <CurrentStateEditor currentState={currentState} />
}
