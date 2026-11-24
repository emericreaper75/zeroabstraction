'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { ProjectImage } from './ProjectImage';
import { Title, Label, Body } from './typography';

import type { Project } from '@/payload-types';

export function FeaturedProjectCard({ project, isEven }: { project: Project, isEven: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  
  const imageUrl = typeof project.cover_image === 'object' && project.cover_image?.url ? project.cover_image.url : '/placeholder.svg';
  const imageAlt = typeof project.cover_image === 'object' && project.cover_image?.alt_text ? project.cover_image.alt_text : `MISSING ALT TEXT - ${project.title}`;

  return (
    <motion.div 
      className="grid grid-cols-1 items-center group cursor-pointer relative min-w-0 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
      style={{ gap: 'var(--space-8)' }}
      whileHover={shouldReduceMotion ? undefined : "hover"}
      initial="initial"
    >
      <div className={`min-w-0 ${!isEven ? 'md:order-2 order-1' : ''}`}>
        <Link href={`/projects/${project.slug}`} style={{ display: 'block' }}>
          <figure className="overflow-hidden rounded-[var(--radius-s)]">
            <motion.div
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.03 }
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* We override the default ProjectImage hover by removing the tailwind class in the parent rendering, but it's easier to just use standard next/image here */}
              <ProjectImage 
                transitionName={`project-hero-${project.slug}`} 
                src={imageUrl} 
                alt={imageAlt} 
                width={800} 
                height={600} 
                className="w-full h-auto !transition-none !scale-100" 
              />
            </motion.div>
          </figure>
        </Link>
      </div>
      <div className={`min-w-0 flex flex-col items-start ${!isEven ? 'md:order-1 order-2' : ''}`} style={{ gap: 'var(--space-4)' }}>
        <div className="relative">
          <Title as="h3">{project.title}</Title>
          <div className="w-12 h-0.5 bg-[color:var(--accent)] mt-2 transition-all duration-300 group-hover:w-full" />
        </div>
        <div className="flex items-center flex-wrap" style={{ gap: 'var(--space-3)' }}>
          <Label className="text-[color:var(--text-muted)]">{project.year || new Date().getFullYear()}</Label>
          <span className="text-[color:var(--text-muted)]">•</span>
          {project.technologies && project.technologies.length > 0 && (
            <Label className="text-[color:var(--text-muted)]">
              {project.technologies.slice(0, 2).map((t: unknown) => typeof t === 'object' && t !== null && 'name' in t ? (t as { name: string }).name : '').filter(Boolean).join(' & ').toUpperCase()}
            </Label>
          )}
        </div>
        <Body className="text-[color:var(--text-muted)]">
          {project.summary}
        </Body>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <Link href={`/projects/${project.slug}`} className="ui-editorial-link group/link flex items-center hover:text-[color:var(--accent-text)] transition-colors" style={{ textDecoration: 'none' }}>
            <span className="border-b border-transparent group-hover/link:border-[color:var(--accent-text)] transition-colors">VIEW PROJECT</span>
            <motion.span 
              className="ml-2 inline-block text-[color:var(--accent-text)]"
              variants={{
                initial: { x: 0 },
                hover: { x: 5 }
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
