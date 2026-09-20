import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminFooter } from '@/components/admin/AdminFooter'
import '@/styles/admin-atelier.css'

export const metadata = {
  title: 'Payload Atelier // ZeroAbstraction',
  description: 'Observatory Editorial Engine — Custom Admin Dashboard',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/login')
  }

  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400;1,6..72,500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper-base text-ink-secondary antialiased font-body-sm min-h-screen selection:bg-amber-wash selection:text-primary">
        <AdminHeader user={user as any} />
        <div className="max-w-[1440px] mx-auto flex w-full min-h-[calc(100vh-5rem)]">
          <AdminSidebar />
          <main className="flex-1 px-5 sm:px-8 py-8 overflow-y-auto max-w-full pb-16 bg-paper-base">
            {children}
          </main>
        </div>
        <AdminFooter />
      </body>
    </html>
  )
}
