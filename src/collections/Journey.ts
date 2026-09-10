import type { CollectionConfig } from 'payload'

export const Journey: CollectionConfig = {
  slug: 'journey',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'date', 'category'],
  },
  defaultSort: 'order',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: {
        description: 'Order in the trajectory (e.g., 1 for Physics, 2 for ECE, 3 for Astrophysics)',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Physics', value: 'physics' },
        { label: 'ECE', value: 'ece' },
        { label: 'Astrophysics', value: 'astrophysics' },
      ],
      required: true,
    }
  ],
}
