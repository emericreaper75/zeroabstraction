import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "@/app/globals.css";
import "@/styles/tokens.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { BackToTop } from "@/components/BackToTop";
import { getSiteSettings } from "@/lib/content";
import { ViewTransitions } from 'next-view-transitions';
import Link from 'next/link';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zero Abstraction",
  description: "Exploring the intersections of theoretical physics, electrical engineering, and the cosmos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  const navLinks = siteSettings?.nav?.length ? siteSettings.nav : [
    { label: 'HOME', url: '/' },
    { label: 'PROJECTS', url: '/projects' },
    { label: 'WRITING', url: '/writing' },
    { label: 'ABOUT', url: '/about' },
  ];
  
  const socialLinks = siteSettings?.social_links ?? [];
  const siteName = siteSettings?.name || "ZeroAbstraction";
  const siteTagline = siteSettings?.short_bio || "Digital garden & research universe exploring physics, ECE, and astrophysics.";
  const footerText = siteSettings?.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="color-scheme" content="light dark" />
          <ThemeScript />
        </head>
        <body>
          <div
            className={`${inter.variable} ${cormorant.variable} ${ibmPlexMono.variable} antialiased`}
          >
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <a href="#main-content" className="skip-link visually-hidden">
                  Skip to main content
                </a>
                <Header navLinks={navLinks} />
                <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
                <BackToTop />
            <footer className="container-wide py-16 border-t border-[color:var(--border)]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
                
                {/* Column 1 (Left): Brand + Tagline */}
                <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light text-[color:var(--text)]">
                      {siteName}
                    </span>
                    <p className="text-[color:var(--text-muted)] text-sm max-w-sm leading-relaxed font-sans">
                      {siteTagline}
                    </p>
                  </div>
                </div>
                
                {/* Column 2 (Center-Right): Navigation */}
                <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-4">
                  <span className="font-mono text-xs tracking-widest text-[color:var(--text-muted)] uppercase">
                    NAVIGATION
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <Link href="/" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                      HOME
                    </Link>
                    <Link href="/projects" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                      PROJECTS
                    </Link>
                    <Link href="/writing" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                      WRITING
                    </Link>
                    <Link href="/about" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                      ABOUT
                    </Link>
                    <Link href="/search" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                      SEARCH
                    </Link>
                  </div>
                  <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-[color:var(--text-muted)]">
                    <kbd className="px-1.5 py-0.5 border border-[color:var(--border)] rounded-[var(--radius-s)]">⌘K</kbd>
                    <span>QUICK SEARCH</span>
                  </div>
                </div>

                {/* Column 3 (Right): Connect */}
                <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-4">
                  <span className="font-mono text-xs tracking-widest text-[color:var(--text-muted)] uppercase">
                    CONNECT
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {siteSettings?.email ? (
                      <a href={`mailto:${siteSettings.email}`} className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                        EMAIL
                      </a>
                    ) : (
                      <a href="mailto:contact@zeroabstraction.com" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                        EMAIL
                      </a>
                    )}
                    {socialLinks.length > 0 ? (
                      socialLinks
                        .filter((social) => Boolean(social.url && social.url !== '#'))
                        .map((social, i) => (
                          <a
                            key={i}
                            href={social.url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors"
                            style={{ textDecoration: 'none' }}
                          >
                            {social.platform?.toUpperCase()}
                          </a>
                        ))
                    ) : (
                      <>
                        <a href="https://github.com/manoj-amavasya" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                          GITHUB
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-wider text-[color:var(--text)] hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
                          LINKEDIN
                        </a>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Domain Filter Tag Strip & Copyright Bar */}
              <div className="mt-12 pt-6 border-t border-[color:var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center flex-wrap gap-2 font-mono text-[11px] tracking-wider">
                  {[
                    { tag: '#ASTROPHYSICS', q: 'astrophysics' },
                    { tag: '#FPGA', q: 'fpga' },
                    { tag: '#EMBEDDED', q: 'embedded' },
                    { tag: '#RAY-TRACING', q: 'ray' },
                  ].map((item) => (
                    <Link
                      key={item.tag}
                      href={`/search?q=${encodeURIComponent(item.q)}`}
                      style={{ textDecoration: 'none' }}
                      className="px-2.5 py-1 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[color:var(--text-muted)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--accent-text)] transition-colors"
                    >
                      {item.tag}
                    </Link>
                  ))}
                </div>
                <p className="font-mono text-xs text-[color:var(--text-muted)]">
                  {footerText}
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </div>
      </body>
    </html>
  </ViewTransitions>
  );
}
