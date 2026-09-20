'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/typography';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Debounce the search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/search');
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query, router]);

  return (
    <div className="w-full max-w-xl mb-12">
      <Label className="text-[color:var(--muted)] mb-2 block">SEARCH</Label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects and posts..."
        className="w-full bg-transparent border-b border-[color:var(--border)] py-4 text-xl md:text-2xl outline-none focus:border-[color:var(--accent)] transition-colors placeholder:text-[color:var(--muted)]"
        autoFocus
      />
    </div>
  );
}
