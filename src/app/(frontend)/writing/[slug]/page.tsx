import React from 'react';
import type { Metadata } from 'next';
import { Display, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { Divider } from '@/components/Divider';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SampleContentBadge } from '@/components/SampleContentBadge';
import { getAllSlugs, getPostBySlug, getRelatedContentForPost } from '@/lib/content';
import { RelatedContent } from '@/components/RelatedContent';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: 'Manuscript Not Found | ZeroAbstraction',
    };
  }

  const imageUrl = typeof post.cover_image === 'object' && post.cover_image?.url ? post.cover_image.url : undefined;

  return {
    title: `${post.title} | ZeroAbstraction`,
    description: post.excerpt || `Manuscript on ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs('posts');
  return slugs;
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedItems = await getRelatedContentForPost(post);

  const coverImageUrl = typeof post.cover_image === 'object' && post.cover_image?.url ? post.cover_image.url : null;
  const coverImageAlt = typeof post.cover_image === 'object' && post.cover_image?.alt_text ? post.cover_image.alt_text : post.title;

  const dateStr = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'DRAFT';

  return (
    <>
      <SampleContentBadge />
      <article style={{ paddingBottom: 'clamp(var(--space-6), 8vw, var(--space-10))' }}>
        {/* Header */}
        <header className="container-reading" style={{ paddingBlock: 'clamp(var(--space-6), 6vw, var(--space-10))' }}>
        <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
          <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-4)' }}>
            {post.topics && post.topics.length > 0 && post.topics.map((t: any, i: number) => {
              const name = typeof t === 'object' ? t?.name : t;
              if (!name) return null;
              return (
                <React.Fragment key={typeof t === 'object' ? t.id || i : i}>
                  <Label className="text-[color:var(--muted)]">{name.toUpperCase()}</Label>
                  <span className="text-[color:var(--muted)]">•</span>
                </React.Fragment>
              );
            })}
            <Label className="text-[color:var(--muted)]">{dateStr}</Label>
            {post.reading_time && (
              <>
                <span className="text-[color:var(--muted)]">•</span>
                <Label className="text-[color:var(--muted)]">{post.reading_time} MIN READ</Label>
              </>
            )}
          </div>
          <Display>{post.title}</Display>
        </div>
      </header>

      {/* Cover Image - Content Width */}
      {coverImageUrl && (
        <div className="container-wide" style={{ marginBottom: 'clamp(var(--space-6), 6vw, var(--space-10))' }}>
          <ProjectImage
            transitionName={`post-hero-${slug}`}
            src={coverImageUrl}
            alt={coverImageAlt}
            width={1400}
            height={800}
            className="w-full h-auto object-cover"
            style={{ maxHeight: '70vh' }}
            priority
          />
        </div>
      )}

      {/* Body Content */}
      <div className="container-reading flex flex-col" style={{ gap: 'var(--space-6)' }}>
        {post.excerpt && (
          <Body style={{ lineHeight: '1.8', fontSize: '1.125rem' }}>
            {post.excerpt}
          </Body>
        )}
        {post.content && (
          <RichTextRenderer data={post.content} />
        )}
      </div>

      <div className="container-reading" style={{ paddingBlock: 'clamp(var(--space-6), 6vw, var(--space-10))' }}>
        <Divider />
      </div>

      {/* Related Content */}
      {relatedItems.length > 0 && (
        <RelatedContent items={relatedItems} />
      )}

    </article>
    </>
  );
}
