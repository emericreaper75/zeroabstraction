import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function UsersCollectionPage() {
  await requireUser();

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'users', limit: 10, overrideAccess: true })

  return (
    <div className="flex flex-col w-full pb-12 space-y-8">
      <header className="flex flex-col space-y-4 pt-4">
        <div className="flex items-center space-x-2 font-label-sm text-label-sm text-ink-muted">
          <span>OBSERVATORY</span><span>/</span><span>SYSTEM</span><span>/</span>
          <span className="text-on-surface font-medium tracking-wide">USERS &amp; ACCESS</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-2xl space-y-1">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none">Users &amp; Access Control</h1>
            <p className="font-body-md text-body-md text-ink-secondary leading-normal">Single-operator principal monitor and security configuration.</p>
          </div>
        </div>
      </header>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.docs.map((user: any) => (
          <div key={user.id} className="border border-[color:var(--border)] bg-[color:var(--bg-subtle)] shadow-xs rounded overflow-hidden">
            {/* User Card Header */}
            <div className="bg-[color:var(--surface)] px-5 py-4 border-b border-[color:var(--border)] flex items-center gap-4">
              <div className="w-14 h-14 bg-[color:var(--accent-subtle)] border border-[color:var(--accent-border)] rounded flex items-center justify-center text-[color:var(--accent-text)] font-headline-md text-headline-md font-normal">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-[color:var(--text)] font-medium">{user.email?.split('@')[0] || 'User'}</h3>
                <span className="font-label-sm text-label-sm text-[color:var(--accent-text)] uppercase tracking-widest">SUPERADMIN // CHIEF OBSERVER</span>
              </div>
            </div>
            {/* User Details */}
            <div className="p-5 space-y-4">
              <div className="space-y-2 text-label-sm font-label-sm text-[color:var(--text-muted)]">
                <div className="flex justify-between py-1 border-b border-[color:var(--border)]">
                  <span>Email</span>
                  <span className="text-[color:var(--text)] font-medium font-mono">{user.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[color:var(--border)]">
                  <span>Role</span>
                  <span className="text-[color:var(--accent-text)] font-medium">Administrator</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[color:var(--border)]">
                  <span>Created</span>
                  <span className="text-[color:var(--text)]">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[color:var(--border)]">
                  <span>Last Login</span>
                  <span className="text-[color:var(--text)]">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>PG Connection</span>
                  <span className="flex items-center gap-1 text-[color:var(--success)] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" />
                    Active
                  </span>
                </div>
              </div>

              {/* Single-Owner Security Policy */}
              <div className="pt-3 border-t border-[color:var(--border)] flex items-center justify-between text-[color:var(--text-muted)]">
                <span className="font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[color:var(--warning)]">lock</span>
                  Single-Owner Enforced
                </span>
                <span className="font-mono text-xs text-[color:var(--text)] bg-[color:var(--surface)] px-2 py-0.5 rounded">
                  V1 Single Principal
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
