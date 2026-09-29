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
    cookies: {
      secure: process.env.NEXT_PUBLIC_SERVER_URL?.startsWith('https://'),
      sameSite: 'Lax',
    }
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Single-admin V1: creation and deletion are permanently disabled.
    create: () => false,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => (user ? { id: { equals: user.id } } : false),
    delete: () => false,
  },
  hooks: {
    beforeChange: [
      async ({ operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            overrideAccess: true,
          })
          if (totalDocs >= 1) {
            throw new Error('Single-owner policy: exactly one account is allowed. Additional accounts cannot be created.')
          }
        }
      },
    ],
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
