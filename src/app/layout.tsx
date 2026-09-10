import React from 'react';
import './globals.css';
import '../styles/tokens.css';

export const metadata = {
  title: 'Zero Abstraction',
  description: 'Exploring the intersections of theoretical physics, electrical engineering, and the cosmos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
