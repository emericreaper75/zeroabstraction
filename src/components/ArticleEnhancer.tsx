'use client';

import React, { useEffect, useState } from 'react';

export function ArticleEnhancer({ totalMinutes }: { totalMinutes?: number }) {
  const [percent, setPercent] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  // 1. Track reading progress through <article>
  useEffect(() => {
    const update = () => {
      const article = document.querySelector('article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      if (total <= 120) {
        setShowBadge(false);
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      setPercent(pct);
      setShowBadge(scrolled > 180 && pct < 100);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // 2. Inject copy buttons on .rich-text pre blocks and wrap overflowing tables
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>('.rich-text pre');
    const cleanups: (() => void)[] = [];

    blocks.forEach((pre) => {
      if (pre.dataset.copyEnhanced === 'true') return;
      pre.dataset.copyEnhanced = 'true';
      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.textContent = 'COPY';
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      const handleClick = async () => {
        const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = 'COPIED';
          setTimeout(() => {
            btn.textContent = 'COPY';
          }, 1800);
        } catch {
          btn.textContent = 'FAILED';
        }
      };

      btn.addEventListener('click', handleClick);
      pre.appendChild(btn);
      cleanups.push(() => {
        btn.removeEventListener('click', handleClick);
        btn.remove();
        delete pre.dataset.copyEnhanced;
      });
    });

    const tables = document.querySelectorAll<HTMLTableElement>('.rich-text table');
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains('rich-table-wrap')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'rich-table-wrap';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (!showBadge) return null;

  const remaining = totalMinutes ? Math.max(1, Math.ceil((totalMinutes * (100 - percent)) / 100)) : null;

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-6 left-6 z-40 hidden sm:inline-flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-s)] border border-[color:var(--border-strong)] bg-[color:var(--glass-bg)] [backdrop-filter:blur(12px)] shadow-md font-mono text-[11px] tracking-wider text-[color:var(--text-muted)]"
    >
      <span className="text-[color:var(--accent-text)] font-medium">{percent}%</span>
      {remaining !== null && <span>· {remaining} MIN LEFT</span>}
    </div>
  );
}
