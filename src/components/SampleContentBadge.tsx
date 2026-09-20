import React from 'react';

export const SampleContentBadge: React.FC = () => {
  return (
    <div 
      className="w-full text-center py-2 z-50 border-b border-[color:var(--border)]"
      style={{
        backgroundColor: 'var(--accent)',
        color: 'var(--bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        fontWeight: 'bold',
        letterSpacing: '0.05em'
      }}
    >
      [SAMPLE CONTENT — NOT FINAL]
    </div>
  );
};
