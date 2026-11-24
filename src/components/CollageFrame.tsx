'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';

export interface CollageFrameProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number; // degrees, e.g. -2, 1, 2
  offset?: string; // Tailwind translate class, e.g. 'translate-y-1'
  tornEdge?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  borderAccent?: 'none' | 'emerald' | 'vermillion' | 'default';
  paperTexture?: boolean;
  style?: React.CSSProperties;
}

export function CollageFrame({
  children,
  className = '',
  rotation = 0,
  offset = '',
  tornEdge = false,
  shadow = 'md',
  borderAccent = 'none',
  paperTexture = true,
  style = {},
}: CollageFrameProps) {
  const shouldReduceMotion = useReducedMotion();
  const effectiveRotation = 0;

  const shadowClass =
    shadow === 'sm'
      ? 'drop-shadow-sm'
      : shadow === 'md'
      ? 'drop-shadow-md'
      : shadow === 'lg'
      ? 'drop-shadow-xl'
      : '';

  const borderClass =
    borderAccent === 'emerald'
      ? 'border border-[color:var(--accent)] ring-1 ring-[color:var(--accent)]/30'
      : borderAccent === 'vermillion'
      ? 'border border-[color:var(--accent-border)] ring-1 ring-[color:var(--accent-border)]/30'
      : borderAccent === 'default'
      ? 'border border-[color:var(--border)]'
      : '';

  return (
    <div
      className={`relative z-10 transition-transform duration-300 ${offset} ${shadowClass} ${borderClass} ${
        tornEdge ? 'torn-edge' : ''
      } ${paperTexture ? 'bg-[color:var(--surface)] bg-[image:var(--bg-texture)] bg-repeat' : ''} ${className}`.trim()}
      style={{
        transform: effectiveRotation ? `rotate(${effectiveRotation}deg)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
