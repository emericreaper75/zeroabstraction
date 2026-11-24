import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Title, Body, Label } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SampleContentBadge } from '@/components/SampleContentBadge';
import { getAllSlugs, getProjectBySlug } from '@/lib/content';
import { getRelated } from '@/lib/related';
import { RelatedContent } from '@/components/RelatedContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return {
      title: 'Project Not Found | ZeroAbstraction',
    };
  }

  const imageUrl = typeof project.cover_image === 'object' && project.cover_image?.url ? project.cover_image.url : undefined;

  return {
    title: `${project.title} | ZeroAbstraction`,
    description: project.summary || `Project: ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.summary || undefined,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary || undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs('projects');
  return slugs;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const relatedItems = await getRelated(project);

  const imageUrl = typeof project.cover_image === 'object' && project.cover_image?.url ? project.cover_image.url : null;
  const imageAlt = typeof project.cover_image === 'object' && project.cover_image?.alt_text ? project.cover_image.alt_text : project.title;

  return (
    <>
      <SampleContentBadge />
      <article style={{ paddingBottom: 'var(--space-8)' }}>
        {/* Header - Reading Width */}
        <header className="container-reading" style={{ paddingTop: 'var(--space-8)' }}>
          <div className="flex w-full flex-col max-w-[56rem]">
            {/* Meta row */}
            <div
              className="flex items-center flex-wrap font-mono uppercase text-[color:var(--text-muted)]"
              style={{
                fontSize: 'var(--text-label)',
                letterSpacing: 'var(--tracking-label)',
                gap: 'var(--space-2)',
              }}
            >
              {project.topics && project.topics.length > 0 && project.topics.map((t: any, i: number) => {
                const name = typeof t === 'object' ? t?.name : t;
                const topicSlug = typeof t === 'object' ? t?.slug : '';
                if (!name) return null;
                return (
                  <React.Fragment key={typeof t === 'object' ? t.id || i : i}>
                    {topicSlug ? (
                      <Link href={`/projects?topic=${encodeURIComponent(topicSlug)}`} className="text-[color:var(--accent-text)] hover:underline inline-flex items-center py-1">
                        {name.toUpperCase()}
                      </Link>
                    ) : (
                      <span className="text-[color:var(--accent-text)] inline-flex items-center py-1">{name.toUpperCase()}</span>
                    )}
                    <span className="text-[color:var(--text-muted)] opacity-60">•</span>
                  </React.Fragment>
                );
              })}
              <span className="text-[color:var(--text-muted)] inline-flex items-center py-1">{project.year || new Date().getFullYear()}</span>
              <span className="text-[color:var(--text-muted)] opacity-60">•</span>
              <span className="text-[color:var(--accent-text)] font-semibold uppercase inline-flex items-center py-1">{project.status?.replace('_', ' ') || 'PROJECT'}</span>
            </div>

            {/* Title */}
            <h1
              className="font-[family-name:var(--font-display)] font-normal tracking-[-0.01em] text-balance text-[color:var(--text)]"
              style={{
                fontSize: 'var(--text-title)',
                lineHeight: 'var(--lh-display)',
                fontFamily: 'var(--font-display)',
                marginTop: 'var(--space-4)',
              }}
            >
              {project.title}
            </h1>

            {/* Divider: 1px --border hairline */}
            <div className="mt-[var(--space-6)] mb-[var(--space-6)] border-t border-[color:var(--border)]" />
          </div>
        </header>

        {/* Hero Image - Content Width */}
        {imageUrl && (
          <div className="container-wide" style={{ marginBottom: 'var(--space-8)' }}>
            <figure className="w-full overflow-hidden rounded-[var(--radius-s)]">
              <ProjectImage 
                transitionName={`project-hero-${slug}`}
                src={imageUrl} 
                alt={imageAlt} 
                width={1400} 
                height={800} 
                className="w-full h-auto object-cover" 
                style={{ maxHeight: '70vh' }}
                priority
              />
            </figure>
          </div>
        )}

        {/* Content - Reading Width */}
        <div className="container-reading flex flex-col" style={{ gap: 'var(--space-6)' }}>
          {project.summary && (
            <section className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
              <Title as="h2">Summary</Title>
              <Body className="text-[color:var(--text-muted)]" style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
                {project.summary}
              </Body>
            </section>
          )}

          {project.description && (
            <section className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
              <Title as="h2">Description</Title>
              <RichTextRenderer data={project.description} />
            </section>
          )}
        </div>

        {/* Image Gallery - Content Width */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="container-wide" style={{ marginBlock: 'var(--space-8)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'var(--space-6)' }}>
              {project.gallery.map((item: any, i: number) => {
                const imgUrl = typeof item.image === 'object' && item.image?.url ? item.image.url : '/placeholder.svg';
                const imgAlt = typeof item.image === 'object' && item.image?.alt_text ? item.image.alt_text : `Gallery ${i+1}`;
                return (
                  <figure key={i} className="overflow-hidden rounded-[var(--radius-s)]">
                    <ProjectImage src={imgUrl} alt={imgAlt} width={800} height={600} className="w-full h-auto aspect-video object-cover" />
                  </figure>
                );
              })}
            </div>
          </div>
        )}

        {/* More Content - Reading Width */}
        <div className="container-reading flex flex-col" style={{ gap: 'var(--space-6)' }}>
          {/* Technologies Used */}
          {project.technologies && project.technologies.length > 0 && (
            <section className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
              <Title as="h2">Technologies Used</Title>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: any, i: number) => (
                  <span key={i} className="font-mono text-[var(--text-ui-sm)] text-[color:var(--text-muted)] border border-[color:var(--border)] px-3 py-1 rounded-[var(--radius-s)]">
                    {tech.name.toUpperCase()}
                  </span>
                ))}
              </div>
            </section>
          )}

          {project.lessons && (
            <section className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
              <Title as="h2">Lessons Learned</Title>
              <RichTextRenderer data={project.lessons} />
            </section>
          )}

          {/* External Links */}
          {project.links && project.links.length > 0 && (
            <section className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
              <Title as="h2">External Links</Title>
              <div className="flex flex-col items-start gap-2">
                {project.links.map((link: any, i: number) => (
                  <EditorialLink key={i} href={link.url} variant={i === 0 ? undefined : "muted"}>
                    {link.label.toUpperCase()}
                  </EditorialLink>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* End Matter: Topic Chips */}
        {project.topics && project.topics.length > 0 && (
          <div className="container-reading" style={{ marginTop: 'var(--space-8)' }}>
            <div className="flex items-center flex-wrap gap-4 font-mono text-[var(--text-label)] uppercase tracking-[var(--tracking-label)] pt-8 border-t border-[color:var(--border)]">
              <span className="text-[color:var(--text-muted)] font-medium">TOPICS</span>
              {project.topics.map((t: any, i: number) => {
                const name = typeof t === 'object' ? t?.name : t;
                const topicSlug = typeof t === 'object' ? t?.slug : '';
                if (!name) return null;
                return topicSlug ? (
                  <Link key={t.id || i} href={`/projects?topic=${encodeURIComponent(topicSlug)}`} className="text-[color:var(--accent-text)] hover:underline min-h-[44px] inline-flex items-center">
                    {name.toUpperCase()}
                  </Link>
                ) : (
                  <span key={i} className="text-[color:var(--accent-text)] min-h-[44px] inline-flex items-center">{name.toUpperCase()}</span>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Content */}
        {relatedItems.length > 0 && (
          <RelatedContent items={relatedItems} />
        )}
      </article>
    </>
  );
}
