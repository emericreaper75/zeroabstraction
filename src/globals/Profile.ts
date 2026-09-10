import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'introduction',
      type: 'textarea',
    },
    {
      name: 'story',
      type: 'richText',
    },
    {
      name: 'current_focus',
      type: 'textarea',
    },
    {
      name: 'photograph',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'updated_at',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    }
  ],
}
