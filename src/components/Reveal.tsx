'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  offset?: string;
  style?: React.CSSProperties;
}

export function Reveal({
  children,
  className = '',
  rotation = 0,
  offset,
  style,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const effectiveRotation = shouldReduceMotion ? 0 : rotation;

  return (
    <motion.div
      className={`${offset || ''} ${className}`.trim()}
      style={{
        ...style,
      }}
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0, rotate: 0 }
          : { opacity: 0, y: 16, rotate: effectiveRotation ? effectiveRotation * 0.6 : 0 }
      }
      whileInView={{ opacity: 1, y: 0, rotate: effectiveRotation }}
      viewport={{ once: true, margin: '0px 0px -50px 0px', amount: 0.1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
