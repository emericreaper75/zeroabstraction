import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/writing',
        permanent: false,
      },
      {
        source: '/research',
        destination: '/writing',
        permanent: false,
      },
    ]
  },
}

export default withPayload(nextConfig)
