'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminDialog } from './AdminDialog'

export interface CommandSearchItem {
  id: string
  title: string
  subtitle?: string
  category: 'post' | 'project' | 'topic' | 'route' | 'action'
  href: string
  icon: string
  badge?: string
}

const STATIC_ROUTES: CommandSearchItem[] = [
  { id: 'route-dashboard', title: 'Observatory Dashboard', subtitle: '/admin', category: 'route', href: '/admin', icon: 'space_dashboard' },
  { id: 'route-posts', title: 'Posts & Treatises', subtitle: '/admin/collections/posts', category: 'route', href: '/admin/collections/posts', icon: 'edit_note' },
  { id: 'route-new-post', title: 'Create New Post', subtitle: 'Draft a new astronomical or engineering treatise', category: 'action', href: '/admin/collections/posts/new', icon: 'add_circle', badge: 'ACTION' },
  { id: 'route-projects', title: 'Projects & Rigs', subtitle: '/admin/collections/projects', category: 'route', href: '/admin/collections/projects', icon: 'rocket_launch' },
  { id: 'route-new-project', title: 'Log New Project Rig', subtitle: 'Add instrumentation or software project', category: 'action', href: '/admin/collections/projects/new', icon: 'rocket_launch', badge: 'ACTION' },
  { id: 'route-topics', title: 'Topics & Taxonomy', subtitle: '/admin/collections/topics', category: 'route', href: '/admin/collections/topics', icon: 'label' },
  { id: 'route-media', title: 'Media & Plates Archive', subtitle: '/admin/collections/media', category: 'route', href: '/admin/collections/media', icon: 'photo_library' },
  { id: 'route-current-state', title: 'Current State Telemetry', subtitle: '/admin/globals/current-state', category: 'route', href: '/admin/globals/current-state', icon: 'sensors' },
  { id: 'route-journey', title: 'Journey Timeline', subtitle: '/admin/collections/journey', category: 'route', href: '/admin/collections/journey', icon: 'timeline' },
  { id: 'route-profile', title: 'Observer Profile', subtitle: '/admin/globals/profile', category: 'route', href: '/admin/globals/profile', icon: 'person' },
  { id: 'route-settings', title: 'Site Settings', subtitle: '/admin/globals/site-settings', category: 'route', href: '/admin/globals/site-settings', icon: 'tune' },
  { id: 'route-users', title: 'Users & Access Control', subtitle: '/admin/collections/users', category: 'route', href: '/admin/collections/users', icon: 'group' },
  { id: 'route-public', title: 'Open Public Site', subtitle: 'View live ZeroAbstraction frontend', category: 'action', href: '/', icon: 'open_in_new', badge: 'SITE' },
]

interface AdminCommandPaletteProps {
  open: boolean
  onClose: () => void
  onOpen: () => void
  onOpenShortcuts: () => void
  items: CommandSearchItem[]
}

