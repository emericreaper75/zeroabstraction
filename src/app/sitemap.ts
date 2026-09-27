import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://zeroabstraction.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const { docs: posts } = await getPosts(100)
    postRoutes = posts
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: `${baseUrl}/writing/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
  } catch (err) {
    console.error('Error generating sitemap posts:', err)
  }

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const { docs: projects } = await getProjects(100)
    projectRoutes = projects
      .filter((project) => Boolean(project.slug))
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
  } catch (err) {
    console.error('Error generating sitemap projects:', err)
  }

  return [...staticRoutes, ...postRoutes, ...projectRoutes]
}
