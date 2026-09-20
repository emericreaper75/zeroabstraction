import type { CollectionConfig } from 'payload'
import { authenticated, publicRead } from '../access'

export const Topics: CollectionConfig = {
  slug: 'topics',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
      index: true,
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
        { label: 'Books', value: 'books' },
        { label: 'Experiments', value: 'experiments' },
        { label: 'Other', value: 'other' },
      ],
    },
  ],
}
