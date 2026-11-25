'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/typography';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const urlType = searchParams.get('type') || 'all';
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Debounce the search while preserving active type filter
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = query.trim();
      const params = new URLSearchParams();
      if (trimmed) params.set('q', trimmed);
      if (urlType && urlType !== 'all') params.set('type', urlType);
      const qs = params.toString();
      router.replace(qs ? `/search?${qs}` : '/search');
    }, 300);

    return () => clearTimeout(handler);
  }, [query, urlType, router]);

  return (
    <div className="w-full max-w-2xl mb-10">
      <Label as="label" htmlFor="archive-search-input" className="text-[color:var(--text-muted)] mb-2 block tracking-widest">
        SEARCH ARCHIVE
      </Label>
      <div className="relative flex items-center border-b border-[color:var(--border)] focus-within:border-[color:var(--accent)] transition-colors">
        <input
          id="archive-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, essays, and topics..."
          className="w-full bg-transparent py-4 pr-16 text-xl md:text-2xl outline-none placeholder:text-[color:var(--text-muted)]"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search query"
            className="absolute right-0 px-2.5 py-1 rounded-[var(--radius-s)] border border-[color:var(--border)] font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] transition-colors"
          >
            CLEAR
          </button>
        )}
      </div>
    </div>
  );
}
