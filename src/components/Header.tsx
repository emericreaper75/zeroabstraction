'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Title, Label, Display } from '@/components/typography';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchModal } from '@/components/SearchModal';
import type { SearchableItem } from '@/lib/content';

interface HeaderProps {
  searchableItems?: SearchableItem[];
  navLinks?: { label?: string | null; url?: string | null; id?: string | null }[];
}

export function Header({ searchableItems = [], navLinks = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

    const currentButton = buttonRef.current;
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Return focus to button on close so keyboard users aren't lost
      if (currentButton && document.activeElement !== currentButton) {
        currentButton.focus();
      }
    };
  }, [isOpen]);

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Global shortcut listener for ⌘K or '/' to open search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || (document.activeElement as HTMLElement)?.isContentEditable;

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isInput)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const searchButton = (
    <button
      type="button"
      onClick={() => setIsSearchOpen(true)}
      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors"
      aria-label="Search content (Press ⌘K or /)"
      title="Search (⌘K or /)"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );

  return (
    <>
      <header className="container-wide py-8 flex items-center justify-between relative z-50">
        <Link href="/" style={{ textDecoration: 'none' }} className="relative z-[60]">
          <Title as="div">Zero Abstraction</Title>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center" style={{ gap: 'var(--space-6)' }}>
          {(navLinks?.length ? navLinks : [
            { label: 'HOME', url: '/' },
            { label: 'PROJECTS', url: '/projects' },
            { label: 'WRITING', url: '/writing' },
            { label: 'ABOUT', url: '/about' },
          ]).map(link => (
            <Link key={link.url || '#'} href={link.url || '#'} className="text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" style={{ textDecoration: 'none' }}>
              <Label className={pathname === link.url ? '' : 'text-[color:var(--muted)]'}>
                {link.label?.toUpperCase()}
              </Label>
            </Link>
          ))}
          <div className="h-4 w-px bg-[color:var(--border)]" aria-hidden="true" />
          <div className="flex items-center gap-1">
            {searchButton}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden relative z-[60] flex items-center gap-1">
          {searchButton}
          <ThemeToggle />
          <button 
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[color:var(--text)]"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <Label>{isOpen ? 'CLOSE' : 'MENU'}</Label>
          </button>
        </div>

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
            {(navLinks?.length ? navLinks : [
              { label: 'HOME', url: '/' },
              { label: 'PROJECTS', url: '/projects' },
              { label: 'WRITING', url: '/writing' },
              { label: 'ABOUT', url: '/about' },
            ]).map(link => {
              const isActive = pathname === link.url;
              return (
                <Link 
                  key={link.url || '#'} 
                  href={link.url || '#'} 
                  style={{ textDecoration: 'none' }}
                  className="flex items-center gap-4 group min-h-[44px] py-2"
                >
                  {isActive && <span className="text-[color:var(--text)] text-2xl" aria-hidden="true">→</span>}
                  <Display as="span" className={isActive ? 'text-[color:var(--text)]' : 'text-[color:var(--muted)] group-hover:text-[color:var(--text)] transition-colors'}>
                    {link.label?.toUpperCase()}
                  </Display>
                </Link>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-4 group min-h-[44px] py-2 text-left"
            >
              <Display as="span" className="text-[color:var(--muted)] group-hover:text-[color:var(--text)] transition-colors">
                SEARCH
              </Display>
            </button>
            <div className="pt-6 border-t border-[color:var(--border)] flex items-center justify-between">
              <Label className="text-[color:var(--muted)]">THEME</Label>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Client-Side Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={searchableItems}
      />
    </>
  );
}
