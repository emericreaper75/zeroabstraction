import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SidebarNavLink } from './SidebarNavLink'

export async function AdminSidebar() {
  const payload = await getPayload({ config: configPromise })

  const [postsCount, projectsCount, mediaCount, topicsCount, usersCount] = await Promise.all([
    payload.count({ collection: 'posts' }).then(res => res.totalDocs),
    payload.count({ collection: 'projects' }).then(res => res.totalDocs),
    payload.count({ collection: 'media' }).then(res => res.totalDocs),
    payload.count({ collection: 'topics' }).then(res => res.totalDocs),
    payload.count({ collection: 'users' }).then(res => res.totalDocs),
  ])

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <aside className="w-60 shrink-0 bg-[color:var(--sidebar-bg)] border-r border-[color:var(--sidebar-border)] text-[color:var(--sidebar-fg)] flex-col justify-between py-space-md px-space-sm hidden md:flex">
      <div className="space-y-space-md">
        {/* Section Node Tag */}
        <div className="px-space-sm pb-3 border-b border-[color:var(--sidebar-border)]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[color:var(--sidebar-accent)] text-[18px]">radio_button_checked</span>
            <span className="font-headline-sm text-sm text-[color:var(--sidebar-fg)] tracking-tight font-normal">Payload Atelier</span>
          </div>
          <p className="text-label-sm font-label-sm text-[color:var(--sidebar-fg-muted)] mt-0.5">EPOCH 2025.2 // v4.12.0</p>
        </div>

        {/* Collections */}
        <div className="px-space-sm pt-0.5">
          <span className="text-[10px] font-label-sm text-[color:var(--sidebar-fg-muted)] tracking-widest uppercase font-semibold">COLLECTIONS</span>
        </div>
        <nav className="space-y-1">
          <SidebarNavLink
            href="/admin"
            icon="space_dashboard"
            label="Dashboard"
          />
          <SidebarNavLink
            href="/admin/collections/posts"
            icon="edit_note"
            label="Posts"
            badge={<span className="text-label-sm font-label-sm text-[color:var(--sidebar-fg)] bg-[color:var(--sidebar-active-bg)] px-1.5 py-0.5 border border-[color:var(--sidebar-border)] rounded">{pad(postsCount)}</span>}
          />
          <SidebarNavLink
            href="/admin/collections/projects"
            icon="qr_code_2"
            label="Projects"
            badge={<span className="text-label-sm font-label-sm text-[color:var(--sidebar-fg-muted)] bg-[color:var(--sidebar-active-bg)] px-1.5 py-0.5 border border-[color:var(--sidebar-border)] rounded">{pad(projectsCount)}</span>}
          />
          <SidebarNavLink
            href="/admin/collections/topics"
            icon="label"
            label="Topics"
            badge={<span className="text-label-sm font-label-sm text-[color:var(--sidebar-fg-muted)] bg-[color:var(--sidebar-active-bg)] px-1.5 py-0.5 border border-[color:var(--sidebar-border)] rounded">{pad(topicsCount)}</span>}
          />
          <SidebarNavLink
            href="/admin/collections/media"
            icon="photo_library"
            label="Media"
            badge={<span className="text-label-sm font-label-sm text-[color:var(--sidebar-fg-muted)] bg-[color:var(--sidebar-active-bg)] px-1.5 py-0.5 border border-[color:var(--sidebar-border)] rounded">{mediaCount}</span>}
          />

          <div className="my-2.5 border-t border-[color:var(--sidebar-border)]" />

          {/* System & Globals */}
          <SidebarNavLink href="/admin/globals/profile" icon="person" label="Profile" />
          <SidebarNavLink
            href="/admin/globals/current-state"
            icon="sensors"
            label="Current State"
            badge={<span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--sidebar-accent)] opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--sidebar-accent)]" /></span>}
          />
          <SidebarNavLink href="/admin/collections/journey" icon="timeline" label="Journey" />

          <div className="my-2.5 border-t border-[color:var(--sidebar-border)]" />

          <SidebarNavLink href="/admin/globals/site-settings" icon="tune" label="Site Settings" />
          <SidebarNavLink
            href="/admin/collections/users"
            icon="group"
            label="Users"
            badge={<span className="text-label-sm font-label-sm text-[color:var(--sidebar-fg-muted)] bg-[color:var(--sidebar-active-bg)] px-1.5 py-0.5 border border-[color:var(--sidebar-border)] rounded">{pad(usersCount)}</span>}
          />
        </nav>
      </div>

      {/* Bottom */}
      <div className="space-y-space-sm pt-space-sm border-t border-[color:var(--sidebar-border)]">
        <div className="p-2.5 bg-[color:var(--sidebar-active-bg)] border border-[color:var(--sidebar-border)] rounded">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-label-sm text-[color:var(--sidebar-fg)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)] inline-block" />
              Node α Active
            </span>
            <span className="text-[10px] font-label-sm text-[color:var(--sidebar-fg-muted)]">v3.x</span>
          </div>
          <p className="text-[10px] font-label-sm text-[color:var(--sidebar-fg-muted)] mt-1 truncate">Observatory Node α // Light Engine</p>
          <div className="mt-2 w-full bg-[color:var(--sidebar-border)] h-1 overflow-hidden rounded">
            <div className="bg-[color:var(--sidebar-accent)] h-full w-3/4" />
          </div>
        </div>
      </div>
    </aside>
  )
}
