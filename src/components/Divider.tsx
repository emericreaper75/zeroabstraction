import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'vermillion' | 'hand-drawn';
}

export function Divider({ variant = 'default', className = '', ...props }: DividerProps) {
  return <hr className={`border-0 border-t border-[color:var(--border)] my-6 ${className}`} {...(props as React.HTMLAttributes<HTMLHRElement>)} />;
}
