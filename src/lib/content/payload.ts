import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getPayloadClient() {
  try {
    return await getPayload({ config: configPromise })
  } catch (err: any) {
    if (process.env.NEXT_BUILD === 'true' && (err?.payloadInitError || err?.message?.includes('ECONNREFUSED') || err?.message?.includes('connect to Postgres'))) {
      console.warn(`[getPayloadClient] Database unreachable during build. Returning mock Payload client.`)
      // Return a minimal mock that won't crash generateStaticParams or prerendering
      return {
        find: async () => ({ docs: [], totalDocs: 0, totalPages: 0, page: 1 }),
        findGlobal: async () => ({}),
        findByID: async () => null,
        create: async () => null,
        update: async () => null,
        delete: async () => null,
        auth: async () => ({ user: null }),
        login: async () => null,
        logout: async () => null,
      } as any
    }
    throw err
  }
}
