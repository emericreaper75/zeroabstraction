'use client'

import React from 'react'

export interface LoginToastMessage {
  id: number
  text: string
  tone?: 'info' | 'success' | 'warning'
}

interface LoginToastProps {
  toasts: LoginToastMessage[]
  onDismiss: (id: number) => void
}

export function LoginToast({ toasts, onDismiss }: LoginToastProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-10 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const dotColor =
          toast.tone === 'success'
            ? 'bg-emerald-500'
            : toast.tone === 'warning'
              ? 'bg-amber-500'
              : 'bg-[var(--admin-primary)]'

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] bg-[var(--admin-paper-surface)] border border-[var(--admin-hairline-rule)] shadow-lg text-[var(--admin-ink-primary)] text-[12px] font-medium"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
              <span className="truncate">{toast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-[var(--admin-ink-muted)] hover:text-[var(--admin-ink-primary)] transition-colors shrink-0 p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            >
              <span className="material-symbols-outlined text-[15px] leading-none">close</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
