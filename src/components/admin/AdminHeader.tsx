'use client'

import React, { useEffect, useState } from 'react'
import type { User } from 'payload'

export function AdminHeader({ user }: { user: User | null }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
  }, [])
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.style.colorScheme = next
    localStorage.setItem('payload-admin-theme', next)
  }
  let initial = 'M'
  let displayName = 'Observer'
  if (user?.email) {
    initial = user.email.charAt(0).toUpperCase()
    displayName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
  }

  return (
    <header className="bg-[color:var(--bg-subtle)]/95 sticky top-0 z-40 border-b border-[color:var(--border)] backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-space-md h-14 max-w-[1440px] mx-auto text-[color:var(--text)]">
        {/* Brand / Breadcrumb */}
        <div className="flex items-center gap-space-md">
          <a className="font-headline-sm text-lg text-[color:var(--text)] tracking-tight flex items-center gap-2 group" href="/admin">
            <span className="w-2.5 h-2.5 bg-[color:var(--accent)] rounded-none inline-block group-hover:rotate-45 transition-transform" />
            <span className="font-headline-md italic font-normal text-[color:var(--text)] group-hover:text-[color:var(--accent-text)] transition-colors">ZeroAbstraction</span>
            <span className="text-label-sm font-label-sm text-[color:var(--text-muted)] px-1.5 py-0.5 border border-[color:var(--border)] rounded bg-[color:var(--bg)]">v3.28</span>
          </a>
          <span className="hidden sm:inline-block text-[color:var(--border)] font-light">/</span>
          <div className="hidden sm:flex items-center gap-1.5 text-label-sm font-label-sm text-[color:var(--text-muted)]">
            <span className="material-symbols-outlined text-[14px] text-[color:var(--accent-text)]">satellite_alt</span>
            <span>ATELIER OBSERVATORY NODE</span>
          </div>
        </div>

        {/* Right Utility Controls */}
        <div className="flex items-center gap-space-sm">
          {/* Search */}
          <div className="relative hidden sm:flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[color:var(--text-muted)] text-[16px] pointer-events-none">search</span>
            <input
              className="bg-[color:var(--bg)] text-[color:var(--text)] text-label-sm font-label-sm pl-8 pr-9 py-1.5 rounded border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--focus-ring)] focus:border-[color:var(--accent-text)] w-56 transition-all placeholder:text-[color:var(--text-muted)]"
              placeholder="Search catalog & archives..."
              type="text"
              readOnly
            />
            <span className="absolute right-2 text-[10px] font-label-sm text-[color:var(--text-muted)] border border-[color:var(--border)] px-1 py-0.5 bg-[color:var(--bg-subtle)] rounded">⌘K</span>
          </div>

          {/* New Entry CTA */}
          <a
            href="/admin/collections/posts"
            className="inline-flex items-center gap-1.5 bg-[color:var(--accent)] text-[color:var(--on-accent)] font-label-md text-label-md px-3.5 py-1.5 rounded hover:bg-[color:var(--accent-hover)] transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            New Entry
          </a>

          {/* Utility Icons */}
          <div className="flex items-center border-l border-[color:var(--border)] pl-2 ml-1 gap-1 text-[color:var(--text-muted)]">
            <button className="relative p-1.5 text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors" title="Notifications">
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[color:var(--success)] ring-2 ring-[color:var(--bg)]" />
            </button>
            <button type="button" onClick={toggleTheme} className="p-1.5 text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors" title="Toggle Display Contrast" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              <span className="material-symbols-outlined text-[19px]">contrast</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[color:var(--border)]">
            <div className="relative">
              <div className="w-7 h-7 bg-[color:var(--accent-subtle)] border border-[color:var(--accent-border)] rounded flex items-center justify-center text-[color:var(--accent-text)] font-label-md text-xs font-semibold">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[color:var(--success)] border border-[color:var(--bg)]" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-label-sm font-label-sm text-[color:var(--text)] font-medium leading-none">{displayName}</span>
              <span className="text-[9px] font-label-sm text-[color:var(--text-muted)] leading-tight mt-0.5">ADMIN // CHIEF OBSERVER</span>
            </div>
            <form action="/api/users/logout" method="POST">
              <button
                type="submit"
                className="text-[color:var(--text-muted)] hover:text-[color:var(--accent-text)] transition-colors flex items-center justify-center ml-1"
                title="Disconnect"
              >
                <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
