import type { MetadataRoute } from 'next'

// TODO: Update to allow crawling (e.g. allow: '/') before official public production launch.
// Currently disallows all crawling to prevent search indexing during pre-launch audit and testing.
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://zeroabstraction.com'

  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
