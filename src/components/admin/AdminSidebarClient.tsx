'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface AdminSidebarCounts {
  postsCount: number
  publishedPostsCount: number
  draftPostsCount: number
  projectsCount: number
  mediaCount: number
  topicsCount: number
  usersCount: number
}

interface NavItem {
  href: string
  icon: string
  label: string
  badge?: string | number
  badgeHighlight?: boolean
  pulse?: boolean
}

export function AdminSidebarClient({ counts }: { counts: AdminSidebarCounts }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('atelier-sidebar-collapsed')
      if (saved === 'true') setCollapsed(true)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('atelier-sidebar-collapsed', String(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const pad = (n: number) => n.toString().padStart(2, '0')
  const publishRatio =
    counts.postsCount > 0 ? Math.round((counts.publishedPostsCount / counts.postsCount) * 100) : 0

  const contentItems: NavItem[] = [
    { href: '/admin', icon: 'space_dashboard', label: 'Dashboard' },
    {
      href: '/admin/collections/posts',
      icon: 'edit_note',
      label: 'Posts',
      badge: pad(counts.postsCount),
      badgeHighlight: true,
    },
    {
      href: '/admin/collections/projects',
      icon: 'qr_code_2',
      label: 'Projects',
      badge: pad(counts.projectsCount),
    },
    {
      href: '/admin/collections/topics',
      icon: 'label',
      label: 'Topics',
      badge: pad(counts.topicsCount),
    },
    {
      href: '/admin/collections/media',
      icon: 'photo_library',
      label: 'Media',
      badge: counts.mediaCount,
    },
  ]

  const globalItems: NavItem[] = [
    { href: '/admin/globals/profile', icon: 'person', label: 'Profile' },
    {
      href: '/admin/globals/current-state',
      icon: 'sensors',
      label: 'Current State',
      pulse: true,
    },
    { href: '/admin/collections/journey', icon: 'timeline', label: 'Journey' },
  ]

  const systemItems: NavItem[] = [
    { href: '/admin/globals/site-settings', icon: 'tune', label: 'Site Settings' },
    {
      href: '/admin/collections/users',
      icon: 'group',
      label: 'Users',
      badge: pad(counts.usersCount),
    },
  ]

  const renderLink = (item: NavItem) => {
    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between pl-2.5 pr-2.5'} py-1.5 rounded-r transition-colors font-label-md group ${
          isActive
            ? 'bg-amber-wash text-primary border-l-2 border-primary font-medium shadow-xs'
            : 'text-ink-secondary hover:bg-surface-container-high hover:text-on-surface border-l-2 border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`material-symbols-outlined text-[17px] shrink-0 ${
              isActive ? 'text-primary' : 'text-ink-muted group-hover:text-primary'
            }`}
          >
            {item.icon}
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </div>
        {!collapsed && item.badge !== undefined && (
          <span
            className={`text-label-sm font-label-sm px-1.5 py-0.5 rounded ${
              item.badgeHighlight
                ? 'text-primary bg-amber-wash border border-primary/20'
                : 'text-ink-muted bg-surface-container-high'
            }`}
          >
            {item.badge}
          </span>
        )}
        {!collapsed && item.pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-amber opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-60'
      } shrink-0 bg-paper-sidebar border-r border-hairline-rule flex-col justify-between py-space-md px-space-sm hidden md:flex transition-[width] duration-200`}
    >
      <div className="space-y-space-md">
        {/* Section Node Tag + Collapse Toggle */}
        <div className={`pb-3 border-b border-hairline-rule flex items-center ${collapsed ? 'justify-center' : 'justify-between px-space-sm'}`}>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">radio_button_checked</span>
                <span className="font-headline-sm text-sm text-on-surface tracking-tight font-normal truncate">
                  Payload Atelier
                </span>
              </div>
              <p className="text-label-sm font-label-sm text-ink-muted mt-0.5 truncate">EPOCH 2025.2 // v4.12.0</p>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="p-1 text-ink-muted hover:text-primary hover:bg-surface-container-low rounded transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Collections */}
        {!collapsed && (
          <div className="px-space-sm pt-0.5">
            <span className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase font-semibold">
              COLLECTIONS
            </span>
          </div>
        )}
        <nav className="space-y-1" aria-label="Admin collections">
          {contentItems.map(renderLink)}

          <div className="my-2.5 border-t border-hairline-rule" />

          {!collapsed && (
            <div className="px-space-sm pt-0.5 pb-1">
              <span className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase font-semibold">
                TELEMETRY &amp; GLOBALS
              </span>
            </div>
          )}
          {globalItems.map(renderLink)}

          <div className="my-2.5 border-t border-hairline-rule" />

          {!collapsed && (
            <div className="px-space-sm pt-0.5 pb-1">
              <span className="text-[10px] font-label-sm text-ink-muted tracking-widest uppercase font-semibold">
                SYSTEM
              </span>
            </div>
          )}
          {systemItems.map(renderLink)}
        </nav>
      </div>

      {/* Bottom Telemetry Card */}
      {!collapsed ? (
        <div className="space-y-space-sm pt-space-sm border-t border-hairline-rule">
          <div className="p-2.5 bg-surface-container-low border border-hairline-rule rounded">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Node α Active
              </span>
              <span className="text-[10px] font-label-sm text-ink-muted">{publishRatio}% PUB</span>
            </div>
            <p className="text-[10px] font-label-sm text-ink-muted mt-1 truncate">
              {counts.publishedPostsCount} published · {counts.draftPostsCount} drafts
            </p>
            <div
              className="mt-2 w-full bg-hairline-rule h-1 overflow-hidden rounded"
              title={`${publishRatio}% of posts published`}
            >
              <div className="bg-primary h-full transition-all duration-300" style={{ width: `${publishRatio}%` }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-space-sm border-t border-hairline-rule flex justify-center">
          <span
            className="w-2.5 h-2.5 rounded-full bg-emerald-500"
            title={`Node α Active · ${publishRatio}% published`}
          />
        </div>
      )}
    </aside>
  )
}

/**
 * Mobile Navigation Drawer implemented with a native modal <dialog>.
 */
export function AdminMobileDrawer({
  open,
  onClose,
  counts,
}: {
  open: boolean
  onClose: () => void
  counts: AdminSidebarCounts
}) {
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => {
      if (open) onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [open, onClose])

  // Close drawer on route change
  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const links = [
    { href: '/admin', icon: 'space_dashboard', label: 'Dashboard' },
    { href: '/admin/collections/posts', icon: 'edit_note', label: 'Posts', badge: pad(counts.postsCount) },
    { href: '/admin/collections/projects', icon: 'qr_code_2', label: 'Projects', badge: pad(counts.projectsCount) },
    { href: '/admin/collections/topics', icon: 'label', label: 'Topics', badge: pad(counts.topicsCount) },
    { href: '/admin/collections/media', icon: 'photo_library', label: 'Media', badge: counts.mediaCount },
    { href: '/admin/globals/profile', icon: 'person', label: 'Profile' },
    { href: '/admin/globals/current-state', icon: 'sensors', label: 'Current State' },
    { href: '/admin/collections/journey', icon: 'timeline', label: 'Journey' },
    { href: '/admin/globals/site-settings', icon: 'tune', label: 'Site Settings' },
    { href: '/admin/collections/users', icon: 'group', label: 'Users', badge: pad(counts.usersCount) },
  ]

  return (
    <dialog
      ref={dialogRef}
      aria-label="Admin navigation drawer"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      className="m-0 h-[100dvh] max-h-none w-[min(18rem,82vw)] bg-paper-sidebar text-on-surface border-r border-hairline-rule p-0 shadow-2xl"
    >
      <div className="flex flex-col h-full justify-between p-4">
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-hairline-rule">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">radio_button_checked</span>
              <span className="font-headline-sm text-sm text-on-surface">Payload Atelier</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Close navigation menu"
              className="p-1.5 text-ink-muted hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            {links.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded font-label-md text-xs transition-colors ${
                    isActive
                      ? 'bg-amber-wash text-primary font-medium'
                      : 'text-ink-secondary hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-[11px] font-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-ink-muted">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="pt-3 border-t border-hairline-rule text-[11px] font-label-sm text-ink-muted">
          OBSERVATORY NODE α // PALETTE 03
        </div>
      </div>
    </dialog>
  )
}
