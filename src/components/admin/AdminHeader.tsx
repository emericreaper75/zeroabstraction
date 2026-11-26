'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from 'payload'
import {
  AdminCommandPalette,
  AdminShortcutsDialog,
  type CommandSearchItem,
} from './AdminCommandPalette'
import { AdminMobileDrawer, type AdminSidebarCounts } from './AdminSidebarClient'

export interface AdminNotificationItem {
  id: string
  title: string
  meta: string
  href: string
  kind: 'draft' | 'project' | 'system'
}

interface AdminHeaderProps {
  user: User | null
  searchItems?: CommandSearchItem[]
  counts?: AdminSidebarCounts
  notifications?: AdminNotificationItem[]
}

const DEFAULT_COUNTS: AdminSidebarCounts = {
  postsCount: 0,
  publishedPostsCount: 0,
  draftPostsCount: 0,
  projectsCount: 0,
  mediaCount: 0,
  topicsCount: 0,
  usersCount: 0,
}

function getBreadcrumbLabel(pathname: string): string {
  if (pathname === '/admin') return 'OBSERVATORY OVERVIEW'
  if (pathname.startsWith('/admin/collections/posts/new')) return 'NEW TREATISE'
  if (pathname.startsWith('/admin/collections/posts/')) return 'POST EDITOR'
  if (pathname.startsWith('/admin/collections/posts')) return 'POSTS & TREATISES'
  if (pathname.startsWith('/admin/collections/projects/new')) return 'NEW RIG'
  if (pathname.startsWith('/admin/collections/projects/')) return 'EDIT RIG'
  if (pathname.startsWith('/admin/collections/projects')) return 'RIGS'
  if (pathname.startsWith('/admin/collections/topics')) return 'TOPICS & TAXONOMY'
  if (pathname.startsWith('/admin/collections/media')) return 'MEDIA & PLATES'
  if (pathname.startsWith('/admin/collections/journey')) return 'JOURNEY TIMELINE'
  if (pathname.startsWith('/admin/collections/users')) return 'USERS & ACCESS'
  if (pathname.startsWith('/admin/globals/current-state')) return 'CURRENT STATE'
  if (pathname.startsWith('/admin/globals/profile')) return 'OBSERVER PROFILE'
  if (pathname.startsWith('/admin/globals/site-settings')) return 'SITE SETTINGS'
  return 'OBSERVATORY OVERVIEW'
}

