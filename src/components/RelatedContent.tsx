import React from 'react';
import { Link } from 'next-view-transitions';
import { Title, Label, Body } from '@/components/typography';
import { EditorialLink } from '@/components/EditorialLink';
import type { RelatedItem } from '@/lib/content';

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
  className?: string;
}

export function RelatedContent({
  items,
  title = 'RELATED CONTENT',
  className = '',
}: RelatedContentProps) {
  if (!items || items.length === 0) return null;

  // Group items by their contextual label (e.g. "More on Astrophysics", "Connected Project")
  const grouped = items.reduce<Record<string, RelatedItem[]>>((acc, item) => {
    const key = item.label || 'Related';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const groupEntries = Object.entries(grouped);

  return (
    <section
      className={`container-reading ${className}`}
      aria-label="Related Content"
      style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)' }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <Label className="text-[color:var(--muted)] tracking-widest text-xs font-mono uppercase">
          {title}
        </Label>
      </div>

      {/* Editorial Grouped Content */}
      <div className="flex flex-col" style={{ gap: 'var(--space-10)' }}>
        {groupEntries.map(([groupLabel, groupItems], groupIdx) => (
          <div key={groupLabel}>
            {groupIdx > 0 && (
              <div
                className="ui-border-t"
                style={{ marginBottom: 'var(--space-8)', opacity: 0.6 }}
              />
            )}

            {/* Topic / Context Sub-heading */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <Label className="text-[color:var(--accent)] text-xs font-mono tracking-wider uppercase">
                {groupLabel}
              </Label>
            </div>

            {/* List of related editorial items */}
            <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              {groupItems.map((item, itemIdx) => {
                const itemHref =
                  item.type === 'post' ? `/writing/${item.slug}` : `/projects/${item.slug}`;

                const dateStr = item.publishedAt
                  ? new Date(item.publishedAt)
                      .toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      .toUpperCase()
                  : null;

                return (
                  <div key={`${item.type}-${item.id}`}>
                    {itemIdx > 0 && (
                      <div
                        className="ui-border-t"
                        style={{ marginBottom: 'var(--space-8)', opacity: 0.3 }}
                      />
                    )}

                    <article className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
                      {/* Metadata Line */}
                      <div
                        className="flex items-center flex-wrap"
                        style={{ gap: 'var(--space-3)' }}
                      >
                        <Label className="text-[color:var(--muted)] text-xs font-mono uppercase">
                          {item.type === 'post' ? 'Writing' : 'Project'}
                        </Label>
                        {item.year && (
                          <>
                            <span className="text-[color:var(--muted)]">•</span>
                            <Label className="text-[color:var(--muted)] text-xs font-mono">
                              {item.year}
                            </Label>
                          </>
                        )}
                        {dateStr && (
                          <>
                            <span className="text-[color:var(--muted)]">•</span>
                            <Label className="text-[color:var(--muted)] text-xs font-mono">
                              {dateStr}
                            </Label>
                          </>
                        )}
                        {item.readingTime && (
                          <>
                            <span className="text-[color:var(--muted)]">•</span>
                            <Label className="text-[color:var(--muted)] text-xs font-mono">
                              {item.readingTime} MIN READ
                            </Label>
                          </>
                        )}
                        {item.status && (
                          <>
                            <span className="text-[color:var(--muted)]">•</span>
                            <Label className="text-[color:var(--muted)] text-xs font-mono uppercase">
                              {item.status.replace('_', ' ')}
                            </Label>
                          </>
                        )}
                      </div>

                      {/* Linked Title */}
                      <Title as="h3" style={{ fontSize: 'var(--text-title)' }}>
                        <Link
                          href={itemHref}
                          className="transition-colors duration-200 hover:text-[color:var(--accent)]"
                        >
                          {item.title}
                        </Link>
                      </Title>

                      {/* Snippet / Excerpt */}
                      {(item.excerpt || item.summary) && (
                        <Body
                          className="text-[color:var(--muted)] line-clamp-2"
                          style={{ fontSize: '0.9375rem', lineHeight: '1.6' }}
                        >
                          {item.excerpt || item.summary}
                        </Body>
                      )}

                      {/* Minimal Editorial Link */}
                      <div style={{ marginTop: 'var(--space-2)' }}>
                        <EditorialLink href={itemHref} variant="muted">
                          {item.type === 'post' ? 'READ ESSAY' : 'VIEW PROJECT'}
                        </EditorialLink>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
