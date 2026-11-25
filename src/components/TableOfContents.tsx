'use client';

import React, { useEffect, useState } from 'react';

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [open, setOpen] = useState(true);

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-96px 0px -65% 0px', threshold: 0.1 }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="container-reading mb-8"
    >
      <div className="border border-[color:var(--border)] bg-[color:var(--surface)]/50 rounded-[var(--radius-s)] p-4 sm:p-5">
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
