import { Display, Heading, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Reveal } from '@/components/Reveal';
import { Link } from 'next-view-transitions';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export default async function Home() {
  const payload = await getPayload({ config: configPromise });

  const currentState = await payload.findGlobal({
    slug: 'current-state',
  });

  const profile = await payload.findGlobal({
    slug: 'profile',
  });

  const featuredProjects = await payload.find({
    collection: 'projects',
    where: {
      featured: {
        equals: true,
      },
    },
    limit: 2,
  });

  const recentPosts = await payload.find({
    collection: 'posts',
    sort: '-published_at',
    limit: 3,
  });

  const journeyEntries = await payload.find({
    collection: 'journey',
    sort: 'order',
  });

  return (
    <div className="container-wide">
      <Reveal>
        <section className="min-h-[85vh] flex flex-col justify-center py-16" style={{ gap: 'var(--space-8)' }}>
          {/* Text Content */}
          <div className="flex flex-col" style={{ gap: 'var(--space-4)', maxWidth: '800px' }}>
            <Display>First Last</Display>
            <Heading as="h2" className="text-[color:var(--muted)]">
              Exploring the intersections of theoretical physics, electrical engineering, and the cosmos.
            </Heading>
            
            <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <Label>PHYSICS</Label>
              <span className="text-[color:var(--muted)]">•</span>
              <Label>ECE</Label>
              <span className="text-[color:var(--muted)]">•</span>
              <Label>ASTROPHYSICS</Label>
            </div>
          </div>

          {/* Placeholder Image Area */}
          <div 
            className="w-full"
            style={{ 
              height: 'clamp(300px, 50vh, 600px)', 
              backgroundColor: 'var(--muted)',
              marginTop: 'var(--space-6)',
              opacity: 0.2
            }}
            aria-label="Placeholder for night-sky photograph"
          />

          {/* Scroll Cue */}
          <div className="ui-border-t flex items-center justify-between" style={{ paddingTop: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
            <Label className="text-[color:var(--muted)]">SCROLL TO EXPLORE</Label>
            <span className="text-[color:var(--muted)]" style={{ fontFamily: 'var(--font-mono)' }}>↓</span>
          </div>
        </section>
      </Reveal>

      {/* Right Now Section */}
      {currentState?.visibility && (
        <Reveal>
          <section style={{ paddingBlock: 'var(--space-10)' }}>
            <div className="grid grid-cols-1 md:grid-cols-12" style={{ gap: 'var(--space-8)' }}>
              <div className="md:col-span-4">
                <Label className="text-[color:var(--muted)]">RIGHT NOW</Label>
              </div>
              <div className="md:col-span-8 flex flex-col" style={{ gap: 'var(--space-6)' }}>
                {currentState.studying && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--muted)] w-40 shrink-0">STUDYING</Label>
                    <Body>{currentState.studying}</Body>
                  </div>
                )}
                
                {currentState.building && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--muted)] w-40 shrink-0">BUILDING</Label>
                    <Body>{currentState.building}</Body>
                  </div>
                )}

                {currentState.reading && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--muted)] w-40 shrink-0">READING</Label>
                    <Body>{currentState.reading}</Body>
                  </div>
                )}

                {currentState.thinking_about && (
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <Label className="text-[color:var(--muted)] w-40 shrink-0">THINKING ABOUT</Label>
                    <Body>{currentState.thinking_about}</Body>
                  </div>
                )}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* The Path So Far */}
      {journeyEntries.docs.length > 0 && (
        <Reveal>
          <section className="relative overflow-hidden" style={{ paddingBlock: 'var(--space-10)' }}>
            {/* Orbital Arc Background */}
            <div 
              className="absolute top-[30%] left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 rounded-full border border-[color:var(--border)] opacity-50 pointer-events-none" 
            />

            <div className="relative z-10 flex flex-col mb-16 md:mb-24">
              <Label className="text-[color:var(--muted)]">THE PATH SO FAR</Label>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row flex-wrap justify-center items-center gap-16 md:gap-4 md:px-12">
              {journeyEntries.docs.map((entry, index) => (
                <div key={entry.id} className={`bg-[color:var(--bg)] p-4 flex flex-col items-center max-w-[320px] ${index % 2 !== 0 ? 'md:-translate-y-16' : ''}`}>
                  <Title as="h3" className="text-center">{entry.title}</Title>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Featured Work Section */}
      {featuredProjects.docs.length > 0 && (
        <Reveal>
          <section style={{ paddingBlock: 'var(--space-10)' }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <Label className="text-[color:var(--muted)]">FEATURED WORK</Label>
            </div>

            <div className="flex flex-col" style={{ gap: 'var(--space-10)' }}>
              {featuredProjects.docs.map((project, index) => {
                const isEven = index % 2 === 0;
                // Safely extract URL from media or use placeholder
                const imageUrl = typeof project.cover_image === 'object' && project.cover_image?.url ? project.cover_image.url : '/placeholder.svg';
                const imageAlt = typeof project.cover_image === 'object' && project.cover_image?.alt_text ? project.cover_image.alt_text : `MISSING ALT TEXT - ${project.title}`;
                
                return (
                  <div key={project.id} className="grid grid-cols-1 md:grid-cols-12 items-center" style={{ gap: 'var(--space-8)' }}>
                    <div className={`md:col-span-7 ${!isEven ? 'md:order-2 order-1' : ''}`}>
                      <Link href={`/projects/${project.slug}`} style={{ display: 'block' }}>
                        <ProjectImage transitionName={`project-hero-${project.slug}`} src={imageUrl} alt={imageAlt} width={800} height={600} className="w-full h-auto" />
                      </Link>
                    </div>
                    <div className={`md:col-span-5 flex flex-col items-start ${!isEven ? 'md:order-1 order-2' : ''}`} style={{ gap: 'var(--space-4)' }}>
                      <Title as="h3">{project.title}</Title>
                      <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-3)' }}>
                        <Label className="text-[color:var(--muted)]">{project.year || new Date().getFullYear()}</Label>
                        <span className="text-[color:var(--muted)]">•</span>
                        {project.technologies && project.technologies.length > 0 && (
                          <Label className="text-[color:var(--muted)]">
                            {project.technologies.slice(0, 2).map((t: any) => t.name).join(' & ').toUpperCase()}
                          </Label>
                        )}
                      </div>
                      <Body className="text-[color:var(--muted)]">
                        {project.summary}
                      </Body>
                      <EditorialLink href={`/projects/${project.slug}`} style={{ marginTop: 'var(--space-2)' }}>VIEW PROJECT</EditorialLink>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>
      )}

      {/* Writing Section */}
      {recentPosts.docs.length > 0 && (
        <Reveal>
          <section style={{ paddingBlock: 'var(--space-10)' }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <Label className="text-[color:var(--muted)]">WRITING</Label>
            </div>

            <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
              {recentPosts.docs.map((post) => {
                const dateStr = post.published_at 
                  ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                  : 'DRAFT';
                
                return (
                  <div key={post.id} className="ui-border-t" style={{ paddingTop: 'var(--space-4)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                      <div className="md:col-span-2">
                        <Label className="text-[color:var(--muted)]">{dateStr}</Label>
                      </div>
                      <div className="md:col-span-8 flex flex-col" style={{ gap: 'var(--space-2)' }}>
                        <Title as="h3">
                          <Link href={`/writing/${post.slug}`} className="hover:text-[color:var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
                            {post.title}
                          </Link>
                        </Title>
                        <Body className="text-[color:var(--muted)]">
                          {post.excerpt}
                        </Body>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        {post.reading_time && (
                          <Label className="text-[color:var(--muted)]">{post.reading_time} MIN READ</Label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
              <EditorialLink href="/writing">VIEW ALL WRITING</EditorialLink>
            </div>
          </section>
        </Reveal>
      )}

      {/* About Section */}
      {profile && (
        <Reveal>
          <section style={{ paddingBlock: 'var(--space-10)' }}>
            <div className="grid grid-cols-1 md:grid-cols-12 items-center" style={{ gap: 'var(--space-10)' }}>
              <div className="md:col-span-5">
                {(() => {
                  const profileImgUrl = typeof profile.photograph === 'object' && profile.photograph?.url ? profile.photograph.url : '/placeholder.svg';
                  const profileImgAlt = typeof profile.photograph === 'object' && profile.photograph?.alt_text ? profile.photograph.alt_text : 'MISSING ALT TEXT - Profile Photograph';
                  return (
                    <ProjectImage src={profileImgUrl} alt={profileImgAlt} width={600} height={800} className="w-full h-auto" />
                  );
                })()}
              </div>
              <div className="md:col-span-7 flex flex-col items-start" style={{ gap: 'var(--space-6)' }}>
                <Label className="text-[color:var(--muted)]">ABOUT</Label>
                <Title as="h2" style={{ maxWidth: '600px' }}>
                  {profile.introduction || "I'm fascinated by the invisible rules that govern our reality, and the tools we build to interact with them."}
                </Title>
                <Body className="text-[color:var(--muted)]" style={{ maxWidth: '550px' }}>
                  {profile.current_focus || "My work spans from the low-level logic of integrated circuits to the macroscopic dynamics of celestial bodies. I believe the best engineering is rooted in a deep understanding of physical laws, and the most profound physics requires elegant engineering to prove."}
                </Body>
                <EditorialLink href="/about" style={{ marginTop: 'var(--space-2)' }}>READ FULL STORY</EditorialLink>
              </div>
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
}
