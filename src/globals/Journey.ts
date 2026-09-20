import type { GlobalConfig } from 'payload'
import { authenticated, publicRead } from '../access'

export const Journey: GlobalConfig = {
  slug: 'journey',
  access: {
    read: publicRead,
    update: authenticated,
  },
  fields: [
    {
      name: 'entries',
      type: 'array',
      labels: {
        singular: 'Entry',
        plural: 'Entries',
      },
      fields: [
        {
          name: 'order',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Physics', value: 'physics' },
            { label: 'ECE', value: 'ece' },
            { label: 'Astrophysics', value: 'astrophysics' },
          ],
        },
        {
          name: 'milestone',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}
