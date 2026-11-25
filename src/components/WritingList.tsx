import Link from 'next/link';
import type { Post } from '@/payload-types';

export function WritingList({ posts }: { posts: Post[] }) {
  if (!posts.length) return <p className="text-[color:var(--text-muted)]">Nothing published yet.</p>;
  return (
    <div className="border-t border-[color:var(--border)]">
      {posts.map((post) => {
        const date = post.published_at
          ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
          : '';
        const readingTime = post.reading_time ?? Math.max(1, Math.ceil((post.excerpt?.split(/\s+/).length ?? 1)));
        return (
          <article key={post.id} className="group grid grid-cols-1 items-baseline gap-4 border-b border-[color:var(--border)] py-5 px-3 -mx-3 rounded-[var(--radius-s)] transition-colors hover:bg-[color:var(--surface)]/60 md:grid-cols-[10rem_1fr_10rem]">
            <time className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)]" dateTime={post.published_at ?? undefined}>{date}</time>
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h3)]">
                <Link href={`/writing/${post.slug}`} className="group-hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>{post.title}</Link>
              </h2>
              {post.excerpt && <p className="mt-2 line-clamp-2 text-[var(--text-small)] text-[color:var(--text-muted)]">{post.excerpt}</p>}
            </div>
            <div className="flex items-center md:justify-end gap-3 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">
              <span>{readingTime} MIN READ</span>
              <span aria-hidden="true" className="text-[color:var(--accent-text)] transition-transform group-hover:translate-x-1">→</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
