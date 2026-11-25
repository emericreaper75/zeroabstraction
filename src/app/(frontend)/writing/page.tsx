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
  const latestPost = result.docs[0];
  const totalMinutes = result.docs.reduce((sum, post) => sum + (post.reading_time ?? 1), 0);

  return (
    <div className="container-wide pb-20 pt-8 md:pt-12">
      <header className="relative mb-8 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]/70 architectural-grid p-6 sm:p-10">
        <span aria-hidden="true" className="absolute top-2 left-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>
        <span aria-hidden="true" className="absolute top-2 right-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>
        <span aria-hidden="true" className="absolute bottom-2 left-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>
        <span aria-hidden="true" className="absolute bottom-2 right-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-center">
          <div className="flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-2 font-mono text-[var(--text-label)] tracking-[var(--tracking-label)] text-[color:var(--accent-text)] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
              <span>MONOGRAPHS // ESSAYS &amp; FIELD NOTES</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-h1 leading-[1.05]" style={{ fontSize: 'var(--text-h1)', fontFamily: 'var(--font-display)' }}>
              Writing
            </h1>
            <p className="text-[color:var(--text-muted)] max-w-xl leading-relaxed">
              Long-form derivations, instrumentation logs, and technical notes across physics, DSP, and observational astronomy.
            </p>
            <div className="mt-2 flex items-center flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)]">
              <span className="px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[color:var(--text)]">
                {result.totalDocs} {result.totalDocs === 1 ? 'ESSAY' : 'ESSAYS'}
              </span>
              {activeTopic && (
                <span className="px-2.5 py-0.5 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)]">
                  FILTER: {activeTopic.name.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Right Editorial Ledger Summary */}
          <div className="rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--math-bg)]/90 p-5 flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border)] pb-2">
              <span>ARCHIVE LEDGER</span>
              <span className="text-[color:var(--accent-text)]">FORMAT: {view.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[10px] text-[color:var(--text-muted)] tracking-widest">READING TIME</span>
                <span className="text-[color:var(--text)] font-medium">{totalMinutes} MIN TOTAL</span>
              </div>
              <div>
                <span className="block text-[10px] text-[color:var(--text-muted)] tracking-widest">LATEST</span>
                <span className="text-[color:var(--text)] font-medium">
                  {latestPost?.published_at
                    ? new Date(latestPost.published_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
                    : '—'}
                </span>
              </div>
            </div>
            {latestPost && (
              <div className="pt-2 border-t border-[color:var(--border)] flex items-center justify-between gap-3">
                <span className="text-[11px] text-[color:var(--text-muted)] truncate">{latestPost.title}</span>
                <Link
                  href={`/writing/${latestPost.slug}`}
                  className="text-[11px] text-[color:var(--accent-text)] hover:underline shrink-0"
                  style={{ textDecoration: 'none' }}
                >
                  READ →
                </Link>
              </div>
            )}
          </div>
        </div>
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
