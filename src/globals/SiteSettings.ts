import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'ZeroAbstraction',
    },
    {
      name: 'short_bio',
      type: 'textarea',
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      name: 'social_links',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text' },
        { name: 'url', type: 'text' },
      ]
    },
    {
      name: 'footer_text',
      type: 'text',
    },
    {
      name: 'nav',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ]
    },
    {
      name: 'theme_settings',
      type: 'group',
      fields: [
        { name: 'default_mode', type: 'select', options: [{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }, { label: 'System', value: 'system' }] },
      ]
    }
  ],
}
