'use client';

import React, { useState } from 'react';

export function CopyPermalinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy page link to clipboard"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-s)] border border-[color:var(--border)] font-mono text-[11px] tracking-wider uppercase text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] transition-colors"
      >
        <span>{copied ? 'LINK COPIED' : 'COPY LINK'}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Page link copied to clipboard' : ''}
      </span>
    </>
  );
}
