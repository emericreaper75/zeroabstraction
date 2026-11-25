'use client'

import React, { useEffect, useRef } from 'react'
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
}

/**
 * Slim, transparent left icon rail floating directly on the #F1F5F9 canvas.
 * Active route sits inside a solid dark obsidian circle (#0F172A) with a white icon.
 */
export function AdminSidebarClient({ counts: _counts }: { counts: AdminSidebarCounts }) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { href: '/admin/collections/posts', icon: 'edit_note', label: 'Posts' },
    { href: '/admin/collections/projects', icon: 'qr_code_2', label: 'Projects' },
    { href: '/admin/collections/topics', icon: 'label', label: 'Topics' },
    { href: '/admin/collections/media', icon: 'photo_library', label: 'Media' },
    { href: '/admin/globals/profile', icon: 'person', label: 'Profile' },
    { href: '/admin/globals/current-state', icon: 'sensors', label: 'Current State' },
    { href: '/admin/collections/journey', icon: 'timeline', label: 'Journey' },
    { href: '/admin/globals/site-settings', icon: 'tune', label: 'Site Settings' },
    { href: '/admin/collections/users', icon: 'group', label: 'Users' },
  ]

  return (
    <aside className="w-12 shrink-0 hidden md:flex flex-col items-center py-4 bg-transparent select-none">
      <nav className="flex flex-col items-center gap-2 sticky top-20" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </Link>
          )
        })}
      </nav>
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

  useEffect(() => {
    if (open) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const links = [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
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
      className="m-0 h-[100dvh] max-h-none w-[min(18rem,82vw)] bg-paper-surface text-on-surface p-0 shadow-2xl"
    >
      <div className="flex flex-col h-full justify-between p-5">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline-subtle">
            <span className="font-studio-display font-semibold text-sm text-on-surface">
              ZeroAbstraction
            </span>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Close navigation menu"
              className="p-1.5 text-ink-muted hover:text-on-surface rounded-full"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            {links.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors ${
                    isActive
                      ? 'bg-[#0F172A] text-white font-medium'
                      : 'text-ink-secondary hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="font-mono-telemetry text-[11px] opacity-75">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </dialog>
  )
}