export function AdminCommandPalette({
  open,
  onClose,
  onOpen,
  onOpenShortcuts,
  items,
}: AdminCommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'post' | 'project' | 'topic' | 'route'>('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const chordRef = useRef<string | null>(null)
  const chordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allItems = useMemo(() => [...STATIC_ROUTES, ...items], [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allItems
      .filter((item) => {
        if (categoryFilter !== 'all') {
          if (categoryFilter === 'route') {
            if (item.category !== 'route' && item.category !== 'action') return false
          } else if (item.category !== categoryFilter) {
            return false
          }
        }
        if (!q) return true
        return (
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
        )
      })
      .slice(0, 14)
  }, [allItems, query, categoryFilter])

  useEffect(() => {
    setActiveIndex(0)
  }, [query, categoryFilter, open])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCategoryFilter('all')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Global keyboard shortcuts: Cmd/Ctrl+K, ?, and g-chords
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) onClose()
        else onOpen()
        return
      }

      if (isTyping || open) return

      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        onOpenShortcuts()
        return
      }

      const key = e.key.toLowerCase()
      if (chordRef.current === 'g') {
        chordRef.current = null
        if (chordTimerRef.current) clearTimeout(chordTimerRef.current)
        const map: Record<string, string> = {
          d: '/admin',
          p: '/admin/collections/posts',
          r: '/admin/collections/projects',
          m: '/admin/collections/media',
          t: '/admin/collections/topics',
          s: '/admin/globals/current-state',
          j: '/admin/collections/journey',
        }
        if (map[key]) {
          e.preventDefault()
          router.push(map[key])
        }
        return
      }

      if (key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        chordRef.current = 'g'
        if (chordTimerRef.current) clearTimeout(chordTimerRef.current)
        chordTimerRef.current = setTimeout(() => {
          chordRef.current = null
        }, 900)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, onOpen, onOpenShortcuts, router])

  const handleNavigate = (item: CommandSearchItem) => {
    onClose()
    if (item.href === '/') {
      window.open('/', '_blank', 'noopener,noreferrer')
    } else {
      router.push(item.href)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      e.preventDefault()
      handleNavigate(filtered[activeIndex])
    }
  }

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      labelledBy="cmd-palette-title"
      className="w-[min(640px,94vw)] mt-[10vh] mb-auto overflow-hidden"
    >
      <div className="flex flex-col bg-paper-surface">
        <h2 id="cmd-palette-title" className="sr-only">
          Observatory Command Palette
        </h2>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline-rule bg-surface-container-low">
          <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
          <input
            ref={inputRef}
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Jump to post, project, topic, or command..."
            aria-label="Search observatory catalog and commands"
            className="flex-1 bg-transparent text-sm font-body-md text-on-surface placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-label-sm text-ink-muted border border-hairline-rule px-1.5 py-0.5 rounded hover:text-on-surface"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-hairline-subtle bg-paper-surface overflow-x-auto">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'post', label: 'Posts' },
              { key: 'project', label: 'Projects' },
              { key: 'topic', label: 'Topics' },
              { key: 'route', label: 'Navigation' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setCategoryFilter(tab.key)}
              className={`px-2.5 py-1 rounded text-[11px] font-label-sm transition-colors whitespace-nowrap ${
                categoryFilter === tab.key
                  ? 'bg-amber-wash text-primary font-medium border border-primary/30'
                  : 'text-ink-muted hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <ul className="max-h-[360px] overflow-y-auto divide-y divide-hairline-subtle" role="listbox">
          {filtered.map((item, idx) => {
            const isSelected = idx === activeIndex
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-amber-wash/70' : 'hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 ${
                        isSelected ? 'text-primary' : 'text-ink-muted'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-on-surface truncate">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-[11px] font-label-sm text-ink-muted truncate">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-ink-secondary uppercase">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-label-sm text-ink-muted uppercase">{item.category}</span>
                  </div>
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-xs text-ink-muted font-body-sm">
              No matching records or commands for &ldquo;{query}&rdquo;.
            </li>
          )}
        </ul>

        {/* Footer Hints */}
        <div className="px-4 py-2 border-t border-hairline-rule bg-surface-container-low flex items-center justify-between text-[11px] font-label-sm text-ink-muted">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>ESC Close</span>
          </div>
          <span>ATELIER COMMAND INDEX</span>
        </div>
      </div>
    </AdminDialog>
  )
}

export function AdminShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const shortcuts = [
    { keys: '⌘K / Ctrl+K', desc: 'Open Observatory Command Palette' },
    { keys: '?', desc: 'Open Keyboard Shortcuts Cheatsheet' },
    { keys: 'G then D', desc: 'Go to Dashboard Overview' },
    { keys: 'G then P', desc: 'Go to Posts & Treatises' },
    { keys: 'G then R', desc: 'Go to Projects & Rigs' },
    { keys: 'G then M', desc: 'Go to Media & Plates' },
    { keys: 'G then T', desc: 'Go to Topics & Taxonomy' },
    { keys: 'G then S', desc: 'Go to Current State Telemetry' },
    { keys: '⌘S / Ctrl+S', desc: 'Save active Editor document' },
  ]

  return (
    <AdminDialog open={open} onClose={onClose} labelledBy="shortcuts-title" className="w-[min(480px,92vw)]">
      <div className="p-5 bg-paper-surface">
        <div className="flex items-center justify-between pb-3 border-b border-hairline-rule mb-4">
          <h1 id="shortcuts-title" className="font-headline-sm text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">keyboard</span>
            Observatory Shortcuts
          </h1>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="p-1 text-ink-muted hover:text-on-surface rounded transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <ul className="divide-y divide-hairline-subtle">
          {shortcuts.map((s) => (
            <li key={s.keys} className="py-2 flex items-center justify-between gap-4 text-xs">
              <span className="text-ink-secondary">{s.desc}</span>
              <kbd className="font-label-sm px-2 py-0.5 rounded bg-surface-container-low border border-hairline-rule text-on-surface shrink-0">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </AdminDialog>
  )
}
