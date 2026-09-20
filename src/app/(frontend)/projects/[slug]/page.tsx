import { Display, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Divider } from '@/components/Divider';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SampleContentBadge } from '@/components/SampleContentBadge';
import { getAllSlugs, getProjectBySlug, getRelatedContentForProject } from '@/lib/content';
import { RelatedContent } from '@/components/RelatedContent';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getAllSlugs('projects');
  return slugs;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const relatedItems = await getRelatedContentForProject(project);

  const imageUrl = typeof project.cover_image === 'object' && project.cover_image?.url ? project.cover_image.url : '/placeholder.svg';
  const imageAlt = typeof project.cover_image === 'object' && project.cover_image?.alt_text ? project.cover_image.alt_text : `MISSING ALT TEXT - ${project.title}`;

  return (
    <>
      <SampleContentBadge />
      <article style={{ paddingBottom: 'clamp(var(--space-6), 8vw, var(--space-10))' }}>
        {/* Header - Reading Width */}
        <header className="container-reading" style={{ paddingBlock: 'clamp(var(--space-6), 6vw, var(--space-10))' }}>
        <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
          <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-4)' }}>
            <Label className="text-[color:var(--muted)]">{project.year || new Date().getFullYear()}</Label>
            <span className="text-[color:var(--muted)]">•</span>
            <Label className="text-[color:var(--muted)] uppercase">{project.status?.replace('_', ' ') || 'PROJECT'}</Label>
          </div>
          <Display>{project.title}</Display>
        </div>
      </header>

      {/* Hero Image - Content Width */}
      <div className="container-wide" style={{ marginBottom: 'clamp(var(--space-6), 6vw, var(--space-10))' }}>
        <ProjectImage 
          transitionName={`project-hero-${slug}`}
          src={imageUrl} 
          alt={imageAlt} 
          width={1400} 
          height={800} 
          className="w-full h-auto object-cover" 
          style={{ maxHeight: '70vh' }}
        />
      </div>

      {/* Content - Reading Width */}
      <div className="container-reading flex flex-col" style={{ gap: 'var(--space-9)' }}>
        {project.summary && (
          <section className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
            <Title as="h2">Summary</Title>
            <Body className="text-[color:var(--muted)]" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              {project.summary}
            </Body>
          </section>
        )}

        {project.description && (
          <section className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
            <Title as="h2">Description</Title>
            <RichTextRenderer data={project.description} />
          </section>
        )}
      </div>

      {/* Image Gallery - Content Width */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="container-wide" style={{ marginBlock: 'clamp(var(--space-6), 6vw, var(--space-10))' }}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--space-6)' }}>
            {project.gallery.map((item: any, i: number) => {
               const imgUrl = typeof item.image === 'object' && item.image?.url ? item.image.url : '/placeholder.svg';
               const imgAlt = typeof item.image === 'object' && item.image?.alt_text ? item.image.alt_text : `MISSING ALT TEXT - Gallery ${i+1}`;
               return (
                 <ProjectImage key={i} src={imgUrl} alt={imgAlt} width={800} height={600} className="w-full h-auto aspect-video object-cover" />
               )
            })}
          </div>
        </div>
      )}

      {/* More Content - Reading Width */}
      <div className="container-reading flex flex-col" style={{ gap: 'var(--space-9)' }}>
        
        {/* Technologies Used */}
        {project.technologies && project.technologies.length > 0 && (
          <section className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
            <Title as="h2">Technologies Used</Title>
            <div className="flex flex-wrap" style={{ gap: 'var(--space-4)' }}>
              {project.technologies.map((tech: any, i: number) => (
                <div key={i} className="ui-border" style={{ padding: 'var(--space-2) var(--space-4)' }}><Label>{tech.name.toUpperCase()}</Label></div>
              ))}
            </div>
          </section>
        )}

        {project.lessons && (
          <section className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
            <Title as="h2">Lessons Learned</Title>
            <RichTextRenderer data={project.lessons} />
          </section>
        )}

        <div style={{ paddingBlock: 'var(--space-4)' }}>
          <Divider />
        </div>

        {/* External Links */}
        {project.links && project.links.length > 0 && (
          <section className="flex flex-col" style={{ gap: 'var(--space-5)' }}>
            <Title as="h2">External Links</Title>
            <div className="flex flex-col items-start" style={{ gap: 'var(--space-4)' }}>
              {project.links.map((link: any, i: number) => (
                <EditorialLink key={i} href={link.url} variant={i === 0 ? undefined : "muted"}>{link.label.toUpperCase()}</EditorialLink>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Related Content */}
      {relatedItems.length > 0 && (
        <RelatedContent items={relatedItems} />
      )}

    </article>
    </>
  );
}
