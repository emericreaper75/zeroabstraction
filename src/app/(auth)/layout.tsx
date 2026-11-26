import React from 'react'
import '@/styles/admin-atelier.css'

export const metadata = {
  title: 'Observatory Sign In // ZeroAbstraction',
  description: 'Authenticate into the ZeroAbstraction Observatory Editorial Console',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <body className="admin-simple-text antialiased min-h-dvh flex flex-col justify-between overflow-x-hidden bg-[var(--admin-paper-base)] text-[var(--admin-ink-primary)] selection:bg-[var(--admin-amber-wash)] selection:text-[var(--admin-ink-primary)]">
        {children}
      </body>
    </html>
  )
}
