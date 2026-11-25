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
  if (pathname.startsWith('/admin/collections/projects/')) return 'PROJECT EDITOR'
  if (pathname.startsWith('/admin/collections/projects')) return 'PROJECTS & RIGS'
  if (pathname.startsWith('/admin/collections/topics')) return 'TOPICS & TAXONOMY'
  if (pathname.startsWith('/admin/collections/media')) return 'MEDIA & PLATES'
  if (pathname.startsWith('/admin/collections/journey')) return 'JOURNEY TIMELINE'
  if (pathname.startsWith('/admin/collections/users')) return 'USERS & ACCESS'
  if (pathname.startsWith('/admin/globals/current-state')) return 'CURRENT STATE'
  if (pathname.startsWith('/admin/globals/profile')) return 'OBSERVER PROFILE'
  if (pathname.startsWith('/admin/globals/site-settings')) return 'SITE SETTINGS'
  return 'ATELIER WORKBENCH'
}

export function AdminHeader({
  user,
  searchItems = [],
  counts = DEFAULT_COUNTS,
  notifications = [],
}: AdminHeaderProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [createMenuOpen, setCreateMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCleared, setUnreadCleared] = useState(false)

  const createMenuRef = useRef<HTMLDivElement>(null)
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
    setTheme(cur === 'light' ? 'light' : 'dark')

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

  // Close popovers on outside click or Escape
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (createMenuOpen && createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false)
      }
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCreateMenuOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [createMenuOpen, notifOpen])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try {
      localStorage.setItem('payload-admin-theme', next)
    } catch {
      /* ignore storage errors */
    }
  }

  let initial = 'M'
  let displayName = 'Observer'
  if (user?.email) {
    initial = user.email.charAt(0).toUpperCase()
    displayName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
  }

  const routeLabel = getBreadcrumbLabel(pathname)
  const hasUnread = !unreadCleared && notifications.length > 0

  return (
    <>
      <header className="bg-surface-container-lowest/95 sticky top-0 z-40 border-b border-hairline-rule backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-space-md h-14 max-w-[1440px] mx-auto">
          {/* Left: Mobile Drawer Trigger + Brand + Dynamic Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="md:hidden p-1.5 -ml-1.5 text-ink-secondary hover:text-primary rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[21px]">menu</span>
            </button>

            <Link
              className="font-headline-sm text-lg text-on-surface tracking-tight flex items-center gap-2 group shrink-0"
              href="/admin"
            >
              <span className="w-2.5 h-2.5 bg-primary rounded-none inline-block group-hover:rotate-45 transition-transform" />
              <span className="font-headline-md italic font-normal text-on-surface group-hover:text-primary transition-colors">
                ZeroAbstraction
              </span>
              <span className="text-label-sm font-label-sm text-ink-muted px-1.5 py-0.5 border border-hairline-rule rounded bg-surface-container-low hidden sm:inline-block">
                v3.28
              </span>
            </Link>

            <span className="hidden lg:inline-block text-hairline-rule font-light">/</span>
            <div className="hidden lg:flex items-center gap-1.5 text-label-sm font-label-sm text-ink-muted truncate">
              <span className="material-symbols-outlined text-[14px] text-primary">satellite_alt</span>
              <span className="truncate">{routeLabel}</span>
            </div>
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-space-sm">
            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="relative flex items-center gap-2 bg-surface-container-low hover:bg-surface-container text-ink-muted hover:text-on-surface text-label-sm font-label-sm px-2.5 sm:pl-3 sm:pr-2 py-1.5 rounded border border-hairline-rule transition-colors sm:w-56 justify-between"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[16px] text-primary">search</span>
                <span className="hidden sm:inline truncate">Search catalog &amp; commands...</span>
              </span>
              <kbd className="hidden sm:inline text-[10px] font-label-sm text-ink-muted border border-hairline-rule px-1 py-0.5 bg-paper-surface rounded">
                ⌘K
              </kbd>
            </button>

            {/* Quick Create Dropdown */}
            <div className="relative" ref={createMenuRef}>
              <button
                type="button"
                onClick={() => setCreateMenuOpen((o) => !o)}
                aria-expanded={createMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-3 py-1.5 rounded hover:bg-accent-ochre transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span className="hidden sm:inline">New Entry</span>
                <span className="material-symbols-outlined text-[14px] opacity-80">expand_more</span>
              </button>

              {createMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded border border-hairline-rule bg-paper-surface shadow-xl py-1.5 z-50"
                >
                  <div className="px-3 py-1 text-[10px] font-label-sm text-ink-muted uppercase tracking-widest">
                    Quick Create
                  </div>
                  <Link
                    href="/admin/collections/posts/new"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                    <span>New Treatise / Post</span>
                  </Link>
                  <Link
                    href="/admin/collections/projects/new"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">precision_manufacturing</span>
                    <span>New Project Rig</span>
                  </Link>
                  <Link
                    href="/admin/collections/media"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">upload_file</span>
                    <span>Upload Media Plate</span>
                  </Link>
                  <div className="my-1 border-t border-hairline-subtle" />
                  <Link
                    href="/admin/globals/current-state"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-500">sensors</span>
                    <span>Update Field Telemetry</span>
                  </Link>
                </div>
              )}
            </div>

            {/* View Public Site */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open public site in new tab"
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-hairline-rule text-label-sm font-label-sm text-ink-secondary hover:text-primary hover:border-primary/40 transition-colors"
            >
              <span>View Site</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>

            {/* Utility Icons: Notifications, Shortcuts, Theme */}
            <div className="flex items-center border-l border-hairline-rule pl-2 ml-1 gap-0.5 text-ink-secondary">
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-expanded={notifOpen}
                  aria-label="Observatory notifications"
                  className="relative p-1.5 text-ink-secondary hover:text-primary transition-colors rounded"
                  title="Notifications"
                >
                  <span className="material-symbols-outlined text-[19px]">notifications</span>
                  {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-paper-base" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded border border-hairline-rule bg-paper-surface shadow-xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-hairline-rule bg-surface-container-low">
                      <span className="text-[11px] font-label-sm font-semibold uppercase tracking-wider text-on-surface">
                        Observatory Queue
                      </span>
                      {hasUnread && (
                        <button
                          type="button"
                          onClick={() => setUnreadCleared(true)}
                          className="text-[11px] font-label-sm text-primary hover:underline"
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
                          className="flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary mt-0.5 shrink-0">
                            {n.kind === 'draft' ? 'draw' : n.kind === 'project' ? 'qr_code_2' : 'check_circle'}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs text-on-surface font-medium truncate">{n.title}</p>
                            <p className="text-[11px] font-label-sm text-ink-muted mt-0.5">{n.meta}</p>
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

              <button
                type="button"
                onClick={() => setShortcutsOpen(true)}
                className="hidden sm:inline-flex p-1.5 text-ink-secondary hover:text-primary transition-colors rounded"
                title="Keyboard shortcuts (?)"
                aria-label="Keyboard shortcuts"
              >
                <span className="material-symbols-outlined text-[19px]">keyboard</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 text-ink-secondary hover:text-primary transition-colors rounded"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-hairline-rule">
              <div className="relative">
                <div className="w-7 h-7 bg-amber-wash border border-primary/40 rounded flex items-center justify-center text-primary font-label-md text-xs font-semibold">
                  {initial}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-paper-base" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-label-sm font-label-sm text-on-surface font-medium leading-none">
                  {displayName}
                </span>
                <span className="text-[9px] font-label-sm text-ink-muted leading-tight mt-0.5">
                  ADMIN // CHIEF OBSERVER
                </span>
              </div>
              <form action="/api/users/logout" method="POST">
                <button
                  type="submit"
                  className="text-ink-muted hover:text-primary transition-colors flex items-center justify-center ml-1"
                  title="Disconnect"
                  aria-label="Disconnect and sign out"
                >
                  <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
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
