import type { GlobalConfig } from 'payload'
import { authenticated, publicRead } from '../access'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: publicRead,
    update: authenticated,
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
  ],
}
