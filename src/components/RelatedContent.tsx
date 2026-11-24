import Link from 'next/link';
import type { RelatedItem } from '@/lib/content';

export function RelatedContent({ items, className = '' }: { items: RelatedItem[]; className?: string }) {
  if (!items.length) return null;
  return (
    <section className={`container-reading ${className}`} style={{ marginTop: 'var(--space-7)', paddingBottom: 'var(--space-7)' }} aria-label="Related content">
      <h2 className="font-mono text-[var(--text-label)] tracking-[var(--tracking-label)] text-[color:var(--text-muted)]">RELATED</h2>
      <div className="mt-5 border-t border-[color:var(--border)]">
        {items.map((item) => {
          const date = item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()
            : null;
          const provenance = item.provenance?.startsWith('topic:')
            ? `SAME TOPIC · ${item.provenance.slice(6).toUpperCase()}`
            : null;
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.url}
              className="group grid grid-cols-[9rem_1fr_auto] items-center gap-6 border-b border-[color:var(--border)] py-6 max-md:grid-cols-1 max-md:gap-3"
            >
              <span className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">
                {item.type === 'post' ? `POST · ${date}` : `PROJECT · ${item.year ?? ''}`}
              </span>
              <span className="min-w-0">
                <span className="block font-[family-name:var(--font-display)] text-[var(--text-h3)] group-hover:underline">{item.title}</span>
                {(item.excerpt || item.summary) && (
                  <span className="mt-1 line-clamp-2 block text-[var(--text-small)] text-[color:var(--text-muted)]">{item.excerpt || item.summary}</span>
                )}
                {provenance && <span className="mt-2 block font-mono text-[var(--text-label)] text-[color:var(--accent-text)]">{provenance}</span>}
              </span>
              <span className="font-mono text-[var(--text-ui-sm)] text-[color:var(--text)] transition-transform group-hover:translate-x-1">
                {item.type === 'post' ? 'READ ARTICLE →' : 'VIEW PROJECT →'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
