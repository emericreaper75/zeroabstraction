'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarNavLinkProps {
  href: string
  icon: string
  label: string
  badge?: React.ReactNode
}

export function SidebarNavLink({ href, icon, label, badge }: SidebarNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`flex items-center justify-between py-1.5 pr-2.5 transition-colors font-label-md pl-2.5 group ${
        isActive
          ? 'bg-[color:var(--sidebar-active-bg)] text-[color:var(--sidebar-fg)] border-l-2 border-[color:var(--sidebar-accent)] font-medium shadow-xs'
          : 'text-[color:var(--sidebar-fg-muted)] hover:bg-[color:var(--sidebar-active-bg)] hover:text-[color:var(--sidebar-fg)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-[color:var(--sidebar-accent)]' : 'text-[color:var(--sidebar-fg-muted)] group-hover:text-[color:var(--sidebar-accent)]'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && badge}
    </Link>
  )
}
