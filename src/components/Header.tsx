'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Title, Label, Display } from '@/components/typography';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const LINKS = [
  { name: 'HOME', path: '/' },
  { name: 'PROJECTS', path: '/projects' },
  { name: 'WRITING', path: '/writing' },
  { name: 'ABOUT', path: '/about' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus trap inside the overlay when open
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;
    
    const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    // The first focusable element is the close button (which is actually rendered above the overlay but has z-[60])
    // To make it completely self-contained within the overlay logic, we just trap everything we can find.
    const allFocusable = [buttonRef.current, ...Array.from(focusableElements)].filter(Boolean) as HTMLElement[];
    
    const firstElement = allFocusable[0];
    const lastElement = allFocusable[allFocusable.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    
    // Auto-focus first link in the menu
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Return focus to button on close so keyboard users aren't lost
      if (buttonRef.current && document.activeElement !== buttonRef.current) {
        buttonRef.current.focus();
      }
    };
  }, [isOpen]);

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="container-wide py-8 flex items-center justify-between relative z-50">
      <Link href="/" style={{ textDecoration: 'none' }} className="relative z-[60]">
        <Title as="div">Zero Abstraction</Title>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center" style={{ gap: 'var(--space-6)' }}>
        {LINKS.map(link => (
          <Link key={link.path} href={link.path} className="text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" style={{ textDecoration: 'none' }}>
            <Label className={pathname === link.path ? '' : 'text-[color:var(--muted)]'}>
              {link.name}
            </Label>
          </Link>
        ))}
      </div>

      {/* Mobile Toggle Button */}
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative z-[60] p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <Label>{isOpen ? 'CLOSE' : 'MENU'}</Label>
      </button>

      {/* Mobile Menu Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-[color:var(--bg)] z-50 flex flex-col justify-center px-8 md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateY(0)' : 'translateY(-16px)',
          transition: prefersReducedMotion ? 'none' : 'opacity 300ms ease-out, transform 300ms ease-out, visibility 300ms',
        }}
      >
        <nav className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
          {LINKS.map(link => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path} 
                style={{ textDecoration: 'none' }}
                className="flex items-center gap-4 group min-h-[44px] py-2"
              >
                {isActive && <span className="text-[color:var(--text)] text-2xl" aria-hidden="true">→</span>}
                <Display as="span" className={isActive ? 'text-[color:var(--text)]' : 'text-[color:var(--muted)] group-hover:text-[color:var(--text)] transition-colors'}>
                  {link.name}
                </Display>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  );
}
