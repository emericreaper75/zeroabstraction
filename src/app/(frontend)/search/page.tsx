import React from 'react';
import { searchContent } from '@/lib/content';
import { SearchInput } from './SearchInput';
import { Title, Body, Label } from '@/components/typography';
import { Link } from 'next-view-transitions';
import { Reveal } from '@/components/Reveal';

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
        
        {query && results.length === 0 && (
          <div className="py-8">
            <Body className="text-[color:var(--muted)]">No results found for &quot;{query}&quot;.</Body>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
            {results.map((result) => (
              <div key={`${result.type}-${result.id}`} className="ui-border-t" style={{ paddingTop: 'var(--space-4)' }}>
                <Label className="text-[color:var(--muted)] mb-2 inline-block uppercase">{result.type}</Label>
                <Title as="h3">
                  <Link 
                    href={result.url} 
                    className="hover:text-[color:var(--accent)] transition-colors" 
                    style={{ textDecoration: 'none' }}
                  >
                    {result.title}
                  </Link>
                </Title>
                <Body className="text-[color:var(--muted)] mt-2">
                  {result.excerpt}
                </Body>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
