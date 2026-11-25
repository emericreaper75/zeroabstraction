import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AdminHeader, type AdminNotificationItem } from '@/components/admin/AdminHeader'
import { AdminSidebar, getAdminSidebarCounts } from '@/components/admin/AdminSidebar'
import { AdminToastProvider } from '@/components/admin/AdminToastProvider'
import type { CommandSearchItem } from '@/components/admin/AdminCommandPalette'
import '@/styles/admin-atelier.css'

export const dynamic = 'force-dynamic'

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

  // Hydrate command palette & notification center with live records
  const [counts, postsRes, projectsRes, topicsRes] = await Promise.all([
    getAdminSidebarCounts(),
    payload.find({ collection: 'posts', limit: 30, sort: '-updatedAt', overrideAccess: true }),
    payload.find({ collection: 'projects', limit: 30, sort: '-updatedAt', overrideAccess: true }),
    payload.find({ collection: 'topics', limit: 40, sort: 'name', overrideAccess: true }),
  ])

  const searchItems: CommandSearchItem[] = [
    ...postsRes.docs.map((p: any) => ({
      id: `post-${p.id}`,
      title: p.title || 'Untitled Post',
      subtitle: `/writing/${p.slug || ''}`,
      category: 'post' as const,
      href: `/admin/collections/posts/${p.id}`,
      icon: 'article',
      badge: p.status === 'published' ? 'PUB' : 'DRAFT',
    })),
    ...projectsRes.docs.map((pr: any) => ({
      id: `project-${pr.id}`,
      title: pr.title || 'Untitled Project',
      subtitle: `/projects/${pr.slug || ''}`,
      category: 'project' as const,
      href: `/admin/collections/projects/${pr.id}`,
      icon: 'qr_code_2',
      badge: pr.year ? String(pr.year) : undefined,
    })),
    ...topicsRes.docs.map((t: any) => ({
      id: `topic-${t.id}`,
      title: t.name || 'Topic',
      subtitle: `#${t.slug || ''}`,
      category: 'topic' as const,
      href: '/admin/collections/topics',
      icon: 'label',
      badge: t.type || undefined,
    })),
  ]

  const draftNotifications: AdminNotificationItem[] = postsRes.docs
    .filter((p: any) => p.status !== 'published')
    .slice(0, 4)
    .map((p: any) => ({
      id: `draft-${p.id}`,
      title: p.title || 'Untitled Draft',
      meta: `Draft awaiting review · /writing/${p.slug || ''}`,
      href: `/admin/collections/posts/${p.id}`,
      kind: 'draft',
    }))

  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('payload-admin-theme');var t=s==='light'||s==='dark'?s:'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.className=t;document.documentElement.style.colorScheme=t;var m=document.querySelector('meta[name=\"color-scheme\"]');if(m)m.setAttribute('content',t);}catch(e){}})();",
          }}
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="admin-simple-text bg-paper-base text-ink-primary antialiased min-h-screen selection:bg-amber-wash selection:text-on-surface">
        <AdminToastProvider>
          <AdminHeader
            user={user as any}
            searchItems={searchItems}
            counts={counts}
            notifications={draftNotifications}
          />
          <div className="max-w-[1440px] mx-auto flex w-full min-h-[calc(100vh-4rem)] px-3 sm:px-6 gap-2 sm:gap-4">
            <AdminSidebar />
            <main className="flex-1 py-5 sm:py-6 overflow-y-auto max-w-full pb-10 bg-transparent">
              {children}
            </main>
          </div>
        </AdminToastProvider>
      </body>
    </html>
  )
}
