import { Display, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Divider } from '@/components/Divider';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { notFound } from 'next/navigation';
import { Link } from 'next-view-transitions';

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({ collection: 'posts', limit: 1000 });
  return posts.docs.map((doc) => ({ slug: doc.slug }));
}

export default async function WritingPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
    limit: 1,
    depth: 1,
  });

  const post = posts.docs[0];
  if (!post) notFound();

  const dateStr = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
    : 'DRAFT';

  return (
    <article style={{ paddingBottom: 'var(--space-10)' }}>
      {/* Header */}
      <header className="container-reading" style={{ paddingBlock: 'var(--space-10)' }}>
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
        
        <Body style={{ lineHeight: '1.8' }}>
          <span className="italic text-[color:var(--muted)]">[Rich text content — configure Lexical renderer]</span>
        </Body>
      </div>

      <div className="container-reading" style={{ paddingBlock: 'var(--space-10)' }}>
        <Divider />
      </div>

      {/* Related Content */}
      {(post.related_posts && post.related_posts.length > 0) || (post.related_projects && post.related_projects.length > 0) ? (
        <section className="container-reading">
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <Label className="text-[color:var(--muted)]">RELATED CONTENT</Label>
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
            
            {post.related_posts?.map((relatedPost: any, idx: number) => {
              const relDateStr = relatedPost.published_at 
                ? new Date(relatedPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
                : 'DRAFT';
              
              return (
                <div key={`post-${relatedPost.id}`}>
                  {idx > 0 && <div className="ui-border-t" style={{ marginBottom: 'var(--space-8)' }} />}
                  <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
                    <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-4)' }}>
                      <Label className="text-[color:var(--muted)]">{relDateStr}</Label>
                      {relatedPost.reading_time && (
                        <>
                          <span className="text-[color:var(--muted)]">•</span>
                          <Label className="text-[color:var(--muted)]">{relatedPost.reading_time} MIN READ</Label>
                        </>
                      )}
                    </div>
                    <Title as="h3">{relatedPost.title}</Title>
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <EditorialLink href={`/writing/${relatedPost.slug}`}>READ ARTICLE</EditorialLink>
                    </div>
                  </div>
                </div>
              );
            })}

            {post.related_projects?.map((relatedProject: any, idx: number) => (
               <div key={`project-${relatedProject.id}`}>
                 {(idx > 0 || (post.related_posts && post.related_posts.length > 0)) && <div className="ui-border-t" style={{ marginBottom: 'var(--space-8)' }} />}
                 <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
                   <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-4)' }}>
                     <Label className="text-[color:var(--muted)]">PROJECT</Label>
                   </div>
                   <Title as="h3">{relatedProject.title}</Title>
                   <div style={{ marginTop: 'var(--space-2)' }}>
                     <EditorialLink href={`/projects/${relatedProject.slug}`}>VIEW PROJECT</EditorialLink>
                   </div>
                 </div>
               </div>
            ))}

          </div>
        </section>
      ) : null}

    </article>
  );
}
