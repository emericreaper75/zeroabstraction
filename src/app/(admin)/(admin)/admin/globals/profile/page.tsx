import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProfileEditor } from '@/components/admin/ProfileEditor'

export default async function ProfilePage() {
  await requireUser();

  const payload = await getPayload({ config: configPromise })

  let profile: any = null
  try {
    profile = await payload.findGlobal({ slug: 'profile', overrideAccess: true })
  } catch { /* not configured yet */ }

  return <ProfileEditor profile={profile} />
}
