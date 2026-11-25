import type { Metadata } from 'next';
import { Display, Heading, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Reveal } from '@/components/Reveal';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { getProfile, getSiteSettings } from '@/lib/content';
import { RichTextRenderer } from '@/components/RichTextRenderer';

export const metadata: Metadata = {
  title: 'About — ZeroAbstraction',
  description:
    'Manoj Amavasya — Electronics and Communication Engineering undergraduate building a foundation for research in Physics, Astrophysics, and Scientific Computing.',
};

export default async function AboutPage() {
  const [profile, siteSettings] = await Promise.all([
    getProfile().catch(() => null),
    getSiteSettings().catch(() => null),
  ]);

  const profileImgUrl =
    typeof profile?.photograph === 'object' && profile?.photograph?.url
      ? profile.photograph.url
      : '/placeholder.svg';
  const profileImgAlt =
    typeof profile?.photograph === 'object' && profile?.photograph?.alt_text
      ? profile.photograph.alt_text
      : 'Manoj Amavasya — Researcher';

  return (
    <div className="container-wide pb-20">
      {/* 1. Header & Researcher Dossier */}
      <Reveal>
        <section
          className="pt-16 pb-16 ui-border-b relative overflow-hidden"
          style={{ marginBottom: 'var(--space-6)' }}
        >
          <div className="flex flex-col gap-4 mb-10 relative z-10">
            <Label className="text-[color:var(--text-muted)] tracking-widest">
              ABOUT ZEROABSTRACTION
            </Label>
            <Display>Researcher</Display>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
            {/* Left / Photo column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-4 architectural-grid border border-[color:var(--border)]/50 rounded-[var(--radius-s)]">
                <figure className="w-full overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] shadow-sm">
                  <ProjectImage
                    src={profileImgUrl}
                    alt={profileImgAlt}
                    width={600}
                    height={750}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </figure>
              </div>

              {/* Metadata Card */}
              <div className="ui-border p-6 flex flex-col gap-4 bg-[color:var(--bg)]">
                <Label className="text-[color:var(--text-muted)] border-b border-[color:var(--border)] pb-2">
                  ACADEMIC AFFILIATION
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--text-muted)]">INSTITUTION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      JNTU Anantapur
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--text-muted)]">GRADUATION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      2027
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--text-muted)]">LOCATION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      India
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--text-muted)]">PRIMARY FOCUS</Label>
                    <span className="font-mono text-sm text-right text-[color:var(--text)]">
                      ECE → Physics & Astrophysics
                    </span>
                  </div>
                </div>

                {/* Direct Communications & Network Links */}
                {(siteSettings?.email || (siteSettings?.social_links && siteSettings.social_links.length > 0)) && (
                  <>
                    <Label className="text-[color:var(--text-muted)] border-b border-[color:var(--border)] pt-2 pb-2">
                      COMMUNICATIONS &amp; NETWORKS
                    </Label>
                    <div className="flex flex-col gap-3">
                      {siteSettings?.email && (
                        <div className="flex justify-between items-center gap-2 text-sm">
                          <Label className="text-[color:var(--text-muted)]">EMAIL</Label>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${siteSettings.email}`}
                              className="font-mono text-sm text-[color:var(--accent-text)] hover:underline"
                            >
                              {siteSettings.email}
                            </a>
                            <CopyEmailButton email={siteSettings.email} />
                          </div>
                        </div>
                      )}
                      {siteSettings?.social_links
                        ?.filter((s) => Boolean(s.url && s.url !== '#'))
                        .map((s, idx) => (
                          <div key={idx} className="flex justify-between items-baseline text-sm">
                            <Label className="text-[color:var(--text-muted)]">{s.platform?.toUpperCase()}</Label>
                            <a
                              href={s.url!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-sm text-[color:var(--accent-text)] hover:underline"
                            >
                              {s.platform} ↗
                            </a>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right / Biography column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Title as="h2" className="text-3xl md:text-4xl leading-tight">
                Manoj Amavasya
              </Title>
              <div className="flex flex-col gap-6 text-[color:var(--text)] text-lg leading-relaxed font-sans">
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

              {/* Trajectory / Core Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--text-muted)]">
                  PHYSICS
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--text-muted)]">
                  ASTROPHYSICS
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--text-muted)]">
                  ELECTRONICS & SIGNAL PROCESSING
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--text-muted)]">
                  SCIENTIFIC COMPUTING
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--text-muted)]">
                  QUANTUM INFORMATION
                </span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Research Trajectory Pillars */}
      <Reveal>
        <section className="py-12 ui-border-b" aria-labelledby="pillars-heading">
          <Label id="pillars-heading" className="text-[color:var(--text-muted)] tracking-widest block mb-6">
            RESEARCH TRAJECTORY
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/60 rounded-[var(--radius-s)] flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">01 · HARDWARE</span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--text)]">Embedded &amp; FPGA Systems</h3>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">
                Deterministic timing, cryogenic readout electronics, and custom HDL pipelines bridging physical sensors and computation.
              </p>
            </div>
            <div className="p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/60 rounded-[var(--radius-s)] flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">02 · COMPUTATION</span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--text)]">Signal &amp; Scientific Computing</h3>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">
                Spectral estimation, matched filtering, and numerical simulation for weak-signal extraction under high noise floors.
              </p>
            </div>
            <div className="p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/60 rounded-[var(--radius-s)] flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--accent-text)]">03 · DISCOVERY</span>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--text)]">Astrophysics &amp; Quantum</h3>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed">
                Observational instrumentation, gravitational wave data analysis, and fault-tolerant quantum information architectures.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Dynamic Story Content */}
      <Reveal>
        <section className="pt-8">
          {profile?.story ? (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <RichTextRenderer data={profile.story} />
            </div>
          ) : (
            <div className="text-[color:var(--text-muted)]">
              More about the research journey and toolkit will be published here.
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
