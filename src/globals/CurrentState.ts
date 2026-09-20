import type { GlobalConfig } from 'payload'
import { authenticated, publicRead } from '../access'

export const CurrentState: GlobalConfig = {
  slug: 'current-state',
  access: {
    read: publicRead,
    update: authenticated,
  },

  fields: [
    { name: 'studying', type: 'text' },
    { name: 'building', type: 'text' },
    { name: 'reading', type: 'text' },
    { name: 'thinking_about', type: 'textarea' },
    {
      name: 'visibility',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
