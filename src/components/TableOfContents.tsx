'use client';

import React, { useEffect, useState } from 'react';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ variant = 'sidebar' }: { variant?: 'sidebar' | 'inline' }) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('.rich-text h2[id], .rich-text h3[id]')
    );
    const items = nodes
      .map((el) => ({
        id: el.id,
        text: (el.textContent || '').replace(/#$/, '').trim(),
        level: el.tagName === 'H3' ? 3 : 2,
      }))
      .filter((item) => item.id && item.text);

    setHeadings(items);
    if (items.length === 0) return;

    setActiveId(items[0].id);

    const updateActiveFromScroll = () => {
      const offset = 128;
      let currentId = items[0].id;
      for (const node of nodes) {
        const top = node.getBoundingClientRect().top;
        if (top <= offset) {
          currentId = node.id;
        } else {
          break;
        }
      }
      setActiveId(currentId);
    };

    const observer = new IntersectionObserver(
      () => {
        updateActiveFromScroll();
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    nodes.forEach((node) => observer.observe(node));
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveFromScroll);
    };
  }, []);

  if (headings.length < 2) return null;

  if (variant === 'inline') {
    return (
      <nav aria-label="Table of contents" className="lg:hidden mb-8">
        <div className="border border-[color:var(--border)] bg-[color:var(--surface)]/50 rounded-[var(--radius-s)] p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--text-muted)]">
              ON THIS PAGE ({headings.length})
            </span>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent-text)] hover:underline"
            >
              {open ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {open && (
            <ol className="mt-3 flex flex-col gap-1.5 border-t border-[color:var(--border)] pt-3">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${h.id}`}
                      onClick={() => setActiveId(h.id)}
                      style={{ textDecoration: 'none' }}
                      className={`block py-1 text-sm transition-colors ${
                        isActive
                          ? 'text-[color:var(--accent-text)] font-medium'
                          : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                      }`}
                    >
                      {h.text}
                    </a>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </nav>
    );
  }

  return (
    <aside aria-label="On this page" className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
      <nav className="border-l border-[color:var(--border)] pl-4 py-1">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--text-muted)] mb-3">
          ON THIS PAGE
        </p>
        <ol className="flex flex-col gap-1">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setActiveId(h.id)}
                  aria-current={isActive ? 'location' : undefined}
                  style={{ textDecoration: 'none' }}
                  className={`relative block py-1.5 text-[13px] leading-snug transition-colors ${
                    isActive
                      ? 'text-[color:var(--accent-text)] font-medium before:content-[""] before:absolute before:-left-[17px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-[color:var(--accent)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
