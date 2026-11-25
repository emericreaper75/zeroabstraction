'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 right-6 z-40 min-h-[44px] min-w-[44px] px-3 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-s)] border border-[color:var(--border-strong)] bg-[color:var(--glass-bg)] text-[color:var(--text)] [backdrop-filter:blur(12px)] shadow-md font-mono text-[11px] tracking-wider uppercase transition-all duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] active:scale-[0.97] ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      <span className="hidden sm:inline">TOP</span>
    </button>
  );
}
