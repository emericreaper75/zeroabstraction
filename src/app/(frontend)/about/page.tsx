import type { Metadata } from 'next';
import { Display, Heading, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Reveal } from '@/components/Reveal';
import { getProfile } from '@/lib/content';
import { RichTextRenderer } from '@/components/RichTextRenderer';

export const metadata: Metadata = {
  title: 'About — ZeroAbstraction',
  description:
    'Manoj Amavasya — Electronics and Communication Engineering undergraduate building a foundation for research in Physics, Astrophysics, and Scientific Computing.',
};

export default async function AboutPage() {
  const profile = await getProfile().catch(() => null);

  const profileImgUrl =
    typeof profile?.photograph === 'object' && profile?.photograph?.url
      ? profile.photograph.url
      : '/placeholder.svg';
  const profileImgAlt =
    typeof profile?.photograph === 'object' && profile?.photograph?.alt_text
      ? profile.photograph.alt_text
      : 'Manoj Amavasya — Researcher';

  return (
    <div className="container-wide pb-32">
      {/* 1. Header & Researcher Dossier */}
      <Reveal>
        <section
          className="pt-16 md:pt-24 pb-16 ui-border-b"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="flex flex-col gap-4 mb-10">
            <Label className="text-[color:var(--muted)] tracking-widest">
              ABOUT ZEROABSTRACTION
            </Label>
            <Display>Researcher</Display>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left / Photo column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="w-full ui-border overflow-hidden bg-[color:var(--bg)]">
                <ProjectImage
                  src={profileImgUrl}
                  alt={profileImgAlt}
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Metadata Card */}
              <div className="ui-border p-6 flex flex-col gap-4 bg-[color:var(--bg)]">
                <Label className="text-[color:var(--muted)] border-b border-[color:var(--border)] pb-2">
                  ACADEMIC AFFILIATION
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">INSTITUTION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      JNTU Anantapur
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">GRADUATION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      2027
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">LOCATION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      India
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">PRIMARY FOCUS</Label>
                    <span className="font-mono text-sm text-right text-[color:var(--text)]">
                      ECE → Physics & Astrophysics
                    </span>
                  </div>
                </div>
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
                <p className="text-[color:var(--muted)]">
                  My academic interests connect engineering with scientific discovery. I view
                  Electronics and Communication Engineering as the foundational layer that enables work in
                  computational physics, astrophysics, signal processing, and future applications of
                  quantum computing. I prefer approaching scientific questions through evidence,
                  computation, and engineering rather than speculation.
                </p>
              </div>

              {/* Trajectory / Core Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  PHYSICS
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  ASTROPHYSICS
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  ELECTRONICS & SIGNAL PROCESSING
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  SCIENTIFIC COMPUTING
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  QUANTUM INFORMATION
                </span>
              </div>
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
            <div className="text-[color:var(--muted)]">
              More about the research journey and toolkit will be published here.
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
