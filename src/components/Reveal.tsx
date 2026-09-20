'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  // If the user prefers reduced motion, we render a standard div or a motion.div with no animation
  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px", amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
