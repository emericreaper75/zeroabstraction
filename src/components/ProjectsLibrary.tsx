import Link from 'next/link';
import type { Project } from '@/payload-types';
import { ProjectImage } from './ProjectImage';

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i++) result = ((result * 31) + value.charCodeAt(i)) >>> 0;
  return result;
}

export function ProjectsLibrary({ projects }: { projects: Project[] }) {
  const ordered = [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.year ?? 0) - (a.year ?? 0));
  return (
    <div className="grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(clamp(200px,22vw,280px),1fr))]">
      {ordered.map((project) => {
        const tint = `var(--spine-${(hash(project.slug) % 5) + 1})`;
        const cover = typeof project.cover_image === 'object' ? project.cover_image : null;
        return (
          <Link key={project.id} href={`/projects/${project.slug}`} className="group flex flex-col">
            {project.featured && <span className="mb-2 font-mono text-[var(--text-label)] text-[color:var(--accent-text)]">FEATURED</span>}
            <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-s)] border-b border-[color:var(--border-strong)] shadow-[0_10px_12px_-10px_var(--shade)] [perspective:900px]">
              {cover?.url ? (
                <div className="relative h-full w-full transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] [transform-origin:left_center] [@media(hover:hover)]:group-hover:[transform:translateY(-6px)_rotateY(6deg)]">
                  <div className="absolute left-0 top-0 z-10 h-full w-[8%] bg-gradient-to-r from-[var(--shade)] to-transparent" />
                  <ProjectImage src={cover.url} alt={cover.alt_text || project.title} fill sizes="(max-width: 640px) 100vw, 280px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between p-5 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] [transform-origin:left_center] [@media(hover:hover)]:group-hover:[transform:translateY(-6px)_rotateY(6deg)]" style={{ background: tint, color: 'var(--spine-fg)' }}>
                  <h2 className="font-[family-name:var(--font-display)] text-[var(--text-h2)]">{project.title}</h2>
                  <span className="font-mono text-[var(--text-label)]">{project.year ?? ''}</span>
                </div>
              )}
            </div>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-[1.5rem] leading-[var(--lh-heading)] group-hover:underline">{project.title}</h2>
            <p className="mt-2 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">{project.year ?? ''} · {project.status?.replace('_', ' ').toUpperCase()}</p>
            {project.technologies?.length ? (
              <p className="mt-2 font-mono text-[var(--text-label)] text-[color:var(--text-muted)]">{project.technologies.slice(0, 3).map((technology) => technology.name).join(' / ')}</p>
            ) : null}
            <span className="mt-3 font-mono text-[var(--text-ui-sm)]">VIEW PROJECT →</span>
          </Link>
        );
      })}
    </div>
  );
}
