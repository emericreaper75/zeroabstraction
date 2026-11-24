import React from 'react'

export function AdminFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-30 bg-surface-container-low border-t border-hairline-rule h-7 flex items-center">
      <div className="flex justify-between items-center w-full px-space-md max-w-[1440px] mx-auto text-[11px] font-label-sm text-ink-muted">
        {/* Left: Node Status */}
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span className="text-ink-secondary font-label-sm">
            ZEROABSTRACTION CMS // PAYLOAD v3.28.0 // NODE: OBSERVATORY-NORTH-ALPHA
          </span>
        </div>
        {/* Center: Operational Telemetry */}
        <div className="hidden md:flex items-center gap-2 text-ink-muted">
          <span>POSTGRESQL CONNECTED</span>
          <span>•</span>
          <span>LATENCY 18MS</span>
          <span>•</span>
          <span>REPLICATION IN SYNC</span>
        </div>
        {/* Right: Active Session */}
        <div className="flex items-center gap-2 text-primary font-label-sm font-medium">
          <span className="hidden sm:inline text-ink-muted font-normal">LAST SYNC: {new Date().toISOString().slice(11, 16)} UTC •</span>
          <span>ADMIN</span>
        </div>
      </div>
    </footer>
  )
}
