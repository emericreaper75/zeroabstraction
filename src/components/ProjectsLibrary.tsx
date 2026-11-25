import Link from 'next/link';
import type { Project } from '@/payload-types';

function hash(value: string) {
  let result = 0;
  for (let i = 0; i < value.length; i++) result = ((result * 31) + value.charCodeAt(i)) >>> 0;
  return result;
}

function ProjectSchematic({ variant, slug }: { variant: number; slug: string }) {
  const mode = variant % 3;

  if (mode === 0) {
    // Cryogenic / Focal Plane Detector Array Schematic
    return (
      <svg viewBox="0 0 320 200" className="w-full h-full max-h-56" aria-hidden="true">
        <defs>
          <pattern id={`grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="200" fill={`url(#grid-${slug})`} />
        <circle cx="160" cy="100" r="68" fill="none" stroke="var(--border-strong)" strokeWidth="1" className="schematic-flow" />
        <circle cx="160" cy="100" r="46" fill="none" stroke="var(--accent)" strokeWidth="1.25" opacity="0.7" />
        <circle cx="160" cy="100" r="22" fill="none" stroke="var(--secondary)" strokeWidth="1.25" />
        <line x1="60" y1="100" x2="260" y2="100" stroke="var(--border-strong)" strokeWidth="1" />
        <line x1="160" y1="20" x2="160" y2="180" stroke="var(--border-strong)" strokeWidth="1" />
        {[-30, 0, 30].map((dx) =>
          [-30, 0, 30].map((dy) => (
            <rect
              key={`${dx}-${dy}`}
              x={160 + dx - 5}
              y={100 + dy - 5}
              width="10"
              height="10"
              rx="1"
              fill={dx === 0 && dy === 0 ? 'var(--secondary)' : 'var(--accent-subtle)'}
              stroke="var(--accent)"
              strokeWidth="1"
            />
          ))
        )}
        <text x="14" y="22" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
          FIG.01 // DETECTOR ARRAY
        </text>
        <text x="236" y="186" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
          300 mK STAGE
        </text>
      </svg>
    );
  }

  if (mode === 1) {
    // Harmonic Signal / Matched-Filter Waveform Diagram
    return (
      <svg viewBox="0 0 320 200" className="w-full h-full max-h-56" aria-hidden="true">
        <defs>
          <pattern id={`grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="200" fill={`url(#grid-${slug})`} />
        <line x1="24" y1="100" x2="296" y2="100" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="24" y1="40" x2="24" y2="160" stroke="var(--border-strong)" strokeWidth="1" />
        <path
          d="M 24 100 Q 52 38, 80 100 T 136 100 T 192 100 T 248 100 T 296 100"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.75"
        />
        <path
          d="M 24 100 C 60 65, 90 135, 130 100 C 170 65, 200 135, 240 100 L 296 100"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="1.25"
          className="schematic-flow"
        />
        <circle cx="136" cy="100" r="3.5" fill="var(--secondary)" />
        <circle cx="248" cy="100" r="3.5" fill="var(--accent)" />
        <text x="14" y="22" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
          FIG.02 // SPECTRAL RESPONSE
        </text>
        <text x="232" y="186" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
          SNR &gt; 14.2 dB
        </text>
      </svg>
    );
  }

  // Ray-Tracing / Optical Interferometer Diagram
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full max-h-56" aria-hidden="true">
      <defs>
        <pattern id={`grid-${slug}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--grid-line)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill={`url(#grid-${slug})`} />
      <path d="M 64 36 Q 94 100, 64 164" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <line x1="28" y1="60" x2="75" y2="60" stroke="var(--secondary)" strokeWidth="1.25" />
      <line x1="28" y1="100" x2="78" y2="100" stroke="var(--secondary)" strokeWidth="1.25" />
      <line x1="28" y1="140" x2="75" y2="140" stroke="var(--secondary)" strokeWidth="1.25" />
      <line x1="75" y1="60" x2="230" y2="100" stroke="var(--accent)" strokeWidth="1.15" />
      <line x1="78" y1="100" x2="230" y2="100" stroke="var(--accent)" strokeWidth="1.15" />
      <line x1="75" y1="140" x2="230" y2="100" stroke="var(--accent)" strokeWidth="1.15" />
      <rect x="230" y="84" width="10" height="32" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.25" />
      <circle cx="230" cy="100" r="3" fill="var(--secondary)" />
      <text x="14" y="22" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
        FIG.03 // RAY-TRACE GEOMETRY
      </text>
      <text x="220" y="186" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">
        FOCAL PLANE
      </text>
    </svg>
  );
}

export function ProjectsLibrary({ projects }: { projects: Project[] }) {
  const ordered = [...projects].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.year ?? 0) - (a.year ?? 0)
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {ordered.map((project, idx) => {
        const catalogId = `PRJ // ${String(idx + 1).padStart(3, '0')}`;
        const statusLabel = project.status?.replace('_', ' ').toUpperCase() || 'ACTIVE';
        const techNames = (project.technologies ?? [])
          .map((t) => t.name?.toUpperCase())
          .filter(Boolean);
        const topicNames = (project.topics ?? [])
          .map((t) => (typeof t === 'object' && t !== null && 'name' in t ? String(t.name).toUpperCase() : ''))
          .filter(Boolean);
        const specs = (techNames.length > 0 ? techNames : topicNames).slice(0, 4);
        const secondaryLink = project.links?.[0]?.url ? project.links[0] : null;

        return (
          <article
            key={project.id}
            className="group w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] border border-[color:var(--border)] hover:border-[color:var(--accent-border)] bg-[color:var(--surface)] rounded-[var(--radius-s)] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Left Visual Stage (40%) */}
            <div className="p-4 sm:p-6 bg-[color:var(--bg-subtle)] border-b lg:border-b-0 lg:border-r border-[color:var(--border)] flex items-center justify-center">
              <Link
                href={`/projects/${project.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="w-full h-full min-h-[200px] rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--math-bg)] p-3 flex items-center justify-center hover:border-[color:var(--accent-border)] transition-colors"
                style={{ textDecoration: 'none' }}
              >
                <ProjectSchematic variant={hash(project.slug)} slug={project.slug} />
              </Link>
            </div>

            {/* Right Engineering Dossier (60%) */}
            <div className="p-6 sm:p-8 flex flex-col justify-between gap-5">
              {/* Top Metadata Bar */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="font-mono text-xs tracking-widest uppercase text-[color:var(--text-muted)]">
                  {catalogId} · {project.year ?? '—'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-subtle)] font-mono text-[10px] tracking-widest uppercase text-[color:var(--accent-text)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--secondary)]" aria-hidden="true" />
                  <span>{statusLabel}</span>
                </span>
              </div>

              {/* Title + Full Summary */}
              <div className="flex flex-col gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-normal leading-snug text-[color:var(--text)]">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-[color:var(--accent-text)] transition-colors"
                    style={{ textDecoration: 'none' }}
                  >
                    {project.title}
                  </Link>
                </h2>
                {project.summary && (
                  <p className="text-sm sm:text-base text-[color:var(--text-muted)] leading-relaxed">
                    {project.summary}
                  </p>
                )}
              </div>

              {/* Technical Specification Strip */}
              <div className="px-3.5 py-2.5 rounded-[var(--radius-s)] border border-[color:var(--border)] bg-[color:var(--bg-subtle)] font-mono text-[11px] tracking-wider uppercase text-[color:var(--text-muted)]">
                {specs.length > 0 ? specs.join(' · ') : 'SYSTEM ARCHITECTURE · RESEARCH PROTOTYPE'}
              </div>

              {/* Footer Action Row */}
              <div className="pt-2 border-t border-[color:var(--border)] flex items-center justify-between gap-4 flex-wrap">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-[color:var(--accent-text)] hover:underline"
                  style={{ textDecoration: 'none' }}
                >
                  <span>INSPECT SYSTEM</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                {secondaryLink?.url && (
                  <a
                    href={secondaryLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs tracking-wider uppercase text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{secondaryLink.label?.toUpperCase() || 'SOURCE / SCHEMATICS'}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
