import Link from 'next/link';
import { getPayloadClient } from '@/lib/payload';
import { WritingList } from '@/components/WritingList';
import { WritingShelf } from '@/components/WritingShelf';
import { TopicFilter } from '@/components/TopicFilter';

export default async function WritingArchive({ searchParams }: { searchParams: Promise<{ view?: string; topic?: string; page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const view = params.view === 'list' ? 'list' : 'shelf';
  const payload = await getPayloadClient();
  const topicResult = await payload.find({ collection: 'topics', limit: 100, depth: 0, sort: 'type,name' });
  const activeTopic = topicResult.docs.find((topic) => topic.slug === params.topic);
  const result = await payload.find({
    collection: 'posts',
    overrideAccess: false,
    limit: 48,
    page,
    depth: 2,
    sort: '-published_at',
    where: {
      and: [
        { status: { equals: 'published' } },
        ...(activeTopic ? [{ topics: { equals: activeTopic.id } }] : []),
      ],
    },
  });
  const topics = await Promise.all(topicResult.docs.map(async (topic) => {
    const count = await payload.count({
      collection: 'posts',
      where: { and: [{ status: { equals: 'published' } }, { topics: { equals: topic.id } }] },
    });
    return { name: topic.name, slug: topic.slug, type: topic.type, count: count.totalDocs };
  }));
  const viewQuery = params.topic ? `&topic=${encodeURIComponent(params.topic)}` : '';

  return (
    <div className="container-wide pb-20">
      <header className="py-16 md:py-20">
        <p className="font-mono text-[var(--text-label)] tracking-[var(--tracking-label)] text-[color:var(--accent-text)]">WRITING</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-h1" style={{ fontSize: 'var(--text-h1)', fontFamily: 'var(--font-display)' }}>Writing</h1>
        <p className="mt-4 text-[color:var(--text-muted)]">Essays and field notes.</p>
        <p className="mt-2 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">{result.totalDocs} ESSAYS</p>
      </header>
      <TopicFilter topics={topics} activeSlug={params.topic} basePath="/writing" />
      <div className="mt-6 flex items-center justify-between border-b border-[color:var(--border)] pb-3">
        <div className="inline-flex items-center p-1 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]/60">
          <Link
            href={`/writing?view=shelf${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ''}`}
            aria-current={view === 'shelf' ? 'page' : undefined}
            style={{ textDecoration: 'none' }}
            className={`min-h-[36px] px-3.5 rounded-[var(--radius-s)] inline-flex items-center font-mono text-[var(--text-ui-sm)] transition-colors ${view === 'shelf' ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'}`}
          >
            SHELF
          </Link>
          <Link
            href={`/writing?view=list${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ''}`}
            aria-current={view === 'list' ? 'page' : undefined}
            style={{ textDecoration: 'none' }}
            className={`min-h-[36px] px-3.5 rounded-[var(--radius-s)] inline-flex items-center font-mono text-[var(--text-ui-sm)] transition-colors ${view === 'list' ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'}`}
          >
            LIST
          </Link>
        </div>
      </div>
      <div className="mt-8">
        {view === 'shelf' ? <WritingShelf posts={result.docs} /> : <WritingList posts={result.docs} />}
      </div>
      {result.totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-between" aria-label="Writing pagination">
          {page > 1 ? <Link className="font-mono text-[var(--text-ui-sm)] text-[color:var(--accent-text)]" href={`/writing?page=${page - 1}&view=${view}${viewQuery}`}>NEWER WRITING</Link> : <span />}
          <span className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">PAGE {page} OF {result.totalPages}</span>
          {page < result.totalPages ? <Link className="font-mono text-[var(--text-ui-sm)] text-[color:var(--accent-text)]" href={`/writing?page=${page + 1}&view=${view}${viewQuery}`}>OLDER WRITING →</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
