import React from 'react'
import type { User } from 'payload'

export function AdminHeader({ user }: { user: User | null }) {
  let initial = 'M'
  let displayName = 'Observer'
  if (user?.email) {
    initial = user.email.charAt(0).toUpperCase()
    displayName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
  }

  return (
    <header className="bg-surface-container-lowest/95 sticky top-0 z-40 border-b border-hairline-rule backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-space-md h-14 max-w-[1440px] mx-auto">
        {/* Brand / Breadcrumb */}
        <div className="flex items-center gap-space-md">
          <a className="font-headline-sm text-lg text-on-surface tracking-tight flex items-center gap-2 group" href="/admin">
            <span className="w-2.5 h-2.5 bg-primary rounded-none inline-block group-hover:rotate-45 transition-transform" />
            <span className="font-headline-md italic font-normal text-on-surface group-hover:text-primary transition-colors">ZeroAbstraction</span>
            <span className="text-label-sm font-label-sm text-ink-muted px-1.5 py-0.5 border border-hairline-rule rounded bg-surface-container-low">v3.28</span>
          </a>
          <span className="hidden sm:inline-block text-hairline-rule font-light">/</span>
          <div className="hidden sm:flex items-center gap-1.5 text-label-sm font-label-sm text-ink-muted">
            <span className="material-symbols-outlined text-[14px] text-primary">satellite_alt</span>
            <span>ATELIER OBSERVATORY NODE</span>
          </div>
        </div>

        {/* Right Utility Controls */}
        <div className="flex items-center gap-space-sm">
          {/* Search */}
          <div className="relative hidden sm:flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-ink-muted text-[16px] pointer-events-none">search</span>
            <input
              className="bg-surface-container-low text-on-surface text-label-sm font-label-sm pl-8 pr-9 py-1.5 rounded border border-hairline-rule focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-56 transition-all placeholder:text-ink-muted"
              placeholder="Search catalog & archives..."
              type="text"
              readOnly
            />
            <span className="absolute right-2 text-[10px] font-label-sm text-ink-muted border border-hairline-rule px-1 py-0.5 bg-white rounded">⌘K</span>
          </div>

          {/* New Entry CTA */}
          <a
            href="/admin/collections/posts"
            className="inline-flex items-center gap-1.5 bg-primary text-white font-label-md text-label-md px-3.5 py-1.5 rounded hover:bg-accent-ochre transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            New Entry
          </a>

          {/* Utility Icons */}
          <div className="flex items-center border-l border-hairline-rule pl-2 ml-1 gap-1 text-ink-secondary">
            <button className="relative p-1.5 text-ink-secondary hover:text-primary transition-colors" title="Notifications">
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 ring-2 ring-white" />
            </button>
            <button className="p-1.5 text-ink-secondary hover:text-primary transition-colors" title="Toggle Display Contrast">
              <span className="material-symbols-outlined text-[19px]">contrast</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-hairline-rule">
            <div className="relative">
              <div className="w-7 h-7 bg-amber-wash border border-primary/40 rounded flex items-center justify-center text-primary font-label-md text-xs font-semibold">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-label-sm font-label-sm text-on-surface font-medium leading-none">{displayName}</span>
              <span className="text-[9px] font-label-sm text-ink-muted leading-tight mt-0.5">ADMIN // CHIEF OBSERVER</span>
            </div>
            <form action="/api/users/logout" method="POST">
              <button
                type="submit"
                className="text-ink-muted hover:text-primary transition-colors flex items-center justify-center ml-1"
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
