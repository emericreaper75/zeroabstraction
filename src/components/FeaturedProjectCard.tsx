'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import type { Project } from '@/payload-types';

interface FeaturedProjectCardProps {
  project?: Project | null;
  isEven?: boolean;
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const title = project?.title || 'Cryogenic Focal Plane Array for Submillimeter Polarimetry';
  const year = project?.year || 2025;
  const summary = project?.summary || 'A high sensitivity sub-Kelvin detector system engineered for balloon-borne cosmic microwave background polarimetry.';
  const slug = project?.slug || 'fpga-signal-processing';

  // Determine image source
  let imageUrl = '/images/featured_galaxy.jpg';
  let imageAlt = 'Cryogenic Focal Plane Array for Submillimeter Polarimetry - Galaxy Observation';

  if (project?.cover_image && typeof project.cover_image === 'object' && project.cover_image.url) {
    imageUrl = project.cover_image.url;
    imageAlt = project.cover_image.alt_text || title;
  }

  // Technologies / Metadata formatting
  let techString = 'WRITING • BIOGRAPHY';
  if (project?.technologies && project.technologies.length > 0) {
    const list = project.technologies
      .slice(0, 2)
      .map((t: unknown) => (typeof t === 'object' && t !== null && 'name' in t ? (t as { name: string }).name : ''))
      .filter(Boolean);
    if (list.length > 0) {
      techString = list.join(' • ').toUpperCase();
    }
  }

  return (
    <div className="w-full">
      {/* 50/50 Asymmetric Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column: Larger framed galaxy image overlaid on architectural background grid */}
        <div className="relative p-6 sm:p-10 lg:p-12 architectural-grid border border-[color:var(--border)]/40 rounded-[var(--radius-s)] flex items-center justify-center">
          <Link href={`/projects/${slug}`} className="w-full block group" tabIndex={-1} aria-hidden="true">
            <figure className="relative w-full overflow-hidden rounded-[var(--radius-s)] border border-[color:var(--border)] shadow-md bg-black">
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={800}
                height={550}
                className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                priority
              />
            </figure>
          </Link>
        </div>

        {/* Right Column: Editorial Serif Heading, Metadata Row, Description & Slate-Blue CTA Button */}
        <div className="flex flex-col items-start gap-5 max-w-xl">
          <Link href={`/projects/${slug}`} className="hover:opacity-85 transition-opacity" style={{ textDecoration: 'none' }}>
            <h3 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[2.65rem] font-light leading-[1.15] text-[color:var(--text)]">
              {title}
            </h3>
          </Link>

          {/* Metadata Row */}
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[color:var(--text-muted)] uppercase">
            <span>{year}</span>
            <span>•</span>
            <span>{techString}</span>
          </div>

          {/* Short Description */}
          <p className="text-[color:var(--text-muted)] text-sm sm:text-base leading-relaxed font-sans">
            {summary}
          </p>

          {/* Solid Slate-Blue CTA Button */}
          <div className="pt-2">
            <Link href={`/projects/${slug}`} className="btn-cta-solid">
              <span>VIEW PROJECT</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
