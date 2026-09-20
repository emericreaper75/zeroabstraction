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
          ? 'bg-white text-primary border-l-2 border-primary font-medium shadow-xs'
          : 'text-ink-secondary hover:bg-surface-container-high hover:text-on-surface'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className={`material-symbols-outlined text-[17px] ${isActive ? 'text-primary' : 'text-ink-muted group-hover:text-primary'}`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && badge}
    </Link>
  )
}
