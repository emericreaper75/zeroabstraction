'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Post } from '@/payload-types';

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i++) result = ((result * 31) + value.charCodeAt(i)) >>> 0;
  return result;
}

function EssayVectorDiagram({ slug }: { slug: string }) {
  const variant = hash(slug) % 2;

  if (variant === 0) {
    // Gravitational Lensing Ray-Tracing Arc Diagram
    return (
      <svg viewBox="0 0 360 180" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id={`essay-grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="360" height="180" fill={`url(#essay-grid-${slug})`} />
        {/* Optical Axis */}
        <line x1="20" y1="90" x2="340" y2="90" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="4 4" />
        {/* Lens Mass & Einstein Ring */}
        <circle cx="180" cy="90" r="36" fill="none" stroke="var(--accent)" strokeWidth="1" className="schematic-flow" opacity="0.65" />
        <circle cx="180" cy="90" r="14" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.5" />
        {/* Bent Light Rays */}
        <path d="M 32 42 Q 180 20, 328 90" fill="none" stroke="var(--secondary)" strokeWidth="1.5" />
        <path d="M 32 138 Q 180 160, 328 90" fill="none" stroke="var(--secondary)" strokeWidth="1.5" />
        <path d="M 32 64 Q 180 54, 328 90" fill="none" stroke="var(--accent)" strokeWidth="1.15" opacity="0.8" />
        <path d="M 32 116 Q 180 126, 328 90" fill="none" stroke="var(--accent)" strokeWidth="1.15" opacity="0.8" />
        {/* Source & Observer */}
        <circle cx="32" cy="90" r="3.5" fill="var(--text-muted)" />
        <circle cx="328" cy="90" r="4" fill="var(--secondary)" />
        <text x="14" y="20" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
          FIG // GRAVITATIONAL LENSING ARC
        </text>
        <text x="256" y="168" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
          θ_E = √(4GM/c²D)
        </text>
      </svg>
    );
  }

  // Phase-Space / Quantum Harmonic Potential Diagram
  return (
    <svg viewBox="0 0 360 180" className="w-full h-full" aria-hidden="true">
      <defs>
        <pattern id={`essay-grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="360" height="180" fill={`url(#essay-grid-${slug})`} />
      <line x1="30" y1="145" x2="330" y2="145" stroke="var(--border-strong)" strokeWidth="1" />
      <line x1="180" y1="22" x2="180" y2="155" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M 70 28 Q 180 250, 290 28" fill="none" stroke="var(--accent)" strokeWidth="1.75" />
      <line x1="104" y1="74" x2="256" y2="74" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="126" y1="108" x2="234" y2="108" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M 108 74 C 135 50, 155 98, 180 74 C 205 50, 225 98, 252 74" fill="none" stroke="var(--secondary)" strokeWidth="1.5" />
      <path d="M 130 108 Q 180 86, 230 108" fill="none" stroke="var(--accent)" strokeWidth="1.25" />
      <text x="14" y="20" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
        FIG // EIGENSTATE POTENTIAL
      </text>
      <text x="262" y="168" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
        E_n = ℏω(n + ½)
      </text>
    </svg>
  );
}

export function WritingShelf({ posts }: { posts: Post[] }) {
  const [selectedId, setSelectedId] = useState(String(posts[0]?.id ?? ''));
  const prefersReducedMotion = useReducedMotion();
  const selected = posts.find((post) => String(post.id) === selectedId) ?? posts[0];
  const groups = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = post.published_at ? new Date(post.published_at).getUTCFullYear().toString() : 'UNDATED';
    (acc[year] ??= []).push(post);
    return acc;
  }, {});

  const selectedTopics = ((selected?.topics as unknown[]) ?? [])
    .map((topic) => (typeof topic === 'object' && topic !== null && 'name' in topic ? String((topic as { name: string }).name) : ''))
    .filter(Boolean)
    .join(' · ')
    .toUpperCase();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[11fr_9fr] items-start">
      {/* Left: Recessed Shelf Tray (55%) */}
      <div className="flex flex-col gap-6">
        {Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([year, yearPosts]) => (
          <section
            key={year}
            aria-label={year}
            className="rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--bg-subtle)]/55 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[var(--text-label)] tracking-widest text-[color:var(--text-muted)]">
                {year}
              </h2>
              <span className="font-mono text-[10px] tracking-widest text-[color:var(--text-muted)] uppercase">
                {yearPosts.length} {yearPosts.length === 1 ? 'VOLUME' : 'VOLUMES'}
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-3 px-2 pt-2 pb-3 border-b-2 border-[color:var(--border-strong)] shadow-[0_10px_12px_-10px_var(--shade)]">
              {yearPosts.map((post) => {
                const topic = typeof post.topics?.[0] === 'object' ? post.topics[0]?.slug : post.slug;
                const tint = `var(--spine-${(hash(topic || post.slug) % 5) + 1})`;
                const height = 240 + (hash(post.slug) % 65);
                const selectedPost = String(post.id) === String(selected?.id);
                return (
                  <Link
                    key={post.id}
                    href={`/writing/${post.slug}`}
                    aria-label={`${post.title}${post.published_at ? `, ${new Date(post.published_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}` : ''}, ${post.reading_time ?? 1} min read`}
                    onMouseEnter={() => setSelectedId(String(post.id))}
                    onFocus={() => setSelectedId(String(post.id))}
                    onClick={() => setSelectedId(String(post.id))}
                    style={{
                      height,
                      background: selectedPost ? 'var(--accent-subtle)' : tint,
                      color: selectedPost ? 'var(--accent-text)' : 'var(--spine-fg)',
                      borderColor: selectedPost ? 'var(--accent)' : 'var(--border)',
                      '--spine-height': `${height}px`,
                    } as React.CSSProperties}
                    className={`group flex h-[var(--spine-height)] w-[clamp(48px,4.5vw,66px)] flex-col justify-between border px-1.5 py-2.5 rounded-t-[var(--radius-s)] transition-transform duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] ${
                      selectedPost ? '-translate-y-2 shadow-md' : '[@media(hover:hover)]:hover:-translate-y-2'
                    }`}
                  >
                    <span className="block max-h-[175px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)] [writing-mode:vertical-rl] font-[family-name:var(--font-display)] text-[1.125rem] leading-tight">
                      {post.title}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider opacity-80">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }).toUpperCase() : ''}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Right: Inspector Preview Card (45%) */}
      {selected && (
        <aside
          aria-label="Selected writing preview"
          className="lg:sticky lg:top-24 lg:self-start p-6 border border-[color:var(--border)] bg-[color:var(--surface)]/75 rounded-[var(--radius-s)] shadow-sm overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              {/* Theme-aware SVG Vector Diagram on Recessed Surface */}
              <div className="aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--math-bg)] p-2">
                <EssayVectorDiagram slug={selected.slug} />
              </div>

              {/* Category + Reading Time */}
              <div className="flex items-center justify-between gap-2 flex-wrap font-mono text-[var(--text-label)] tracking-wider">
                <span className="text-[color:var(--accent-text)]">
                  {selectedTopics || 'ESSAY'}
                </span>
                <span className="text-[color:var(--text-muted)]">
                  {selected.reading_time ?? 1} MIN READ
                </span>
              </div>

              {/* Title */}
              <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h2)] leading-tight text-[color:var(--text)]">
                {selected.title}
              </h2>

              {/* 3-line Summary */}
              {selected.excerpt && (
                <p className="text-sm sm:text-base text-[color:var(--text-muted)] leading-relaxed line-clamp-3">
                  {selected.excerpt}
                </p>
              )}

              {/* Publication Date & CTA */}
              <div className="pt-3 border-t border-[color:var(--border)] flex items-center justify-between gap-4 flex-wrap">
                <span className="font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">
                  {selected.published_at
                    ? new Date(selected.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
                    : 'PUBLISHED'}
                </span>
                <Link href={`/writing/${selected.slug}`} className="btn-cta-solid">
                  <span>READ ARTICLE</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </aside>
      )}
    </div>
  );
}
