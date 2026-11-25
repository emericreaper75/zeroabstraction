import React from 'react';
import { searchContent } from '@/lib/content';
import { SearchInput } from './SearchInput';
import { Title, Body, Label } from '@/components/typography';
import { Link } from 'next-view-transitions';
import { Reveal } from '@/components/Reveal';

const SUGGESTED_QUERIES = ['astrophysics', 'fpga', 'cryogenics', 'quantum', 'physics'];

function highlightMatch(text: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, idx) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark
        key={idx}
        className="bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] rounded-[2px] px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default async function SearchPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q;
  const typeParam = typeof searchParams?.type === 'string' ? searchParams.type : 'all';
  const activeType = typeParam === 'post' || typeParam === 'project' ? typeParam : 'all';
  const query = typeof q === 'string' ? q : '';
  const allResults = await searchContent(query);
  const results = activeType === 'all' ? allResults : allResults.filter((r) => r.type === activeType);

  return (
    <div className="container-wide" style={{ paddingBlock: 'var(--space-10)', minHeight: '60vh' }}>
      <Reveal>
        <SearchInput />

        {!query && (
          <div className="flex flex-col gap-3 pb-8 border-b border-[color:var(--border)]">
            <Label className="text-[color:var(--text-muted)] tracking-widest">SUGGESTED TOPICS</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  style={{ textDecoration: 'none' }}
                  className="px-3.5 py-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/60 font-mono text-xs uppercase tracking-wider text-[color:var(--text-muted)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-text)] transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {query && (
          <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[color:var(--border)]">
            <Label className="text-[color:var(--text-muted)] tracking-widest">
              {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'} FOR &ldquo;{query.toUpperCase()}&rdquo;
            </Label>
            <div className="inline-flex items-center p-1 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]/60 font-mono text-[11px]">
              {(['all', 'post', 'project'] as const).map((tab) => {
                const isSelected = activeType === tab;
                const href = tab === 'all'
                  ? `/search?q=${encodeURIComponent(query)}`
                  : `/search?q=${encodeURIComponent(query)}&type=${tab}`;
                return (
                  <Link
                    key={tab}
                    href={href}
                    style={{ textDecoration: 'none' }}
                    className={`px-3 py-1 rounded-[var(--radius-s)] uppercase transition-colors ${
                      isSelected
                        ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium'
                        : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                    }`}
                  >
                    {tab === 'all' ? 'ALL' : tab === 'post' ? 'WRITING' : 'PROJECTS'}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="py-10 flex flex-col gap-3">
            <Body className="text-[color:var(--text-muted)]">No results found for &quot;{query}&quot;.</Body>
            {activeType !== 'all' && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="font-mono text-xs uppercase tracking-wider text-[color:var(--accent-text)] hover:underline"
              >
                VIEW ALL CONTENT TYPES →
              </Link>
            )}
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col mt-4">
            {results.map((result) => (
              <article
                key={`${result.type}-${result.id}`}
                className="group border-b border-[color:var(--border)] py-6 px-3 -mx-3 rounded-[var(--radius-s)] transition-colors hover:bg-[color:var(--surface)]/60"
              >
                <div className="flex items-center gap-2.5 mb-2 flex-wrap font-mono text-[11px] text-[color:var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] inline-block" aria-hidden="true" />
                  <span className="text-[color:var(--accent-text)] font-semibold uppercase tracking-wider">
                    {result.type === 'post' ? 'WRITING' : 'PROJECT'}
                  </span>
                  {result.date && <span>• {result.date}</span>}
                  {(result.topics ?? []).slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[10px] uppercase tracking-wider"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <Title as="h3">
                  <Link
                    href={result.url}
                    style={{ textDecoration: 'none' }}
                    className="group-hover:text-[color:var(--accent-text)] transition-colors"
                  >
                    {highlightMatch(result.title, query)}
                  </Link>
                </Title>
                {result.excerpt && (
                  <Body className="text-[color:var(--text-muted)] mt-2">
                    {highlightMatch(result.excerpt, query)}
                  </Body>
                )}
              </article>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
