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
    <nav className="w-full overflow-x-auto" aria-label="Filter by topic">
      <div className="flex min-h-11 items-center gap-6 whitespace-nowrap">
        <Link
          href={basePath}
          className={`min-h-11 inline-flex items-center font-mono text-[var(--text-ui-sm)] ${!activeSlug ? 'text-[color:var(--accent-text)] underline underline-offset-4' : 'text-[color:var(--text-muted)]'}`}
        >
          ALL
        </Link>
        {visible.map((topic) => (
          <Link
            key={topic.slug}
            href={`${basePath}?topic=${encodeURIComponent(topic.slug)}`}
            className={`min-h-11 inline-flex items-center font-mono text-[var(--text-ui-sm)] ${activeSlug === topic.slug ? 'text-[color:var(--accent-text)] underline underline-offset-4' : 'text-[color:var(--text-muted)]'}`}
          >
            {topic.name.toUpperCase()} {topic.count}
          </Link>
        ))}
      </div>
    </nav>
  );
}
