import Image from 'next/image';
import { Display, Heading, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Reveal } from '@/components/Reveal';
import { FeaturedProjectCard } from '@/components/FeaturedProjectCard';
import { SampleContentBadge } from '@/components/SampleContentBadge';
import { Link } from 'next-view-transitions';
import { WritingList } from '@/components/WritingList';
import { getSiteSettings, getCurrentState, getProfile, getFeaturedProjects, getRecentPosts, getJourney } from '@/lib/content';

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const currentState = await getCurrentState();
  const profile = await getProfile();
  const featuredProjects = await getFeaturedProjects(2);
  const recentPosts = await getRecentPosts(3);
  const journeyEntries = await getJourney();

  return (
    <>
      <SampleContentBadge />
      {/* Hero Section — 88svh Runtime Theme with Glass Top Bar (Doc 08) */}
      <section
        className="relative min-h-[88svh] w-full flex flex-col justify-end overflow-hidden bg-[color:var(--inverse-bg)]"
        style={{
          backgroundImage: 'var(--hero-scrim), linear-gradient(180deg, var(--inverse-bg) 0%, var(--inverse-bg) 100%)',
        }}
        aria-labelledby="home-title"
      >
        {/* Layer 1: Media — real night-sky/observatory photograph via next/image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/images/hero-observatory.webp"
            alt="Astronomical observatory under a starry night sky"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Layer 2: Scrim overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: 'var(--hero-scrim)' }}
          aria-hidden="true"
        />

        {/* Layer 3: Content — asymmetric lower-left within --measure-wide */}
        <div className="relative z-10 w-full max-w-[var(--measure-wide)] mx-auto px-[var(--gutter)] pt-32 pb-20 flex flex-col items-start" style={{ gap: 'var(--space-4)' }}>
          <Display
            id="home-title"
            className="text-[color:var(--hero-fg)] font-light leading-[var(--lh-display)]"
            style={{ maxWidth: '900px' }}
          >
            {siteSettings?.name || 'First Last'}
          </Display>
          
          <Heading
            as="p"
            className="text-[color:var(--hero-fg-muted)] font-light leading-[var(--lh-heading)]"
            style={{ maxWidth: '800px' }}
          >
            {siteSettings?.short_bio || 'Exploring the intersections of theoretical physics, electrical engineering, and the cosmos.'}
          </Heading>

          <div className="mt-4 flex items-center flex-wrap" style={{ gap: 'var(--space-3)' }}>
            <Label className="text-[color:var(--hero-accent)] font-semibold tracking-[var(--tracking-label)]">PHYSICS</Label>
            <span className="text-[color:var(--hero-fg-muted)]">•</span>
            <Label className="text-[color:var(--hero-accent)] font-semibold tracking-[var(--tracking-label)]">ECE</Label>
            <span className="text-[color:var(--hero-fg-muted)]">•</span>
            <Label className="text-[color:var(--hero-accent)] font-semibold tracking-[var(--tracking-label)]">ASTROPHYSICS</Label>
          </div>

          {/* Direct Connect Links */}
          {(siteSettings?.email || (siteSettings?.social_links && siteSettings.social_links.length > 0)) && (
            <div className="flex items-center flex-wrap gap-4 pt-2">
              {siteSettings?.email && (
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="inline-flex min-h-11 items-center gap-1 font-mono text-xs uppercase tracking-wider text-[color:var(--hero-fg-muted)] hover:text-[color:var(--hero-fg)] transition-colors"
                >
                  <span>EMAIL ↗</span>
                </a>
              )}
              {siteSettings?.social_links
                ?.filter((s) => Boolean(s.url && s.url !== '#'))
                .map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 font-mono text-xs uppercase tracking-wider text-[color:var(--hero-fg-muted)] hover:text-[color:var(--hero-fg)] transition-colors"
                  >
                    <span>{s.platform?.toUpperCase()} ↗</span>
                  </a>
                ))}
            </div>
          )}

          {/* Explore Cue */}
          <div className="pt-6">
            <span className="font-mono text-[length:var(--text-ui-sm)] tracking-widest text-[color:var(--hero-fg-muted)] select-none">
              SCROLL TO EXPLORE ↓
            </span>
          </div>
        </div>

        {/* Layer 5: 160px bottom blend gradient to --bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[color:var(--bg)] pointer-events-none z-[2]"
          aria-hidden="true"
        />
      </section>

      <div className="container-wide">
      {/* Right Now Section */}
      {currentState?.visibility && [currentState.studying, currentState.building, currentState.reading, currentState.thinking_about].some((value) => Boolean(value?.trim())) && (
        <Reveal>
          <section className="border-b border-[color:var(--border)] py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: 'var(--space-8)' }}>
              <div className="md:col-span-4">
                <Label className="text-[color:var(--accent-text)] font-semibold tracking-wider">RIGHT NOW</Label>
              </div>
              <div className="md:col-span-8 flex flex-col" style={{ gap: 'var(--space-6)' }}>
                {currentState.studying && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--text-muted)] w-40 shrink-0">STUDYING</Label>
                    <Body className="text-[color:var(--text)]">{currentState.studying}</Body>
                  </div>
                )}
                
                {currentState.building && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--text-muted)] w-40 shrink-0">BUILDING</Label>
                    <Body className="text-[color:var(--text)]">{currentState.building}</Body>
                  </div>
                )}

                {currentState.reading && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--text-muted)] w-40 shrink-0">READING</Label>
                    <Body className="text-[color:var(--text)]">{currentState.reading}</Body>
                  </div>
                )}

                {currentState.thinking_about && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--text-muted)] w-40 shrink-0">THINKING ABOUT</Label>
                    <Body className="text-[color:var(--text)]">{currentState.thinking_about}</Body>
                  </div>
                )}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* The Path So Far */}
      {journeyEntries.length > 0 && (
        <Reveal>
          <section className="border-b border-[color:var(--border)] py-16 md:py-20">
            <div className="mb-8 flex flex-col">
              <Label className="text-[color:var(--text-muted)]">THE PATH SO FAR</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-4">
              {journeyEntries.map((entry, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={entry.id ?? `${entry.title}-${index}`}
                    className="min-w-0 p-5 flex flex-col items-start ui-border rounded-[var(--radius-s)]"
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full mb-3 ${
                        isEven ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--accent-border)]'
                      }`}
                    />
                    <Title as="h3" className="text-left">{entry.title}</Title>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* Featured Work Section */}
      {featuredProjects.length > 0 && (
        <Reveal>
          <section className="border-b border-[color:var(--border)] py-16 md:py-20">
            <div style={{ marginBottom: 'var(--space-5)' }} className="flex items-center gap-3">
              <Label className="text-[color:var(--text-muted)]">FEATURED WORK</Label>
              <div className="flex-1 h-px bg-[color:var(--border)]" />
            </div>

            <div className="flex flex-col" style={{ gap: 'var(--space-10)' }}>
              {featuredProjects.map((project, index) => {
                const isEven = index % 2 === 0;
                return <FeaturedProjectCard key={project.id} project={project} isEven={isEven} />;
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* Writing Section */}
      {recentPosts.length > 0 && (
        <Reveal>
          <section className="border-b border-[color:var(--border)] py-16 md:py-20">
            <div style={{ marginBottom: 'var(--space-5)' }} className="flex items-center gap-3">
              <Label className="text-[color:var(--text-muted)]">WRITING</Label>
              <div className="flex-1 h-px bg-[color:var(--border)]" />
            </div>

            <WritingList posts={recentPosts} />

            <div style={{ marginTop: 'var(--space-8)' }}>
              <EditorialLink href="/writing">VIEW ALL WRITING</EditorialLink>
            </div>
          </section>
        </Reveal>
      )}

      {/* About Section */}
      {profile && (
        <Reveal>
          <section className="py-16 md:py-20">
            <div className="grid grid-cols-1 items-center md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" style={{ gap: 'var(--space-10)' }}>
              <div className="min-w-0">
                {(() => {
                  const profileImgUrl = typeof profile.photograph === 'object' && profile.photograph?.url ? profile.photograph.url : '/placeholder.svg';
                  const profileImgAlt = typeof profile.photograph === 'object' && profile.photograph?.alt_text ? profile.photograph.alt_text : 'MISSING ALT TEXT - Profile Photograph';
                  return (
                    <figure className="overflow-hidden rounded-[var(--radius-s)]">
                      <ProjectImage src={profileImgUrl} alt={profileImgAlt} width={600} height={800} className="w-full h-auto" />
                    </figure>
                  );
                })()}
              </div>
              <div className="min-w-0 flex flex-col items-start" style={{ gap: 'var(--space-6)' }}>
                <Label className="text-[color:var(--text-muted)]">ABOUT</Label>
                <Title as="h2" style={{ maxWidth: '600px' }}>
                  {profile.introduction || "I'm fascinated by the invisible rules that govern our reality, and the tools we build to interact with them."}
                </Title>
                <Body className="text-[color:var(--text-muted)]" style={{ maxWidth: '550px' }}>
                  {profile.current_focus || "My work spans from the low-level logic of integrated circuits to the macroscopic dynamics of celestial bodies. I believe the best engineering is rooted in a deep understanding of physical laws, and the most profound physics requires elegant engineering to prove."}
                </Body>
                <EditorialLink href="/about" style={{ marginTop: 'var(--space-2)' }}>READ FULL STORY</EditorialLink>
              </div>
            </div>
          </section>
        </Reveal>
      )}
    </div>
    </>
  );
}
