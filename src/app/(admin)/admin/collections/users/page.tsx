import { requireUser } from '@/lib/auth'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function UsersCollectionPage() {
  await requireUser();

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'users', limit: 10, overrideAccess: true })

  return (
    <div className="flex flex-col w-full pb-12 space-y-5">
      <header className="space-y-1">
        <div className="typo-breadcrumb">Observatory / System / Users</div>
        <h1 className="typo-page-title text-on-surface">Users &amp; Access Control</h1>
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
                <h2 className="typo-card-title text-on-surface">{user.email?.split('@')[0] || 'User'}</h2>
                <span className="typo-pill text-[#2563EB] dark:text-blue-300">SUPERADMIN</span>
              </div>
            </div>
            {/* User Details */}
            <div className="space-y-3">
              <div className="space-y-2 text-[13px] text-[#475569] dark:text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Email</span>
                  <span className="text-on-surface font-mono-telemetry text-[12px]">{user.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Role</span>
                  <span className="text-on-surface font-medium">Administrator</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Created</span>
                  <span className="typo-mono-data">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F1F5F9] dark:border-zinc-800">
                  <span>Last Login</span>
                  <span className="typo-mono-data">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>PG Connection</span>
                  <span className="typo-pill inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/50 dark:text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

              {/* Single-Owner Security Policy */}
              <div className="pt-3 border-t border-[#F1F5F9] dark:border-zinc-800 flex items-center justify-between text-[#475569] dark:text-slate-400">
                <span className="typo-label flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  Single-Owner Enforced
                </span>
                <span className="typo-mono-data bg-[#F8FAFC] dark:bg-zinc-900 px-2.5 py-1 rounded-full">
                  V1 Principal
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
