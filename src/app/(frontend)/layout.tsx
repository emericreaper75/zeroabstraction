import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "@/app/globals.css";
import "@/styles/tokens.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/ThemeScript";
import { Title, Label, Body } from "@/components/typography";
import { Header } from "@/components/Header";
import { getSearchIndex, getSiteSettings } from "@/lib/content";
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
  const searchableItems = await getSearchIndex();
  const siteSettings = await getSiteSettings();

  const navLinks = siteSettings?.nav?.length ? siteSettings.nav : [
    { label: 'HOME', url: '/' },
    { label: 'WRITING', url: '/writing' },
    { label: 'PROJECTS', url: '/projects' },
    { label: 'ABOUT', url: '/about' },
  ];
  
  const socialLinks = siteSettings?.social_links ?? [];
  const siteName = siteSettings?.name || "Zero Abstraction";
  const footerText = siteSettings?.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ViewTransitions>
          <div
            className={`${inter.variable} ${cormorant.variable} ${ibmPlexMono.variable} antialiased`}
          >
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <Header searchableItems={searchableItems} navLinks={navLinks} />
                <main className="flex-1">{children}</main>
            <footer className="container-wide py-16">
              <div className="ui-border-t pt-16 flex flex-col lg:flex-row justify-between gap-16">
                
                {/* Brand & Personal Line */}
                <div className="flex flex-col gap-6 lg:w-1/3">
                  <Title as="div">{siteName}</Title>
                  <Body className="text-[color:var(--muted)] max-w-sm">
                    {siteSettings?.short_bio || <>&nbsp;</>}
                  </Body>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-16 lg:gap-32">
                  {/* Navigation */}
                  <div className="flex flex-col gap-4">
                    <Label className="text-[color:var(--muted)] mb-2">NAVIGATION</Label>
                    {navLinks.map((link, i) => (
                      <Link key={i} href={link.url || '#'} className="text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
                        <Label>{link.label?.toUpperCase()}</Label>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Connect */}
                  <div className="flex flex-col gap-4">
                    <Label className="text-[color:var(--muted)] mb-2">CONNECT</Label>
                    {siteSettings?.email && (
                      <a href={`mailto:${siteSettings.email}`} className="text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
                        <Label>EMAIL</Label>
                      </a>
                    )}
                    {socialLinks.map((social, i) => (
                      <a key={i} href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
                        <Label>{social.platform?.toUpperCase()}</Label>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Copyright */}
              <div className="mt-16 flex items-center justify-between">
                <Label className="text-[color:var(--muted)]">
                  {footerText}
                </Label>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </div>
        </ViewTransitions>
      </body>
    </html>
  );
}
