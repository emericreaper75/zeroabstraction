import Link from 'next/link';
import type { Post } from '@/payload-types';

export function WritingList({ posts }: { posts: Post[] }) {
  if (!posts.length) return <p className="text-[color:var(--text-muted)]">Nothing published yet.</p>;

  return (
    <div className="border-t border-[color:var(--border)] overflow-x-auto">
      <div className="min-w-[640px]">
        {posts.map((post, idx) => {
          const indexId = `ESS // ${String(idx + 1).padStart(3, '0')}`;
          const date = post.published_at
            ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
            : 'UNDATED';
          const readingTime = post.reading_time ?? Math.max(1, Math.ceil((post.excerpt?.split(/\s+/).length ?? 1) / 200));
          const primaryTopic = (post.topics ?? [])
            .map((t) => (typeof t === 'object' && t !== null && 'name' in t ? String(t.name).toUpperCase() : ''))
            .find(Boolean);

          return (
            <article
              key={post.id}
              className="group grid grid-cols-[9.5rem_1fr_9rem_5.5rem_5.5rem] items-center gap-4 border-b border-[color:var(--border)] py-4 px-3 -mx-3 rounded-[var(--radius-s)] transition-colors hover:bg-[color:var(--surface)]/70"
            >
              <div className="flex flex-col gap-0.5 font-mono text-[11px] text-[color:var(--text-muted)]">
                <span>{indexId}</span>
                <time dateTime={post.published_at ?? undefined} className="text-[10px] opacity-80">{date}</time>
              </div>

              <div className="min-w-0">
                <h2 className="font-[family-name:var(--font-display)] text-xl leading-snug text-[color:var(--text)] truncate">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group-hover:text-[color:var(--accent-text)] transition-colors"
                    style={{ textDecoration: 'none' }}
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="mt-1 line-clamp-1 text-xs text-[color:var(--text-muted)]">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div>
                {primaryTopic && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] font-mono text-[10px] tracking-wider text-[color:var(--accent-text)] truncate max-w-full">
                    {primaryTopic}
                  </span>
                )}
              </div>

              <span className="font-mono text-[11px] text-[color:var(--text-muted)] whitespace-nowrap">
                {readingTime} MIN
              </span>

              <Link
                href={`/writing/${post.slug}`}
                className="font-mono text-[11px] tracking-wider text-[color:var(--accent-text)] inline-flex items-center justify-end gap-1 whitespace-nowrap"
                style={{ textDecoration: 'none' }}
              >
                <span>READ</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
