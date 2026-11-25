'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface AdminToastContextValue {
  pushToast: (message: string, variant?: ToastVariant) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const noop = () => {}

const AdminToastContext = createContext<AdminToastContextValue>({
  pushToast: noop,
  success: noop,
  error: noop,
  info: noop,
})

export function useAdminToast() {
  return useContext(AdminToastContext)
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev.slice(-3), { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3600)
  }, [])

  const value: AdminToastContextValue = {
    pushToast,
    success: (m) => pushToast(m, 'success'),
    error: (m) => pushToast(m, 'error'),
    info: (m) => pushToast(m, 'info'),
  }

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-10 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const icon =
            toast.variant === 'success'
              ? 'check_circle'
              : toast.variant === 'error'
                ? 'error'
                : 'info'
          const borderAccent =
            toast.variant === 'success'
              ? 'border-emerald-500/50'
              : toast.variant === 'error'
                ? 'border-rose-500/50'
                : 'border-primary/50'
          const iconColor =
            toast.variant === 'success'
              ? 'text-emerald-500'
              : toast.variant === 'error'
                ? 'text-rose-500'
                : 'text-primary'

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded border ${borderAccent} bg-paper-surface shadow-lg text-on-surface text-xs font-body-sm`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`material-symbols-outlined text-[17px] shrink-0 ${iconColor}`}>
                  {icon}
                </span>
                <span className="truncate">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-ink-muted hover:text-on-surface transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            </div>
          )
        })}
      </div>
    </AdminToastContext.Provider>
  )
}
