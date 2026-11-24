import React from 'react'

export function AdminFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-30 bg-[color:var(--bg-subtle)] border-t border-[color:var(--border)] h-7 flex items-center font-mono">
      <div className="flex justify-between items-center w-full px-space-md max-w-[1440px] mx-auto text-[11px] text-[color:var(--text-muted)]">
        {/* Left: Node Status */}
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" />
          <span className="text-[color:var(--text)]">
            ZEROABSTRACTION CMS // PAYLOAD v3.28.0 // NODE: OBSERVATORY-NORTH-ALPHA
          </span>
        </div>
        {/* Center: Operational Telemetry */}
        <div className="hidden md:flex items-center gap-2 text-[color:var(--text-muted)]">
          <span>POSTGRESQL CONNECTED</span>
          <span>•</span>
          <span>LATENCY 18MS</span>
          <span>•</span>
          <span>REPLICATION IN SYNC</span>
        </div>
        {/* Right: Active Session */}
        <div className="flex items-center gap-2 text-[color:var(--accent-text)] font-medium">
          <span className="hidden sm:inline text-[color:var(--text-muted)] font-normal">LAST SYNC: {new Date().toISOString().slice(11, 16)} UTC •</span>
          <span>ADMIN</span>
        </div>
      </div>
    </footer>
  )
}
