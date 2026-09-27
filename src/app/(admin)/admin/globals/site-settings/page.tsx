import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SiteSettingsEditor } from '@/components/admin/SiteSettingsEditor'

export default async function SiteSettingsPage() {
  const payload = await getPayload({ config: configPromise })

  let settings: any = null
  try {
    settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
  } catch { /* not configured yet */ }

  return <SiteSettingsEditor settings={settings} />
}
