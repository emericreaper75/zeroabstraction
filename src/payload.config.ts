import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Topics } from './collections/Topics'
import { CurrentState } from './globals/CurrentState'
import { Profile } from './globals/Profile'
import { Journey } from './globals/Journey'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const s3Enabled = process.env.S3_ENABLED === 'true'

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || '',
  // Payload's built-in admin UI is unused. Custom admin lives in a later
  // route group and talks to Payload as a headless API.
  routes: {
    admin: '/payload-admin-disabled',
    api: '/api',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'importMap.js'),
    },
  },
  collections: [Users, Media, Posts, Projects, Topics],
  globals: [CurrentState, Profile, Journey, SiteSettings],
  editor: lexicalEditor(),
  cors: [serverURL],
  csrf: [serverURL],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: s3Enabled
    ? [
        s3Storage({
          collections: {
            media: true,
          },
          bucket: process.env.S3_BUCKET || '',
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
            region: process.env.S3_REGION || 'auto',
            endpoint: process.env.S3_ENDPOINT || '',
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
          },
        }),
      ]
    : [],
  async onInit(payload) {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    if (!email || !password) {
      payload.logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; skipping admin seed')
      return
    }

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) return

    const { totalDocs } = await payload.count({
      collection: 'users',
      overrideAccess: true,
    })

    if (totalDocs > 0) {
      payload.logger.info('An admin user already exists; skipping seed')
      return
    }

    await payload.create({
      collection: 'users',
      data: { email, password },
      overrideAccess: true,
    })
    payload.logger.info(`Seeded single admin user ${email}`)
  },
})
