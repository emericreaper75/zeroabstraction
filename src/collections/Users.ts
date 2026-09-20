import type { CollectionAfterLoginHook, CollectionConfig } from 'payload'

const recordLastLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  await req.payload.update({
    collection: 'users',
    id: user.id,
    data: { last_login: new Date().toISOString() },
    overrideAccess: true,
    req,
  })
  return user
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 8,
    lockTime: 1000 * 60 * 10,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Single-admin V1: users are created only by the seed path (overrideAccess).
    create: () => false,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: () => false,
  },
  hooks: {
    afterLogin: [recordLastLogin],
  },
  fields: [
    {
      name: 'last_login',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
