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

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'post' | 'project'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Auto-focus input, store previous active element, and manage focus return
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle Escape key and Tab focus trap
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

  // Client-side filtering across title, excerpt, and topics
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return items.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      const inTitle = item.title.toLowerCase().includes(q);
      const inExcerpt = (item.excerpt ?? '').toLowerCase().includes(q);
      const inTopics = (item.topics ?? []).some((topic: string) => topic.toLowerCase().includes(q));
      return inTitle || inExcerpt || inTopics;
    });
  }, [query, items, typeFilter]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, typeFilter]);

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
      onClose();
      router.push(filteredResults[activeIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 sm:px-6 pt-16 md:pt-24 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search content"
      onClick={(e) => {
        // Close on clicking backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[color:var(--bg)] border border-[color:var(--border)] shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[color:var(--border)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
            placeholder="Search writing, projects, and topics..."
            className="w-full bg-transparent text-lg md:text-xl text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none font-sans"
            aria-label="Search query"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors p-1"
              aria-label="Clear search input"
            >
              CLEAR
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-[color:var(--text-muted)] hover:text-[color:var(--text)] border border-[color:var(--border)] px-2 py-1 rounded transition-colors"
            aria-label="Close search modal"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto px-6 py-6 flex flex-col">
          {!query.trim() && (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <Label className="text-[color:var(--text-muted)] font-mono text-xs uppercase tracking-wider">
                Type to search across titles, summaries, or topics
              </Label>
              <span className="text-xs text-[color:var(--text-muted)] opacity-70">
                E.g. &ldquo;astrophysics&rdquo;, &ldquo;quantum&rdquo;, &ldquo;physics&rdquo;
              </span>
            </div>
          )}

          {query.trim() && isLoading && (
            <div className="py-8 text-center">
              <Body className="text-[color:var(--text-muted)]">Loading searchable content…</Body>
            </div>
          )}

          {query.trim() && !isLoading && filteredResults.length === 0 && (
            <div className="py-8 text-center">
              <Body className="text-[color:var(--text-muted)]">
                No matching content found for &ldquo;{query.trim()}&rdquo;.
              </Body>
            </div>
          )}

          {query.trim() && filteredResults.length > 0 && (
            <div className="flex flex-col">
              <div className="mb-4 pb-2 border-b border-[color:var(--border)] flex items-center justify-between gap-2 flex-wrap">
                <Label className="text-[color:var(--text-muted)] text-xs font-mono uppercase">
                  {filteredResults.length} {filteredResults.length === 1 ? 'Result' : 'Results'}
                </Label>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {(['all', 'post', 'project'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTypeFilter(tab)}
                      className={`px-2 py-0.5 rounded-[var(--radius-s)] uppercase transition-colors ${
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
                  const href = item.url;
                  const isActive = idx === activeIndex;

                  return (
                    <article
                      key={`${item.type}-${item.id}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`group py-4 px-3 -mx-3 rounded transition-colors ${
                        isActive ? 'bg-[color:var(--surface-hover)]' : 'hover:bg-[color:var(--border)]/30'
                      } ${idx > 0 ? 'border-t border-[color:var(--border)]' : ''}`}
                    >
                      {/* Meta line */}
                      <div className="flex items-center gap-2.5 text-xs font-mono text-[color:var(--text-muted)] mb-1 flex-wrap">
                        <span className="uppercase text-[color:var(--accent-text)] font-medium tracking-wider">
                          {item.type === 'post' ? 'Writing' : 'Project'}
                        </span>
                        {item.date && <span>• {item.date}</span>}
                        {(item.topics ?? []).length > 0 && (
                          <span>• {(item.topics ?? []).join(', ').toUpperCase()}</span>
                        )}
                      </div>

                      {/* Title */}
                      <Title
                        as="h4"
                        style={{
                          fontSize: '1.35rem',
                          lineHeight: '1.35',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 500,
                          margin: '2px 0 4px',
                        }}
                      >
                        <Link
                          href={href}
                          onClick={onClose}
                          className="text-[color:var(--text)] group-hover:text-[color:var(--accent-text)] transition-colors inline-block"
                        >
                          {item.title}
                        </Link>
                      </Title>

                      {/* Excerpt */}
                      {item.excerpt && (
                        <Body
                          className="text-xs md:text-sm text-[color:var(--text-muted)] line-clamp-2"
                          style={{ lineHeight: '1.6' }}
                        >
                          {item.excerpt}
                        </Body>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
