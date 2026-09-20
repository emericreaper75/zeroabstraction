import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function UsersCollectionPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'users', limit: 10 })

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
          <div key={user.id} className="border border-hairline-rule bg-white shadow-xs rounded overflow-hidden">
            {/* User Card Header */}
            <div className="bg-paper-surface px-5 py-4 border-b border-hairline-rule flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-wash border border-primary/30 rounded flex items-center justify-center text-primary font-headline-md text-headline-md font-normal">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-medium">{user.email?.split('@')[0] || 'User'}</h3>
                <span className="font-label-sm text-label-sm text-accent-ochre uppercase tracking-widest">SUPERADMIN // CHIEF OBSERVER</span>
              </div>
            </div>
            {/* User Details */}
            <div className="p-5 space-y-4">
              <div className="space-y-2 text-label-sm font-label-sm text-ink-muted">
                <div className="flex justify-between py-1 border-b border-hairline-subtle">
                  <span>Email</span>
                  <span className="text-on-surface font-medium font-mono">{user.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline-subtle">
                  <span>Role</span>
                  <span className="text-primary font-medium">Administrator</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline-subtle">
                  <span>Created</span>
                  <span className="text-on-surface">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-hairline-subtle">
                  <span>Last Login</span>
                  <span className="text-on-surface">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>PG Connection</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Active
                  </span>
                </div>
              </div>

              {/* Security Actions */}
              <div className="pt-3 border-t border-hairline-rule flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-ink-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[14px]">vpn_key</span>
                  Rotate Token
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-ink-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-[14px]">history</span>
                  Audit Log
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
