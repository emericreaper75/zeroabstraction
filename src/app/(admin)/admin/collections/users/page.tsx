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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {result.docs.map((user: any) => (
          <div key={user.id} className="bg-paper-surface rounded-[20px] p-6 space-y-5">
            {/* User Card Header */}
            <div className="pb-4 border-b border-[#F1F5F9] dark:border-zinc-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EFF6FF] dark:bg-blue-950/50 rounded-full flex items-center justify-center text-[#2563EB] dark:text-blue-300 font-studio-display text-[18px] font-semibold">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className="font-studio-display text-[16px] text-on-surface font-semibold">{user.email?.split('@')[0] || 'User'}</h3>
                <span className="font-mono-telemetry text-[10px] font-semibold text-[#2563EB] dark:text-blue-300 uppercase tracking-[0.06em]">SUPERADMIN // CHIEF OBSERVER</span>
              </div>
            </div>
            {/* User Details */}
            <div className="space-y-3">
              <div className="space-y-2 text-[13px] text-ink-secondary">
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Email</span>
                  <span className="text-on-surface font-medium font-mono-telemetry">{user.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Role</span>
                  <span className="text-on-surface font-medium">Administrator</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Created</span>
                  <span className="text-on-surface font-mono-telemetry text-[12px]">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Last Login</span>
                  <span className="text-on-surface font-mono-telemetry text-[12px]">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>PG Connection</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>

              {/* Single-Owner Security Policy */}
              <div className="pt-3 border-t border-[#F1F5F9] dark:border-zinc-800 flex items-center justify-between text-ink-muted">
                <span className="font-mono-telemetry text-[10px] uppercase tracking-[0.06em] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-ink-secondary">lock</span>
                  Single-Owner Enforced
                </span>
                <span className="font-mono-telemetry text-[11px] text-ink-secondary bg-[#F8FAFC] dark:bg-zinc-900 px-2.5 py-1 rounded-full">
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
