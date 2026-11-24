import { getPayloadClient } from './payload';
import type { RelatedItem } from './content';
import type { Post, Project, Topic } from '@/payload-types';

type Item = Post | Project;

function topicSlug(topic: number | string | Topic) {
  return typeof topic === 'object' && topic ? topic.slug : '';
}

function toPost(post: Post): RelatedItem {
  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    url: `/writing/${post.slug}`,
    type: 'post',
    publishedAt: post.published_at ?? undefined,
    excerpt: post.excerpt ?? null,
    readingTime: post.reading_time ?? null,
    provenance: 'explicit',
  };
}

function toProject(project: Project): RelatedItem {
  return {
    id: String(project.id),
    title: project.title,
    slug: project.slug,
    url: `/projects/${project.slug}`,
    type: 'project',
    year: project.year ?? null,
    summary: project.summary ?? null,
    provenance: 'explicit',
  };
}

export async function getRelated(item: Item, limit = 3): Promise<RelatedItem[]> {
  const payload = await getPayloadClient();
  const result: RelatedItem[] = [];
  const seen = new Set<string>();
  const ownTopics = (item.topics ?? []).map(topicSlug).filter(Boolean);
  const ownId = String(item.id);
  const ownType = 'slug' in item && item.slug ? ('published_at' in item ? 'post' : 'project') : 'post';

  const add = (value: RelatedItem | null, provenance: RelatedItem['provenance']) => {
    if (!value || !value.slug) return;
    const key = `${value.type}:${value.id}`;
    if (seen.has(key) || (value.type === ownType && value.id === ownId)) return;
    seen.add(key);
    result.push({ ...value, provenance });
  };

  const explicitPosts = ('related_posts' in item ? item.related_posts : []) ?? [];
  const explicitProjects = ('related_projects' in item ? item.related_projects : []) ?? [];
  for (const post of explicitPosts) {
    if (typeof post === 'object') add(toPost(post), 'explicit');
  }
  for (const project of explicitProjects) {
    if (typeof project === 'object') add(toProject(project), 'explicit');
  }
  if (result.length >= limit) return result.slice(0, limit);

  if (ownType === 'post') {
    const reciprocal = await payload.find({
      collection: 'projects',
      where: { related_posts: { equals: Number(ownId) }, status: { not_equals: 'archived' } },
      limit,
      depth: 2,
      sort: '-year',
    });
    for (const project of reciprocal.docs) add(toProject(project), 'reciprocal');
  } else {
    const reciprocal = await payload.find({
      collection: 'posts',
      where: { related_projects: { equals: Number(ownId) }, status: { equals: 'published' } },
      limit,
      depth: 2,
      sort: '-published_at',
    });
    for (const post of reciprocal.docs) add(toPost(post), 'reciprocal');
  }
  if (result.length >= limit) return result.slice(0, limit);

  const [posts, projects] = await Promise.all([
    payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, limit: 100, depth: 2, sort: '-published_at' }),
    payload.find({ collection: 'projects', where: { status: { not_equals: 'archived' } }, limit: 100, depth: 2, sort: '-year' }),
  ]);
  const topicCandidates: Array<{ item: RelatedItem; topics: string[] }> = [
    ...posts.docs.map((post) => ({ item: toPost(post), topics: (post.topics ?? []).map(topicSlug).filter(Boolean) })),
    ...projects.docs.map((project) => ({ item: toProject(project), topics: (project.topics ?? []).map(topicSlug).filter(Boolean) })),
  ].sort((a, b) => {
    const overlapA = a.topics.filter((topic) => ownTopics.includes(topic)).length;
    const overlapB = b.topics.filter((topic) => ownTopics.includes(topic)).length;
    if (overlapB !== overlapA) return overlapB - overlapA;
    const dateA = a.item.publishedAt ?? String(a.item.year ?? '');
    const dateB = b.item.publishedAt ?? String(b.item.year ?? '');
    return dateB.localeCompare(dateA);
  });

  for (const candidate of topicCandidates) {
    const overlap = candidate.topics.filter((topic: string) => ownTopics.includes(topic));
    if (!overlap.length) continue;
    const topicName = overlap[0];
    add(candidate.item, `topic:${topicName}`);
    if (result.length >= limit) break;
  }
  return result.slice(0, limit);
}
