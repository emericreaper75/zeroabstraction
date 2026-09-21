import { getPayloadClient } from './payload'
import type { Media, Post, Project, CurrentState, Profile, Topic, SiteSetting } from '@/payload-types'

export type { Post, Project, CurrentState, Profile, Topic, SiteSetting }

export type JourneyEntry = {
  id?: string | null
  order?: number | null
  title: string
  date?: string | null
  description?: string | null
  category?: 'physics' | 'ece' | 'astrophysics' | null
  milestone?: boolean | null
}

export type SearchableItem = {
  id: string
  title: string
  url: string
  slug?: string
  type: 'post' | 'project'
  date?: string
  excerpt?: string
  topics?: string[]
}

export type RelatedItem = {
  id: string
  title: string
  url: string
  slug?: string
  type: 'post' | 'project'
  date?: string
  label?: string
  publishedAt?: string
  year?: number | null
  readingTime?: number | null
  status?: string | null
  excerpt?: string | null
  summary?: string | null
}

export async function getPosts(limit = 10): Promise<{ docs: Post[] }> {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    limit,
    sort: '-published_at',
    depth: 2,
  })
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const { docs } = await getPosts(limit)
  return docs
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getProjects(limit = 10): Promise<{ docs: Project[] }> {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    limit,
    sort: '-year',
    depth: 2,
  })
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    where: { featured: { equals: true } },
    limit,
    depth: 2,
  })
  return result.docs
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getCurrentState(): Promise<CurrentState | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'current-state' })
}

export async function getProfile(): Promise<Profile | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'profile', depth: 1 })
}

export async function getSiteSettings(): Promise<SiteSetting | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
}

export async function getJourney(): Promise<JourneyEntry[]> {
  const payload = await getPayloadClient()
  const journey = await payload.findGlobal({ slug: 'journey' })
  const entries = journey.entries ?? []
  return [...entries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getAllSlugs(collection: 'posts' | 'projects'): Promise<{ slug: string }[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    limit: 1000,
    depth: 0,
    select: { slug: true },
  })
  return result.docs
    .map((doc) => ('slug' in doc && typeof doc.slug === 'string' ? { slug: doc.slug } : null))
    .filter((value): value is { slug: string } => value !== null)
}

function asRelatedPost(item: number | string | Post): RelatedItem | null {
  if (typeof item !== 'object' || !item?.slug) return null
  return {
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    url: `/writing/${item.slug}`,
    type: 'post',
    date: item.published_at ?? undefined,
    publishedAt: item.published_at ?? undefined,
    excerpt: item.excerpt ?? null,
    readingTime: (item as any).reading_time ?? null,
    status: (item as any)._status ?? null,
  }
}

function asRelatedProject(item: number | string | Project): RelatedItem | null {
  if (typeof item !== 'object' || !item?.slug) return null
  return {
    id: String(item.id),
    title: item.title,
    slug: item.slug,
    url: `/projects/${item.slug}`,
    type: 'project',
    year: (item as any).year ?? null,
    summary: item.summary ?? null,
  }
}

export async function getRelatedContentForPost(post: Post): Promise<RelatedItem[]> {
  const relatedPosts = (post.related_posts ?? []).map((item) => asRelatedPost(item as any))
  const relatedProjects = (post.related_projects ?? []).map((item) => asRelatedProject(item as any))
  return [...relatedPosts, ...relatedProjects].filter((item): item is RelatedItem => item !== null)
}

export async function getRelatedContentForProject(project: Project): Promise<RelatedItem[]> {
  return (project.related_posts ?? [])
    .map((item) => asRelatedPost(item as any))
    .filter((item): item is RelatedItem => item !== null)
}

export async function searchContent(query: string): Promise<SearchableItem[]> {
  const q = query.trim()
  if (!q) return []

  const payload = await getPayloadClient()
  const [posts, projects] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: {
        or: [{ title: { contains: q } }, { excerpt: { contains: q } }],
      },
      limit: 20,
      depth: 0,
    }),
    payload.find({
      collection: 'projects',
      where: {
        or: [{ title: { contains: q } }, { summary: { contains: q } }],
      },
      limit: 20,
      depth: 0,
    }),
  ])

  return [
    ...posts.docs.map((post) => ({
      id: String(post.id),
      title: post.title,
      slug: post.slug,
      url: `/writing/${post.slug}`,
      type: 'post' as const,
      date: post.published_at ?? undefined,
      excerpt: post.excerpt ?? undefined,
      topics: [] as string[],
    })),
    ...projects.docs.map((project) => ({
      id: String(project.id),
      title: project.title,
      slug: project.slug,
      url: `/projects/${project.slug}`,
      type: 'project' as const,
      excerpt: project.summary ?? undefined,
      topics: [] as string[],
    })),
  ]
}

export async function getSearchIndex(): Promise<SearchableItem[]> {
  try {
    const payload = await getPayloadClient()
    const [posts, projects] = await Promise.all([
      payload.find({ collection: 'posts', limit: 100, depth: 0 }),
      payload.find({ collection: 'projects', limit: 100, depth: 0 }),
    ])

    return [
      ...posts.docs.map((post) => ({
        id: String(post.id),
        title: post.title,
        slug: post.slug,
        url: `/writing/${post.slug}`,
        type: 'post' as const,
        date: post.published_at ?? undefined,
        excerpt: post.excerpt ?? undefined,
        topics: [] as string[],
      })),
      ...projects.docs.map((project) => ({
        id: String(project.id),
        title: project.title,
        slug: project.slug,
        url: `/projects/${project.slug}`,
        type: 'project' as const,
        excerpt: project.summary ?? undefined,
        topics: [] as string[],
      })),
    ]
  } catch (error) {
    console.error('getSearchIndex failed', error)
    return []
  }
}

export type { Media }
