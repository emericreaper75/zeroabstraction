import type { GlobalConfig } from 'payload'
import { authenticated, publicRead } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: publicRead,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'ZeroAbstraction',
    },
    { name: 'short_bio', type: 'textarea' },
    { name: 'email', type: 'email' },
    {
      name: 'social_links',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    { name: 'footer_text', type: 'text' },
    {
      name: 'nav',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'theme_settings',
      type: 'group',
      fields: [
        {
          name: 'default_mode',
          type: 'select',
          defaultValue: 'system',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ],
        },
      ],
    },
  ],
}
