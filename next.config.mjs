import { withPayload } from '@payloadcms/next/withPayload'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

const remotePatterns = []

// Keep localhost/127.0.0.1 patterns only when NODE_ENV !== 'production'
if (process.env.NODE_ENV !== 'production') {
  remotePatterns.push(
    { protocol: 'http', hostname: 'localhost' },
    { protocol: 'https', hostname: 'localhost' },
    { protocol: 'http', hostname: '127.0.0.1' },
    { protocol: 'https', hostname: '127.0.0.1' }
  )
}

if (serverUrl) {
  try {
    const parsed = new URL(serverUrl)
    remotePatterns.push({
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: '/api/media/file/**',
    })
  } catch {
    // Ignore invalid URL format
  }
}

if (mediaUrl) {
  try {
    const parsed = new URL(mediaUrl)
    remotePatterns.push({
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: '/**',
    })
  } catch {
    // Ignore invalid URL format
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; connect-src 'self' https:; frame-ancestors 'self';",
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