export function AdminHeader({
  user,
  searchItems = [],
  counts = DEFAULT_COUNTS,
  notifications = [],
}: AdminHeaderProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCleared, setUnreadCleared] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)

  const applyTheme = (next: 'light' | 'dark') => {
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.className = next
    document.documentElement.style.colorScheme = next
    const meta = document.querySelector('meta[name="color-scheme"]')
    if (meta) meta.setAttribute('content', next)
  }

  useEffect(() => {
    const cur = document.documentElement.getAttribute('data-theme')
    setTheme(cur === 'dark' ? 'dark' : 'light')

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'payload-admin-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue)
      }
    }
    const onOpenShortcuts = () => setShortcutsOpen(true)

    window.addEventListener('storage', onStorage)
    window.addEventListener('atelier:open-shortcuts', onOpenShortcuts)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('atelier:open-shortcuts', onOpenShortcuts)
    }
  }, [])

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [notifOpen])

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    try {
      localStorage.setItem('payload-admin-theme', next)
    } catch {
      /* ignore */
    }
  }

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    } catch {
      /* ignore and redirect */
    }
    window.location.assign('/login')
  }

  let initial = 'A'
  let displayName = 'Admin'
  if (user?.email) {
    initial = user.email.charAt(0).toUpperCase()
    displayName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
  }

  const routeLabel = getBreadcrumbLabel(pathname)
  const hasUnread = !unreadCleared && notifications.length > 0

  return (
    <>
      <header className="bg-paper-base/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-3 sm:px-6 h-16 max-w-[1440px] mx-auto gap-3">
          {/* Left: Mobile Drawer Trigger + Brand + Soft Blue Pill */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="md:hidden p-1.5 text-ink-secondary hover:text-on-surface rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[21px]">menu</span>
            </button>

            <Link
              className="text-[15px] font-semibold text-on-surface tracking-tight flex items-center gap-2 shrink-0"
              href="/admin"
              title="ZeroAbstraction Observatory"
            >
              <span className="w-6 h-6 rounded-lg bg-[#0F172A] dark:bg-slate-100 text-white dark:text-slate-900 inline-flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                </svg>
              </span>
              <span className="font-studio-display">ZeroAbstraction</span>
            </Link>

            <span className="hidden sm:inline-block text-ink-muted/40 font-light">/</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 typo-pill px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-blue-400" />
              {routeLabel}
            </span>
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Rounded Pill Search Trigger */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search manuscripts and plates"
              className="flex items-center gap-2 bg-paper-surface hover:bg-surface-container-low text-ink-muted hover:text-on-surface text-[13px] px-3 sm:px-3.5 py-1.5 rounded-full transition-colors sm:w-64 justify-start"
            >
              <span className="material-symbols-outlined text-[17px] text-ink-muted">search</span>
              <span className="hidden sm:inline truncate">Search manuscripts, plates...</span>
            </button>

            {/* Quick Compose */}
            <Link
              href="/admin/collections/posts/new"
              title="New Manuscript"
              aria-label="Create new manuscript"
              className="p-2 rounded-full text-ink-secondary hover:text-on-surface hover:bg-paper-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">edit_square</span>
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className="relative p-2 rounded-full text-ink-secondary hover:text-on-surface hover:bg-paper-surface transition-colors"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[19px]">notifications</span>
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-[16px] bg-paper-surface shadow-xl z-50 overflow-hidden border border-hairline-subtle">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-hairline-subtle">
                    <span className="font-mono-telemetry text-[10px] font-semibold uppercase tracking-[0.06em] text-on-surface">
                      Observatory Queue
                    </span>
                    {hasUnread && (
                      <button
                        type="button"
                        onClick={() => setUnreadCleared(true)}
                        className="text-[11px] text-[#2563EB] hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-hairline-subtle max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => setNotifOpen(false)}
                        className="flex items-start gap-2.5 px-4 py-3 hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-ink-muted mt-0.5 shrink-0">
                          {n.kind === 'draft' ? 'draw' : n.kind === 'project' ? 'qr_code_2' : 'check_circle'}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] text-on-surface font-medium truncate">{n.title}</p>
                          <p className="text-[11px] text-ink-muted mt-0.5 truncate">{n.meta}</p>
                        </div>
                      </Link>
                    ))}
                    {notifications.length === 0 && (
                      <div className="px-4 py-6 text-center text-xs text-ink-muted">
                        All manuscripts &amp; telemetry synced.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Gear */}
            <Link
              href="/admin/globals/site-settings"
              title="Site Settings"
              aria-label="Site Settings"
              className="hidden sm:inline-flex p-2 rounded-full text-ink-secondary hover:text-on-surface hover:bg-paper-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">settings</span>
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-ink-secondary hover:text-on-surface hover:bg-paper-surface transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              <span className="material-symbols-outlined text-[19px]">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>

            {/* Admin Avatar Pill */}
            <div className="flex items-center gap-2 pl-1">
              <Link
                href="/admin/globals/profile"
                className="flex items-center gap-2 rounded-full bg-paper-surface px-2.5 py-1 hover:bg-surface-container-low transition-colors"
                title={`${displayName} Profile`}
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-[#0F172A] dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center text-[11px] font-semibold">
                    {initial}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-paper-surface" />
                </div>
                <span className="hidden lg:inline text-[13px] font-medium text-on-surface pr-1">
                  {displayName}
                </span>
              </Link>
              <form action="/api/admin/logout" method="POST">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="p-1.5 rounded-full text-ink-muted hover:text-on-surface transition-colors flex items-center justify-center disabled:opacity-50"
                  title="Sign out"
                  aria-label="Disconnect and sign out"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {loggingOut ? 'sync' : 'logout'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <AdminCommandPalette
        open={paletteOpen}
        onOpen={() => setPaletteOpen(true)}
        onClose={() => setPaletteOpen(false)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        items={searchItems}
      />

      <AdminShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      <AdminMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} counts={counts} />
    </>
  )
}
