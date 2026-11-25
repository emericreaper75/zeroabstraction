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

  const latestProject = result.docs[0] as Project | undefined;
  const activeDomainCount = topics.filter((t) => t.count > 0).length;

  return (
    <div className="container-wide pb-20 pt-8 md:pt-12">
      <header className="relative mb-8 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)] architectural-grid p-6 sm:p-10">
        <span aria-hidden="true" className="absolute top-2 left-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>
        <span aria-hidden="true" className="absolute top-2 right-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>
        <span aria-hidden="true" className="absolute bottom-2 left-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>
        <span aria-hidden="true" className="absolute bottom-2 right-2 font-mono text-[10px] leading-none text-[color:var(--text-muted)]/60 select-none">+</span>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 items-center">
          <div className="flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-2 font-mono text-[var(--text-label)] tracking-[var(--tracking-label)] text-[color:var(--accent-text)] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
              <span>ARCHIVE // SYSTEMS &amp; HARDWARE</span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-h1 leading-[1.05]" style={{ fontSize: 'var(--text-h1)', fontFamily: 'var(--font-display)' }}>
              Projects
            </h1>
            <p className="text-[color:var(--text-muted)] max-w-xl leading-relaxed">
              Selected cryogenic instrumentation, FPGA signal-processing architectures, and computational physics experiments.
            </p>
            <div className="mt-2 flex items-center flex-wrap gap-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)]">
              <span className="px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[color:var(--text)]">
                {result.totalDocs} {result.totalDocs === 1 ? 'SYSTEM' : 'SYSTEMS'}
              </span>
              {activeTopic && (
                <span className="px-2.5 py-0.5 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)]">
                  FILTER: {activeTopic.name.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Right Hero Telemetry Summary */}
          <div className="rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--math-bg)] p-5 flex flex-col gap-3 font-mono">
            <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[color:var(--text-muted)] border-b border-[color:var(--border)] pb-2">
              <span>INDEX TELEMETRY</span>
              <span className="text-[color:var(--accent-text)]">VIEW: {view.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-[10px] text-[color:var(--text-muted)] tracking-widest">DOMAINS</span>
                <span className="text-[color:var(--text)] font-medium">{activeDomainCount} ACTIVE</span>
              </div>
              <div>
                <span className="block text-[10px] text-[color:var(--text-muted)] tracking-widest">LATEST YEAR</span>
                <span className="text-[color:var(--text)] font-medium">{latestProject?.year ?? '—'}</span>
              </div>
            </div>
            {latestProject && (
              <div className="pt-2 border-t border-[color:var(--border)] flex items-center justify-between gap-3">
                <span className="text-[11px] text-[color:var(--text-muted)] truncate">{latestProject.title}</span>
                <Link
                  href={`/projects/${latestProject.slug}`}
                  className="text-[11px] text-[color:var(--accent-text)] hover:underline shrink-0"
                  style={{ textDecoration: 'none' }}
                >
                  OPEN →
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <TopicFilter topics={topics} activeSlug={params.topic} basePath="/projects" />
      <div className="mt-6 flex items-center justify-between border-b border-[color:var(--border)] pb-3">
        <div className="inline-flex items-center p-1 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]">
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
          <div className="border-t border-[color:var(--border)] overflow-x-auto">
            <div className="min-w-[640px]">
              {[...result.docs]
                .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.year ?? 0) - (a.year ?? 0))
                .map((project, idx) => {
                  const catalogId = `PRJ // ${String(idx + 1).padStart(3, '0')}`;
                  const domainTags = (project.technologies ?? [])
                    .slice(0, 3)
                    .map((t) => t.name?.toUpperCase())
                    .filter(Boolean)
                    .join(' · ');

                  return (
                    <article
                      key={project.id}
                      className="group grid grid-cols-[7.5rem_1fr_14rem_4.5rem_6.5rem] items-center gap-4 border-b border-[color:var(--border)] py-4 px-3 -mx-3 rounded-[var(--radius-s)] transition-colors hover:bg-[color:var(--surface)]/70"
                    >
                      <span className="font-mono text-[11px] tracking-wider text-[color:var(--text-muted)] whitespace-nowrap">
                        {catalogId}
                      </span>
                      <h2 className="font-[family-name:var(--font-display)] text-xl leading-snug text-[color:var(--text)] truncate">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group-hover:text-[color:var(--accent-text)] transition-colors"
                          style={{ textDecoration: 'none' }}
                        >
                          {project.title}
                        </Link>
                      </h2>
                      <span className="font-mono text-[11px] tracking-wider text-[color:var(--text-muted)] truncate">
                        {domainTags || project.status?.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="font-mono text-[11px] text-[color:var(--text-muted)]">
                        {project.year ?? '—'}
                      </span>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="font-mono text-[11px] tracking-wider text-[color:var(--accent-text)] inline-flex items-center justify-end gap-1 whitespace-nowrap"
                        style={{ textDecoration: 'none' }}
                      >
                        <span>INSPECT</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </article>
                  );
                })}
            </div>
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
