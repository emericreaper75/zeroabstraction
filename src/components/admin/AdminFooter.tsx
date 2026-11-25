'use client'

import React, { useEffect, useState } from 'react'

export function AdminFooter() {
  const [utcTime, setUtcTime] = useState<string>('--:--:--')
  const [online, setOnline] = useState<boolean>(true)

  useEffect(() => {
    const updateClock = () => {
      setUtcTime(new Date().toISOString().slice(11, 19))
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)

    setOnline(navigator.onLine)
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      clearInterval(timer)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <footer className="fixed bottom-0 left-0 w-full z-30 bg-surface-container-low border-t border-hairline-rule h-7 flex items-center">
      <div className="flex justify-between items-center w-full px-space-md max-w-[1440px] mx-auto text-[11px] font-label-sm text-ink-muted">
        {/* Left: Node Status */}
        <div className="flex items-center gap-2 truncate">
          <span
            className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-rose-500'}`}
          />
          <span className="text-ink-secondary font-label-sm">
            {online ? 'Online' : 'Offline'}
          </span>
          <span className="hidden sm:inline text-ink-muted">·</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-ink-muted">
            <span className="material-symbols-outlined text-[13px] text-emerald-500">database</span>
            PG
          </span>
        </div>

        {/* Right: Shortcuts & Live UTC */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('atelier:open-shortcuts'))}
            className="hidden sm:inline-flex items-center gap-1 hover:text-primary transition-colors"
            title="Keyboard shortcuts (?)"
          >
            <span className="material-symbols-outlined text-[13px]">keyboard</span>
            <span>?</span>
          </button>
          <span className="text-primary font-medium">{utcTime} UTC</span>
        </div>
      </div>
    </footer>
  )
}
