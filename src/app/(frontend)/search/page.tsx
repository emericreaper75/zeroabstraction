import React from 'react';
import { searchContent } from '@/lib/content';
import { SearchInput } from './SearchInput';
import { Title, Body, Label } from '@/components/typography';
import { Link } from 'next-view-transitions';
import { Reveal } from '@/components/Reveal';

const SUGGESTED_QUERIES = ['astrophysics', 'fpga', 'quantum', 'physics', 'dsp'];

export default async function SearchPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q;
  const query = typeof q === 'string' ? q : '';
  const results = await searchContent(query);

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

        {query && results.length === 0 && (
          <div className="py-8">
            <Body className="text-[color:var(--text-muted)]">No results found for &quot;{query}&quot;.</Body>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col mt-8" style={{ gap: 'var(--space-6)' }}>
            <Label className="text-[color:var(--text-muted)] tracking-widest">
              {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'} FOR &ldquo;{query.toUpperCase()}&rdquo;
            </Label>
            {results.map((result, index) => {
              const isStaggered = index % 2 !== 0;
              return (
                <div
                  key={`${result.type}-${result.id}`}
                  className={`ui-border-t group p-4 -mx-4 transition-all duration-200 hover:bg-[color:var(--surface)]/60 rounded-sm ${
                    isStaggered ? 'md:translate-x-3' : ''
                  }`}
                  style={{ paddingTop: 'var(--space-4)' }}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] inline-block" />
                    <Label className="text-[color:var(--accent-text)] font-semibold uppercase">{result.type}</Label>
                    {result.date && (
                      <span className="font-mono text-[11px] text-[color:var(--text-muted)]">• {result.date}</span>
                    )}
                  </div>
                  <Title as="h3">
                    <Link 
                      href={result.url} 
                      className="no-underline hover:text-[color:var(--accent-text)] transition-colors group-hover:underline decoration-[color:var(--accent-border)] decoration-1 underline-offset-4" 
                    >
                      {result.title}
                    </Link>
                  </Title>
                  <Body className="text-[color:var(--text-muted)] mt-2">
                    {result.excerpt}
                  </Body>
                </div>
              );
            })}
          </div>
        )}
      </Reveal>
    </div>
  );
}
