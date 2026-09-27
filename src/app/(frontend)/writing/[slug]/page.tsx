import type { Metadata } from 'next';
import { Display, Label, Body } from '@/components/typography';
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

  return {
    title: `${post.title} | ZeroAbstraction`,
    description: post.excerpt || `Manuscript on ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
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
            {post.topics && post.topics.length > 0 && (
               <>
                 <Label className="text-[color:var(--muted)]">{typeof post.topics[0] === 'object' && post.topics[0]?.name?.toUpperCase()}</Label>
                 <span className="text-[color:var(--muted)]">•</span>
               </>
            )}
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
