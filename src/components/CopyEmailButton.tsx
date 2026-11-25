'use client';

import React, { useState } from 'react';

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy email address ${email}`}
        className="px-2 py-0.5 rounded-[var(--radius-s)] border border-[color:var(--border)] font-mono text-[10px] tracking-wider uppercase text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] transition-colors"
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied to clipboard' : ''}
      </span>
    </span>
  );
}
