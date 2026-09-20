'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { Label } from '@/components/typography';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isDark = mounted ? resolvedTheme === 'dark' : false;
  const targetTheme = isDark ? 'light' : 'dark';
  const labelText = isDark ? 'LIGHT' : 'DARK';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`min-h-[44px] min-w-[44px] px-2 flex items-center gap-2 text-[color:var(--muted)] hover:text-[color:var(--text)] transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-2 ${className}`}
      aria-label={`Switch to ${targetTheme} mode`}
      title={`Switch to ${targetTheme} mode`}
      suppressHydrationWarning
    >
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isDark ? (
          /* Sun icon in dark mode to switch to light */
          <>
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
          </>
        ) : (
          /* Moon icon in light mode to switch to dark */
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        )}
      </svg>
      <Label className="cursor-pointer tracking-wider" suppressHydrationWarning>
        {labelText}
      </Label>
    </button>
  );
}
