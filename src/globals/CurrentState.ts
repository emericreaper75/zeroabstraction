import type { GlobalConfig } from 'payload'

export const CurrentState: GlobalConfig = {
  slug: 'current-state',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'studying',
      type: 'text',
    },
    {
      name: 'building',
      type: 'text',
    },
    {
      name: 'reading',
      type: 'text',
    },
    {
      name: 'thinking_about',
      type: 'textarea',
    },
    {
      name: 'visibility',
      type: 'checkbox',
      defaultValue: true,
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
