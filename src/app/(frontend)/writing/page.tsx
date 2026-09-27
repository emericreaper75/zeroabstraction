import { Display, Title, Label, Body } from '@/components/typography';
import { EditorialLink } from '@/components/EditorialLink';
import { getPosts } from '@/lib/content';
import { Link } from 'next-view-transitions';

export default async function WritingArchive() {
  const { docs: posts } = await getPosts();

  return (
    <div className="container-wide pb-32">
      <header className="py-24 md:py-32">
        <Display>Writing</Display>
      </header>

      <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
        {posts.map((post) => {
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
                  <Title as="h2">
                    <Link href={`/writing/${post.slug}`} className="hover:text-[color:var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                  </Title>
                  <Body className="text-[color:var(--muted)]">
                    {post.excerpt}
                  </Body>
                </div>
                <div className="md:col-span-2 md:text-right flex flex-col md:items-end items-start gap-4">
                  {post.reading_time && (
                    <Label className="text-[color:var(--muted)]">{post.reading_time} MIN READ</Label>
                  )}
                  <EditorialLink href={`/writing/${post.slug}`}>READ ARTICLE</EditorialLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
