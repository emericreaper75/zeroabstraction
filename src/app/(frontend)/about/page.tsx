import type { Metadata } from 'next';
import { Display, Title, Label } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { getProfile, getSiteSettings } from '@/lib/content';
import { RichTextRenderer } from '@/components/RichTextRenderer';

export const metadata: Metadata = {
  title: 'About — ZeroAbstraction',
  description:
    'Manoj Amavasya — Electronics and Communication Engineering undergraduate building a foundation for research in Physics, Astrophysics, and Scientific Computing.',
};

const LEDGER_ENTRIES = [
  {
    category: 'EDUCATION',
    title: 'B.Tech in Electronics & Communication Engineering — JNTU Anantapur',
    meta: '2023 – 2027',
  },
  {
    category: 'FOCUS',
    title: 'Embedded Readout Systems, Digital Signal Processing & Computational Astrophysics',
    meta: 'ONGOING',
  },
  {
    category: 'OPEN SOURCE',
    title: 'ZeroAbstraction Digital Garden, FPGA DSP Cores & Lensing Ray-Tracing Notes',
    meta: 'GITHUB ↗',
    href: 'https://github.com/manoj-amavasya',
  },
];

export default async function AboutPage() {
  const [profile, siteSettings] = await Promise.all([
    getProfile().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  const profileImgUrl =
    typeof profile?.photograph === 'object' && profile?.photograph?.url
      ? profile.photograph.url
      : '/images/admin/portrait_manoj.png';
  const profileImgAlt =
    typeof profile?.photograph === 'object' && profile?.photograph?.alt_text
      ? profile?.photograph.alt_text
      : 'Manoj Amavasya — Researcher';

  return (
    <div className="container-wide pb-20 pt-12 md:pt-16">
      <div className="flex flex-col gap-3 pb-10 mb-10 border-b border-[color:var(--border)]">
        <Label className="text-[color:var(--accent-text)] tracking-widest">
          ABOUT ZEROABSTRACTION
        </Label>
        <Display>Researcher</Display>
      </div>

      {/* 2-Column Editorial Spread: 35% Sticky Spec Rail / 65% Prose Column */}
      <div className="grid grid-cols-1 lg:grid-cols-[35fr_65fr] gap-10 lg:gap-14 items-start">
        {/* Left Sticky Spec Rail (35%) */}
        <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
          <figure className="w-full overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--surface)]">
            <ProjectImage
              src={profileImgUrl}
              alt={profileImgAlt}
              width={600}
              height={720}
              className="w-full h-auto object-cover"
              priority
            />
          </figure>

          {/* Compact Monospace Coordinate & Toolkit Spec Block */}
          <div className="border border-[color:var(--border)] bg-[color:var(--bg-subtle)]/60 rounded-[var(--radius-s)] p-5 flex flex-col gap-3 font-mono text-xs">
            <div className="flex flex-col gap-1 pb-2.5 border-b border-[color:var(--border)]">
              <span className="text-[10px] tracking-widest text-[color:var(--text-muted)]">BASE</span>
              <span className="text-[color:var(--text)]">ANANTAPUR · 14.68° N, 77.60° E</span>
            </div>
            <div className="flex flex-col gap-1 pb-2.5 border-b border-[color:var(--border)]">
              <span className="text-[10px] tracking-widest text-[color:var(--text-muted)]">FOCUS</span>
              <span className="text-[color:var(--text)]">ECE · PHYSICS · ASTROPHYSICS</span>
            </div>
            <div className="flex flex-col gap-1 pb-2.5 border-b border-[color:var(--border)]">
              <span className="text-[10px] tracking-widest text-[color:var(--text-muted)]">TOOLS</span>
              <span className="text-[color:var(--text)]">VIVADO · KICAD · LTSPICE · PYTHON</span>
            </div>

            {siteSettings?.email && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="text-[color:var(--accent-text)] hover:underline truncate"
                >
                  {siteSettings.email}
                </a>
                <CopyEmailButton email={siteSettings.email} />
              </div>
            )}
            {siteSettings?.social_links && siteSettings.social_links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {siteSettings.social_links
                  .filter((s) => Boolean(s.url && s.url !== '#'))
                  .map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-wider text-[color:var(--accent-text)] hover:underline"
                    >
                      {s.platform} ↗
                    </a>
                  ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Prose Column (65%) */}
        <div className="flex flex-col gap-10">
          <section className="flex flex-col gap-6 max-w-[65ch]">
            <Title as="h2" className="text-3xl md:text-4xl leading-tight">
              Manoj Amavasya
            </Title>
            <div className="flex flex-col gap-5 text-[color:var(--text)] text-lg leading-relaxed font-sans">
              <p>
                I am a final-year Electronics and Communication Engineering undergraduate building a
                strong engineering foundation spanning embedded systems, digital signal processing,
                quantum and scientific computing, and communications, with a long-term goal of pursuing
                research in Physics and Astrophysics.
              </p>
              <p className="text-[color:var(--text-muted)]">
                My academic interests connect engineering with scientific discovery. I view
                Electronics and Communication Engineering as the foundational layer that enables work in
                computational physics, astrophysics, signal processing, and future applications of
                quantum computing. I prefer approaching scientific questions through evidence,
                computation, and engineering rather than speculation.
              </p>
            </div>
          </section>

          {/* 1-Line Ledger: Education, Focus, Open-Source */}
          <section aria-label="Academic and Open-Source Ledger" className="max-w-[65ch]">
            <Label className="text-[color:var(--text-muted)] tracking-widest block mb-3">
              LEDGER
            </Label>
            <div className="border-t border-[color:var(--border)]">
              {LEDGER_ENTRIES.map((entry) => (
                <div
                  key={entry.category}
                  className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr_auto] items-baseline gap-2 sm:gap-4 border-b border-[color:var(--border)] py-4"
                >
                  <span className="font-mono text-[11px] tracking-widest text-[color:var(--accent-text)]">
                    {entry.category}
                  </span>
                  <span className="text-sm sm:text-base text-[color:var(--text)]">
                    {entry.title}
                  </span>
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] tracking-wider text-[color:var(--accent-text)] hover:underline whitespace-nowrap"
                    >
                      {entry.meta}
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] tracking-wider text-[color:var(--text-muted)] whitespace-nowrap">
                      {entry.meta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Dynamic Story Content */}
          {profile?.story && (
            <section className="max-w-[65ch] pt-4 border-t border-[color:var(--border)]">
              <RichTextRenderer data={profile.story} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
