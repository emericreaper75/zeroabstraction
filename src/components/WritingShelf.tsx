'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Post } from '@/payload-types';
import { ProjectImage } from './ProjectImage';

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i++) result = ((result * 31) + value.charCodeAt(i)) >>> 0;
  return result;
}

export function WritingShelf({ posts }: { posts: Post[] }) {
  const [selectedId, setSelectedId] = useState(String(posts[0]?.id ?? ''));
  const selected = posts.find((post) => String(post.id) === selectedId) ?? posts[0];
  const groups = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = post.published_at ? new Date(post.published_at).getUTCFullYear().toString() : 'UNDATED';
    (acc[year] ??= []).push(post);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[8fr_4fr]">
      <div className="flex flex-col gap-8">
        {Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([year, yearPosts]) => (
          <section key={year} aria-label={year}>
            <h2 className="mb-3 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">{year}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,64px))] items-end gap-3 border-b border-[color:var(--border-strong)] px-3 pb-3 shadow-[0_10px_12px_-10px_var(--shade)]">
              {yearPosts.map((post) => {
                const topic = typeof post.topics?.[0] === 'object' ? post.topics[0]?.slug : post.slug;
                const tint = `var(--spine-${(hash(topic || post.slug) % 5) + 1})`;
                const height = 240 + (hash(post.slug) % 81);
                const selectedPost = String(post.id) === String(selected?.id);
                return (
                  <Link
                    key={post.id}
                    href={`/writing/${post.slug}`}
                    aria-label={`${post.title}${post.published_at ? `, ${new Date(post.published_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}` : ''}, ${post.reading_time ?? 1} min read`}
                    onMouseEnter={() => setSelectedId(String(post.id))}
                    onFocus={() => setSelectedId(String(post.id))}
                    onClick={() => setSelectedId(String(post.id))}
                    className="group flex h-[var(--spine-height)] w-[clamp(44px,4.2vw,64px)] flex-col justify-between border border-[color:var(--border)] px-1.5 py-2 text-[color:var(--spine-fg)] transition-transform duration-[var(--dur-base)] [@media(hover:hover)]:hover:-translate-y-2.5 focus:outline-none"
                    style={{ height, background: tint, borderTopWidth: selectedPost ? '2px' : '1px', borderTopColor: selectedPost ? 'var(--accent)' : 'var(--border)', '--spine-height': `${height}px` } as React.CSSProperties}
                  >
                    <span className="block max-h-[180px] overflow-hidden [mask-image:linear-gradient(to_bottom,var(--spine-fg)_70%,transparent)] [writing-mode:vertical-rl] font-[family-name:var(--font-display)] text-[1.125rem]">{post.title}</span>
                    <span className="font-mono text-[var(--text-label)]">{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase() : ''}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <aside aria-label="Selected writing preview" className="lg:sticky lg:top-24 lg:self-start p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/70 rounded-[var(--radius-s)] shadow-sm">
          {typeof selected.cover_image === 'object' && selected.cover_image?.url && (
            <div className="mb-4 relative aspect-[16/10] overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)]">
              <ProjectImage src={selected.cover_image.url} alt={selected.cover_image.alt_text || selected.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
            </div>
          )}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-mono text-[var(--text-label)] text-[color:var(--accent-text)]">{(selected.topics as any[])?.map((topic) => typeof topic === 'object' ? topic.name : '').filter(Boolean).join(' · ').toUpperCase()}</p>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-[color:var(--border)] text-[color:var(--text-muted)]">
              {selected.reading_time ?? 1} MIN READ
            </span>
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-tight">{selected.title}</h2>
          {selected.excerpt && <p className="mt-3 text-[var(--text-body)] text-[color:var(--text-muted)] leading-relaxed">{selected.excerpt}</p>}
          <p className="mt-4 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">
            {selected.published_at ? new Date(selected.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() : ''}
          </p>
          <Link href={`/writing/${selected.slug}`} className="mt-5 btn-cta-solid">
            <span>READ ARTICLE</span>
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      )}
    </div>
  );
}
