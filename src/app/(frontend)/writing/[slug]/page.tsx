import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectImage } from '@/components/ProjectImage';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SampleContentBadge } from '@/components/SampleContentBadge';
import { getAllSlugs, getPostBySlug } from '@/lib/content';
import { getRelated } from '@/lib/related';
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

function extractProse(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractProse).join(' ');
  if (typeof node === 'object') {
    if (node.type === 'code' || node.type === 'equation' || node.type === 'math') return '';
    if (node.text) return node.text;
    if (node.children) return extractProse(node.children);
    if (node.root) return extractProse(node.root);
  }
  return '';
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedItems = await getRelated(post);

  const coverImageUrl = typeof post.cover_image === 'object' && post.cover_image?.url ? post.cover_image.url : null;
  const coverImageAlt = typeof post.cover_image === 'object' && post.cover_image?.alt_text ? post.cover_image.alt_text : post.title;

  const dateStr = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'DRAFT';

  const prose = (post.excerpt || '') + ' ' + extractProse(post.content);
  const words = prose.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = post.reading_time || Math.max(1, Math.ceil(words / 225));

  return (
    <>
      <SampleContentBadge />
      <article style={{ paddingBottom: 'var(--space-8)' }}>
        {/* Header Block */}
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
              {post.topics && post.topics.length > 0 && post.topics.map((t: any, i: number) => {
                const name = typeof t === 'object' ? t?.name : t;
                const topicSlug = typeof t === 'object' ? t?.slug : '';
                if (!name) return null;
                return (
                  <React.Fragment key={typeof t === 'object' ? t.id || i : i}>
                    {topicSlug ? (
                      <Link href={`/writing?topic=${encodeURIComponent(topicSlug)}`} className="text-[color:var(--accent-text)] hover:underline inline-flex items-center py-1">
                        {name.toUpperCase()}
                      </Link>
                    ) : (
                      <span className="text-[color:var(--accent-text)] inline-flex items-center py-1">{name.toUpperCase()}</span>
                    )}
                    <span className="text-[color:var(--text-muted)] opacity-60">•</span>
                  </React.Fragment>
                );
              })}
              {post.published_at ? (
                <time dateTime={post.published_at} className="text-[color:var(--text-muted)] inline-flex items-center py-1">
                  {dateStr}
                </time>
              ) : (
                <span className="text-[color:var(--text-muted)] inline-flex items-center py-1">{dateStr}</span>
              )}
              <span className="text-[color:var(--text-muted)] opacity-60">•</span>
              <span className="text-[color:var(--text-muted)] inline-flex items-center py-1">{readingTime} MIN READ</span>
            </div>

            {/* Title (h1) */}
            <h1
              className="font-[family-name:var(--font-display)] font-normal tracking-[-0.01em] text-balance text-[color:var(--text)]"
              style={{
                fontSize: 'var(--text-title)',
                lineHeight: 'var(--lh-display)',
                fontFamily: 'var(--font-display)',
                marginTop: 'var(--space-4)',
              }}
            >
              {post.title}
            </h1>

            {/* Dek (excerpt) */}
            {post.excerpt && (
              <p
                className="font-sans text-[color:var(--text-muted)] max-w-[var(--measure-reading)] leading-relaxed"
                style={{
                  fontSize: 'var(--text-body-lg)',
                  lineHeight: 'var(--lh-body)',
                  marginTop: 'var(--space-4)',
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Divider: 1px --border hairline */}
            <div className="mt-[var(--space-6)] mb-[var(--space-6)] border-t border-[color:var(--border)]" />
          </div>
        </header>

        {/* Cover Image */}
        {coverImageUrl && (
          <div className="container-wide" style={{ marginBottom: 'var(--space-8)' }}>
            <figure className="w-full overflow-hidden rounded-[var(--radius-s)]">
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
              {typeof post.cover_image === 'object' && post.cover_image && (post.cover_image.caption || post.cover_image.credit) && (
                <figcaption className="mt-2 font-mono text-[var(--text-ui-sm)] text-[color:var(--text-muted)]">
                  {post.cover_image.caption}{post.cover_image.caption && post.cover_image.credit ? ' · ' : ''}{post.cover_image.credit}
                </figcaption>
              )}
            </figure>
          </div>
        )}

        {/* Body Content */}
        <div className="container-reading flex flex-col" style={{ gap: 'var(--space-6)' }}>
          {post.content && (
            <RichTextRenderer data={post.content} />
          )}
        </div>

        {/* End Matter: Topic Chips */}
        {post.topics && post.topics.length > 0 && (
          <div className="container-reading" style={{ marginTop: 'var(--space-8)' }}>
            <div className="flex items-center flex-wrap gap-4 font-mono text-[var(--text-label)] uppercase tracking-[var(--tracking-label)] pt-8 border-t border-[color:var(--border)]">
              <span className="text-[color:var(--text-muted)] font-medium">TOPICS</span>
              {post.topics.map((t: any, i: number) => {
                const name = typeof t === 'object' ? t?.name : t;
                const topicSlug = typeof t === 'object' ? t?.slug : '';
                if (!name) return null;
                return topicSlug ? (
                  <Link key={t.id || i} href={`/writing?topic=${encodeURIComponent(topicSlug)}`} className="text-[color:var(--accent-text)] hover:underline min-h-[44px] inline-flex items-center">
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
