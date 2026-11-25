'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { Title, Label, Body } from '@/components/typography';
import type { SearchableItem } from '@/lib/content';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_STORAGE_KEY = 'za_recent_searches';
const SUGGESTED_TERMS = ['astrophysics', 'fpga', 'quantum', 'physics'];
const QUICK_ROUTES = [
  { label: 'Projects', url: '/projects' },
  { label: 'Writing', url: '/writing' },
  { label: 'About', url: '/about' },
];

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

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'post' | 'project'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [items, setItems] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const saveRecentQuery = (q: string) => {
    const clean = q.trim();
    if (clean.length < 2) return;
    try {
      const next = [clean, ...recentQueries.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 4);
      setRecentQueries(next);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(RECENT_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setRecentQueries(parsed.slice(0, 4));
        }
      } catch {}

      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setTypeFilter('all');
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'input, button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || items.length > 0 || isLoading) return;

    let cancelled = false;
    setIsLoading(true);
    fetch('/api/search-index')
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SearchableItem[]) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, items.length, isLoading]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return items
      .map((item) => {
        if (typeFilter !== 'all' && item.type !== typeFilter) return { item, score: 0 };
        const title = item.title.toLowerCase();
        const excerpt = (item.excerpt ?? '').toLowerCase();
        const topics = (item.topics ?? []).map((topic) => topic.toLowerCase());

        let score = 0;
        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 60;
        else if (title.includes(q)) score += 40;
        if (topics.some((topic) => topic.includes(q))) score += 25;
        if (excerpt.includes(q)) score += 15;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [query, items, typeFilter]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, typeFilter]);

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter' && filteredResults[activeIndex]) {
      e.preventDefault();
      saveRecentQuery(query);
      onClose();
      router.push(filteredResults[activeIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 sm:px-6 pt-20 md:pt-28 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search content"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-[color:var(--surface)] border border-[color:var(--border-strong)] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        {/* Minimalist Search Input Bar (no inner outline box) */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[color:var(--border)]">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[color:var(--text-muted)] flex-shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search projects, essays, or topics..."
            className="w-full bg-transparent text-base text-[color:var(--text)] placeholder:text-[color:var(--text-muted)]/75 outline-none focus:outline-none focus-visible:outline-none font-sans"
            aria-label="Search query"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-[11px] font-mono text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors px-1.5 py-0.5"
              aria-label="Clear search input"
            >
              CLEAR
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-mono text-[color:var(--text-muted)] hover:text-[color:var(--text)] border border-[color:var(--border)] px-1.5 py-0.5 rounded transition-colors"
            aria-label="Close search modal"
          >
            ESC
          </button>
        </div>

        {/* Results / Empty State */}
        <div className="overflow-y-auto px-5 py-4 flex flex-col">
          {!query.trim() && (
            <div className="flex flex-col gap-5 py-1">
              {recentQueries.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-muted)] mr-1">
                    RECENT
                  </span>
                  {recentQueries.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded-full border border-[color:var(--border)] font-mono text-[11px] text-[color:var(--text)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-text)] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center flex-wrap gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-muted)] mr-1">
                  TOPICS
                </span>
                {SUGGESTED_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/60 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-text)] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[color:var(--border)]">
                <div className="flex items-center gap-4">
                  {QUICK_ROUTES.map((route) => (
                    <Link
                      key={route.url}
                      href={route.url}
                      onClick={onClose}
                      style={{ textDecoration: 'none' }}
                      className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors"
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/search"
                  onClick={onClose}
                  style={{ textDecoration: 'none' }}
                  className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent-text)] hover:underline"
                >
                  SEARCH PAGE →
                </Link>
              </div>
            </div>
          )}

          {query.trim() && isLoading && (
            <div className="py-8 text-center">
              <Body className="text-sm text-[color:var(--text-muted)]">Searching…</Body>
            </div>
          )}

          {query.trim() && !isLoading && filteredResults.length === 0 && (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <Body className="text-sm text-[color:var(--text-muted)]">
                No matches for &ldquo;{query.trim()}&rdquo;.
              </Body>
              {typeFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent-text)] hover:underline"
                >
                  RESET FILTER
                </button>
              )}
            </div>
          )}

          {query.trim() && filteredResults.length > 0 && (
            <div className="flex flex-col">
              <div className="mb-2 pb-2 border-b border-[color:var(--border)] flex items-center justify-between gap-2">
                <Label className="text-[color:var(--text-muted)] text-[11px] font-mono uppercase" aria-live="polite">
                  {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
                </Label>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  {(['all', 'post', 'project'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTypeFilter(tab)}
                      className={`px-2 py-0.5 rounded uppercase transition-colors ${
                        typeFilter === tab
                          ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-text)] font-medium'
                          : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                      }`}
                    >
                      {tab === 'all' ? 'ALL' : tab === 'post' ? 'WRITING' : 'PROJECTS'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                {filteredResults.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <article
                      key={`${item.type}-${item.id}`}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`group py-3 px-2.5 -mx-2.5 rounded-lg transition-colors ${
                        isActive ? 'bg-[color:var(--surface-hover)]' : 'hover:bg-[color:var(--bg-subtle)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[color:var(--text-muted)] mb-0.5">
                        <span className="uppercase text-[color:var(--accent-text)] font-medium tracking-wider">
                          {item.type === 'post' ? 'WRITING' : 'PROJECT'}
                        </span>
                        {item.date && <span>· {item.date}</span>}
                        {(item.topics ?? []).length > 0 && (
                          <span className="truncate">· {(item.topics ?? []).slice(0, 2).join(', ').toUpperCase()}</span>
                        )}
                      </div>

                      <Title
                        as="h4"
                        style={{
                          fontSize: '1.15rem',
                          lineHeight: '1.35',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 500,
                          margin: '0',
                        }}
                      >
                        <Link
                          href={item.url}
                          onClick={() => {
                            saveRecentQuery(query);
                            onClose();
                          }}
                          className="text-[color:var(--text)] group-hover:text-[color:var(--accent-text)] transition-colors block"
                          style={{ textDecoration: 'none' }}
                        >
                          {highlightMatch(item.title, query)}
                        </Link>
                      </Title>

                      {item.excerpt && (
                        <p className="text-xs text-[color:var(--text-muted)] line-clamp-1 mt-0.5">
                          {highlightMatch(item.excerpt, query)}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Footer (only shown when typing a query) */}
        {query.trim() && (
          <div className="px-5 py-2 border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)] flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-[color:var(--text-muted)]">
            <span className="hidden sm:inline">↑↓ · ↵ · ESC</span>
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => {
                saveRecentQuery(query);
                onClose();
              }}
              className="text-[color:var(--accent-text)] hover:underline ml-auto"
              style={{ textDecoration: 'none' }}
            >
              VIEW ALL RESULTS →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
