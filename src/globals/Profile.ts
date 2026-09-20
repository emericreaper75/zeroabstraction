import type { GlobalConfig } from 'payload'
import { authenticated, publicRead } from '../access'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: publicRead,
    update: authenticated,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.updated_at = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    { name: 'introduction', type: 'textarea' },
    { name: 'story', type: 'richText' },
    { name: 'current_focus', type: 'textarea' },
    {
      name: 'photograph',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'updated_at',
      type: 'date',
      admin: { readOnly: true },
    },
  ],
}
