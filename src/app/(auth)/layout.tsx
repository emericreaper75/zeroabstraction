import React from 'react'
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/admin-atelier.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

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
    <html
      lang="en"
      className={`light ${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('payload-admin-theme');var t=s==='light'||s==='dark'?s:'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;var m=document.querySelector('meta[name=\"color-scheme\"]');if(m)m.setAttribute('content',t);}catch(e){}})();",
          }}
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
