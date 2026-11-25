'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Title, Label, Display } from '@/components/typography';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchModal } from '@/components/SearchModal';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';

interface HeaderProps {
  navLinks?: { label?: string | null; url?: string | null; id?: string | null }[];
}

export function Header({ navLinks = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === '/';
  const isHeroGlass = isHome && !pastHero;

  // Listen to scroll to toggle between floating hero glass and compact glass bar on Home
  useEffect(() => {
    if (!isHome) {
      setPastHero(false);
      return;
    }

    const handleScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.75);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

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
      className={`px-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 rounded-[var(--radius-s)] transition-colors ${
        isHeroGlass
          ? 'text-[color:var(--hero-fg)] hover:text-[color:var(--hero-accent)]'
          : 'text-[color:var(--text)] hover:text-[color:var(--accent-text)]'
      }`}
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
      <kbd
        aria-hidden="true"
        className="hidden lg:inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] leading-none tracking-wider border border-[color:var(--border)] rounded-[var(--radius-s)] opacity-75"
      >
        ⌘K
      </kbd>
    </button>
  );

  // Surface classes based on page and scroll position (Doc 08)
  const headerContainerClasses = !isHome
    ? 'sticky top-0 z-50 h-16 w-full border-b border-[color:var(--border)] bg-[var(--bg)]'
    : isHeroGlass
      ? 'fixed z-50 h-16 transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] top-[var(--space-3)] left-[var(--space-3)] right-[var(--space-3)] max-w-[var(--measure-wide)] mx-auto rounded-[var(--radius-bar)] bg-[color:var(--hero-glass-bg)] border border-[color:var(--hero-glass-border)] [backdrop-filter:blur(var(--hero-glass-blur))_saturate(140%)] hero-glass-bar'
      : 'fixed top-0 left-0 right-0 z-50 h-16 w-full rounded-none transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] bg-[color:var(--glass-bg)] border-b border-[color:var(--glass-border)] [backdrop-filter:blur(var(--glass-blur))] compact-glass-bar';

  const innerContainerClasses = isHome && isHeroGlass
    ? 'w-full h-full px-6 flex items-center justify-between'
    : 'container-wide h-full flex items-center justify-between';

  return (
    <>
      <header
        className={headerContainerClasses}
        style={{
          transition: prefersReducedMotion ? 'none' : undefined,
        }}
      >
        <div className={innerContainerClasses}>
        <Link href="/" style={{ textDecoration: 'none' }} className="relative z-[60]">
          <span
            className={`font-[family-name:var(--font-display)] text-[clamp(1.5rem,2vw,2rem)] leading-none ${
              isHeroGlass ? 'text-[color:var(--hero-fg)]' : 'text-[color:var(--text)]'
            }`}
          >
            ZeroAbstraction
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <nav
            aria-label="Primary"
            className="flex items-center gap-1 p-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/55 [backdrop-filter:blur(10px)]"
          >
            {(navLinks?.length ? navLinks : [
              { label: 'HOME', url: '/' },
              { label: 'PROJECTS', url: '/projects' },
              { label: 'WRITING', url: '/writing' },
              { label: 'ABOUT', url: '/about' },
            ]).map(link => {
              const isActive = pathname === link.url;
              const rawLabel = (link.label || '').toUpperCase();
              const displayLabel =
                rawLabel === 'ME' ? 'HOME' : rawLabel === 'BIOGRAPHY' ? 'ABOUT' : rawLabel;

              return (
                <Link
                  key={link.url || '#'}
                  href={link.url || '#'}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative min-h-[36px] px-3.5 rounded-full flex items-center gap-2 transition-colors duration-150 ${
                    isActive
                      ? 'text-[color:var(--accent-text)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 420, damping: 34 }
                      }
                      className="absolute inset-0 rounded-full bg-[color:var(--accent-subtle)] border border-[color:var(--accent-border)]/60 shadow-sm -z-10"
                      aria-hidden="true"
                    />
                  )}
                  <motion.span
                    whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                    className="relative z-10 flex items-center gap-2"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 500, damping: 32 }
                        }
                        className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]"
                        aria-hidden="true"
                      />
                    )}
                    <Label className="tracking-[0.11em] font-medium text-[11px] cursor-pointer">
                      {displayLabel}
                    </Label>
                  </motion.span>
                </Link>
              );
            })}
          </nav>
          <div
            className={`h-4 w-px ${isHeroGlass ? 'bg-[color:var(--hero-glass-border)]' : 'bg-[color:var(--border)]'}`}
            aria-hidden="true"
          />
          <div className="flex items-center gap-1.5">
            {searchButton}
            <ThemeToggle
              className={
                isHeroGlass
                  ? 'text-[color:var(--hero-fg-muted)] hover:text-[color:var(--hero-fg)]'
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
              }
            />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden relative z-[60] flex items-center gap-1">
          {searchButton}
          <ThemeToggle
            className={
              isHeroGlass
                ? 'text-[color:var(--hero-fg-muted)] hover:text-[color:var(--hero-fg)]'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
            }
          />
          <button 
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isHeroGlass ? 'text-[color:var(--hero-fg)]' : 'text-[color:var(--text)]'
            }`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <Label>{isOpen ? 'CLOSE' : 'MENU'}</Label>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          ref={overlayRef}
          className={`fixed inset-0 z-50 flex flex-col justify-center px-8 md:hidden ${
            isHeroGlass
              ? 'bg-[color:var(--hero-glass-bg)] [backdrop-filter:blur(var(--hero-glass-blur))] text-[color:var(--hero-fg)]'
              : 'bg-[color:var(--bg)] text-[color:var(--text)]'
          }`}
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
                  aria-current={isActive ? 'page' : undefined}
                  style={{ textDecoration: 'none' }}
                  className="flex items-center gap-4 group min-h-[44px] py-2"
                >
                  {isActive && (
                    <span
                      className={`text-2xl ${isHeroGlass ? 'text-[color:var(--hero-accent)]' : 'text-[color:var(--text)]'}`}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                  <Display
                    as="span"
                    className={
                      isActive
                        ? isHeroGlass
                          ? 'text-[color:var(--hero-fg)]'
                          : 'text-[color:var(--text)]'
                        : isHeroGlass
                          ? 'text-[color:var(--hero-fg-muted)] group-hover:text-[color:var(--hero-fg)] transition-colors'
                          : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text)] transition-colors'
                    }
                  >
                    {link.label?.toUpperCase()}
                  </Display>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center gap-4 group min-h-[44px] py-2 text-left"
            >
              <Display
                as="span"
                className={
                  isHeroGlass
                    ? 'text-[color:var(--hero-fg-muted)] group-hover:text-[color:var(--hero-fg)] transition-colors'
                    : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text)] transition-colors'
                }
              >
                SEARCH
              </Display>
            </button>
            <div
              className={`pt-6 border-t flex items-center justify-between ${
                isHeroGlass ? 'border-[color:var(--hero-glass-border)]' : 'border-[color:var(--border)]'
              }`}
            >
              <Label className={isHeroGlass ? 'text-[color:var(--hero-fg-muted)]' : 'text-[color:var(--text-muted)]'}>
                THEME
              </Label>
              <ThemeToggle
                className={
                  isHeroGlass
                    ? 'text-[color:var(--hero-fg-muted)] hover:text-[color:var(--hero-fg)]'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                }
              />
            </div>
          </nav>
        </div>
        </div>
        {!isHeroGlass && <ScrollProgressBar />}
      </header>

      {/* Client-Side Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
