import type { CollectionConfig } from 'payload'

export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Astrophysics', value: 'astrophysics' },
        { label: 'Physics', value: 'physics' },
        { label: 'ECE', value: 'ece' },
        { label: 'Programming', value: 'programming' },
        { label: 'Photography', value: 'photography' },
        { label: 'Other', value: 'other' },
      ],
    }
  ],
}
