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
  provenance?: 'explicit' | 'reciprocal' | `topic:${string}`
  excerpt?: string | null
  summary?: string | null
}

export type ContentPage<T> = {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function getPosts(limit = 10, page = 1): Promise<ContentPage<Post>> {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    overrideAccess: false, // SECURITY: enforce access control — excludes draft/archived from public pages
    limit,
    page,
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
    overrideAccess: false, // SECURITY: enforce access control — returns null for drafts/archived on public routes
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getProjects(limit = 10, page = 1): Promise<ContentPage<Project>> {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    overrideAccess: false, // SECURITY: enforce access control — excludes archived from public pages
    limit,
    page,
    sort: '-year',
    depth: 2,
  })
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    overrideAccess: false, // SECURITY: enforce access control
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
    overrideAccess: false, // SECURITY: enforce access control — returns null for archived on public routes
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ?? null
}

export async function getCurrentState(): Promise<CurrentState | null> {
  const payload = await getPayloadClient()
  // Globals have their own read access config; overrideAccess: false defers to it
  return payload.findGlobal({ slug: 'current-state', overrideAccess: false })
}

export async function getProfile(): Promise<Profile | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'profile', overrideAccess: false, depth: 1 })
}

export async function getSiteSettings(): Promise<SiteSetting | null> {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', overrideAccess: false, depth: 1 })
}

export async function getJourney(): Promise<JourneyEntry[]> {
  const payload = await getPayloadClient()
  const journey = await payload.findGlobal({ slug: 'journey', overrideAccess: false })
  const entries = journey.entries ?? []
  return [...entries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function getAllSlugs(collection: 'posts' | 'projects'): Promise<{ slug: string }[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection,
      overrideAccess: false, // SECURITY: generateStaticParams only pre-renders publicly accessible slugs
      limit: 1000,
      depth: 0,
      select: { slug: true },
    })
    return result.docs
      .map((doc: any) => ('slug' in doc && typeof doc.slug === 'string' ? { slug: doc.slug } : null))
      .filter((value: any): value is { slug: string } => value !== null)
  } catch (error: any) {
    if (process.env.NEXT_BUILD === 'true' && (error?.message?.includes('ECONNREFUSED') || error?.message?.includes('connect to Postgres') || error?.code === 'ECONNREFUSED')) {
      console.warn(`[getAllSlugs] Database unreachable during build. Returning empty slugs for ${collection}. Pages will render dynamically on-demand.`)
      return []
    }
    throw error
  }
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
  const q = query.trim().toLowerCase()
  if (!q) return []

  const index = await getSearchIndex()
  return index
    .map((item) => {
      const title = item.title.toLowerCase()
      const excerpt = (item.excerpt ?? '').toLowerCase()
      const topics = (item.topics ?? []).map((t) => t.toLowerCase())

      let score = 0
      if (title === q) score += 100
      else if (title.startsWith(q)) score += 60
      else if (title.includes(q)) score += 40
      if (topics.some((t) => t.includes(q))) score += 25
      if (excerpt.includes(q)) score += 15

      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
}

function extractTopicNames(topics: unknown, technologies?: unknown): string[] {
  const names = new Set<string>()
  if (Array.isArray(topics)) {
    for (const t of topics) {
      if (typeof t === 'object' && t !== null && 'name' in t && (t as { name?: string }).name) {
        names.add(String((t as { name: string }).name))
      }
    }
  }
  if (Array.isArray(technologies)) {
    for (const tech of technologies) {
      if (typeof tech === 'object' && tech !== null && 'name' in tech && (tech as { name?: string }).name) {
        names.add(String((tech as { name: string }).name))
      }
    }
  }
  return Array.from(names)
}

export async function getSearchIndex(): Promise<SearchableItem[]> {
  try {
    const payload = await getPayloadClient()
    const [posts, projects] = await Promise.all([
      payload.find({ collection: 'posts', overrideAccess: false, limit: 100, depth: 1 }), // SECURITY
      payload.find({ collection: 'projects', overrideAccess: false, limit: 100, depth: 1 }), // SECURITY
    ])

    return [
      ...posts.docs.map((post: any) => ({
        id: String(post.id),
        title: post.title,
        slug: post.slug,
        url: `/writing/${post.slug}`,
        type: 'post' as const,
        date: post.published_at ?? undefined,
        excerpt: post.excerpt ?? undefined,
        topics: extractTopicNames(post.topics),
      })),
      ...projects.docs.map((project: any) => ({
        id: String(project.id),
        title: project.title,
        slug: project.slug,
        url: `/projects/${project.slug}`,
        type: 'project' as const,
        date: project.year ? String(project.year) : undefined,
        excerpt: project.summary ?? undefined,
        topics: extractTopicNames(project.topics, project.technologies),
      })),
    ]
  } catch (error) {
    console.error('getSearchIndex failed', error)
    return []
  }
}

export type { Media }
