import React from 'react';

export const SampleContentBadge: React.FC = () => {
  if (process.env.NEXT_PUBLIC_SHOW_SAMPLE_BANNER === 'false') {
    return null;
  }

  return (
    <div 
      className="w-full text-center py-2 border-b border-[color:var(--border)] bg-[color:var(--warning)]/10 text-[color:var(--warning)] relative"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.08em'
      }}
    >
      <span className="inline-flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--warning)] inline-block animate-pulse" />
        [SAMPLE CONTENT — NOT FINAL]
      </span>
    </div>
  );
};
