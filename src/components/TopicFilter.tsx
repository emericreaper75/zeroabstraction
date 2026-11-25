import Link from 'next/link';

export type TopicFilterTopic = { name: string; slug: string; type?: string | null; count: number };

export function TopicFilter({
  topics,
  activeSlug,
  basePath,
}: {
  topics: TopicFilterTopic[];
  activeSlug?: string;
  basePath: '/writing' | '/projects';
}) {
  const visible = topics.filter((topic) => topic.count > 0).sort((a, b) => {
    const typeCompare = (a.type ?? '').localeCompare(b.type ?? '');
    return typeCompare || a.name.localeCompare(b.name);
  });

  return (
    <nav className="w-full overflow-x-auto pb-1 scroll-smooth [scroll-snap-type:x_proximity]" aria-label="Filter by topic">
      <div className="flex min-h-11 items-center gap-2.5 whitespace-nowrap">
        <Link
          href={basePath}
          aria-current={!activeSlug ? 'page' : undefined}
          style={{ textDecoration: 'none' }}
          className={`min-h-[38px] px-3.5 rounded-full border inline-flex items-center gap-2 font-mono text-[var(--text-ui-sm)] tracking-wider transition-colors [scroll-snap-align:start] ${
            !activeSlug
              ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] border-[color:var(--accent-border)] font-medium'
              : 'bg-[color:var(--surface)] text-[color:var(--text-muted)] border-[color:var(--border)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--text)]'
          }`}
        >
          <span>ALL</span>
        </Link>
        {visible.map((topic) => {
          const isActive = activeSlug === topic.slug;
          return (
            <Link
              key={topic.slug}
              href={`${basePath}?topic=${encodeURIComponent(topic.slug)}`}
              aria-current={isActive ? 'page' : undefined}
              style={{ textDecoration: 'none' }}
              className={`min-h-[38px] px-3.5 rounded-full border inline-flex items-center gap-2 font-mono text-[var(--text-ui-sm)] tracking-wider transition-colors [scroll-snap-align:start] ${
                isActive
                  ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] border-[color:var(--accent-border)] font-medium'
                  : 'bg-[color:var(--surface)] text-[color:var(--text-muted)] border-[color:var(--border)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--text)]'
              }`}
            >
              <span>{topic.name.toUpperCase()}</span>
              <span className="text-[10px] opacity-70">{topic.count}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
