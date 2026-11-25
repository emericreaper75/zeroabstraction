import Link from 'next/link';
import { getPayloadClient } from '@/lib/payload';
import { ProjectsLibrary } from '@/components/ProjectsLibrary';
import { TopicFilter } from '@/components/TopicFilter';
import type { Project } from '@/payload-types';

export default async function ProjectsArchive({ searchParams }: { searchParams: Promise<{ view?: string; topic?: string; page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const view = params.view === 'list' ? 'list' : 'library';
  const payload = await getPayloadClient();
  const topicResult = await payload.find({ collection: 'topics', limit: 100, depth: 0, sort: 'type,name' });
  const activeTopic = topicResult.docs.find((topic) => topic.slug === params.topic);
  const result = await payload.find({
    collection: 'projects',
    overrideAccess: false,
    limit: 12,
    page,
    depth: 2,
    sort: '-year',
    where: {
      and: [
        { status: { not_equals: 'archived' } },
        ...(activeTopic ? [{ topics: { equals: activeTopic.id } }] : []),
      ],
    },
  });
  const topics = await Promise.all(topicResult.docs.map(async (topic) => {
    const count = await payload.count({
      collection: 'projects',
      where: { and: [{ status: { not_equals: 'archived' } }, { topics: { equals: topic.id } }] },
    });
    return { name: topic.name, slug: topic.slug, type: topic.type, count: count.totalDocs };
  }));

  return (
    <div className="container-wide pb-20">
      <header className="py-16 md:py-20">
        <p className="font-mono text-[var(--text-label)] tracking-[var(--tracking-label)] text-[color:var(--accent-text)]">PROJECTS</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-h1" style={{ fontSize: 'var(--text-h1)', fontFamily: 'var(--font-display)' }}>Projects</h1>
        <p className="mt-4 text-[color:var(--text-muted)]">Selected systems and experiments.</p>
        <p className="mt-2 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">{result.totalDocs} PROJECTS</p>
      </header>
      <TopicFilter topics={topics} activeSlug={params.topic} basePath="/projects" />
      <div className="mt-6 flex items-center justify-between border-b border-[color:var(--border)] pb-3">
        <div className="inline-flex items-center p-1 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]/60">
          <Link
            href={`/projects?view=library${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ''}`}
            aria-current={view === 'library' ? 'page' : undefined}
            style={{ textDecoration: 'none' }}
            className={`min-h-[36px] px-3.5 rounded-[var(--radius-s)] inline-flex items-center font-mono text-[var(--text-ui-sm)] transition-colors ${view === 'library' ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'}`}
          >
            LIBRARY
          </Link>
          <Link
            href={`/projects?view=list${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ''}`}
            aria-current={view === 'list' ? 'page' : undefined}
            style={{ textDecoration: 'none' }}
            className={`min-h-[36px] px-3.5 rounded-[var(--radius-s)] inline-flex items-center font-mono text-[var(--text-ui-sm)] transition-colors ${view === 'list' ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'}`}
          >
            LIST
          </Link>
        </div>
      </div>
      <div className="mt-8">
        {result.docs.length === 0 ? (
          <p className="text-[color:var(--text-muted)]">{params.topic ? 'No projects match this topic.' : 'No projects published yet.'}</p>
        ) : view === 'library' ? (
          <ProjectsLibrary projects={result.docs as Project[]} />
        ) : (
          <div className="border-t border-[color:var(--border)]">
            {[...result.docs].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.year ?? 0) - (a.year ?? 0)).map((project) => (
              <article key={project.id} className="group grid grid-cols-1 gap-4 border-b border-[color:var(--border)] py-5 px-3 -mx-3 rounded-[var(--radius-s)] transition-colors hover:bg-[color:var(--surface)]/60 md:grid-cols-[9rem_1fr_13rem]">
                <p className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">{project.year ?? ''} · {project.status?.replace('_', ' ').toUpperCase()}</p>
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h3)]"><Link href={`/projects/${project.slug}`} className="group-hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>{project.title}</Link></h2>
                  {project.summary && <p className="mt-2 text-[var(--text-small)] text-[color:var(--text-muted)]">{project.summary}</p>}
                </div>
                <div className="flex flex-col md:items-end justify-between gap-2">
                  <p className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)] md:text-right">{project.technologies?.slice(0, 3).map((technology) => technology.name).join(' / ')}</p>
                  <Link href={`/projects/${project.slug}`} className="font-mono text-[11px] text-[color:var(--accent-text)] inline-flex items-center gap-1" style={{ textDecoration: 'none' }}>
                    <span>OPEN</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {result.totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-between" aria-label="Projects pagination">
          {page > 1 ? <Link className="font-mono text-[var(--text-ui-sm)] text-[color:var(--accent-text)]" href={`/projects?page=${page - 1}&view=${view}${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ''}`}>NEWER PROJECTS</Link> : <span />}
          <span className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">PAGE {page} OF {result.totalPages}</span>
          {page < result.totalPages ? <Link className="font-mono text-[var(--text-ui-sm)] text-[color:var(--accent-text)]" href={`/projects?page=${page + 1}&view=${view}${params.topic ? `&topic=${encodeURIComponent(params.topic)}` : ''}`}>OLDER PROJECTS →</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
