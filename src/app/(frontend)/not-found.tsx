import { Display, Title, Body, Label } from '@/components/typography';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-wide min-h-[75vh] flex flex-col justify-center items-center text-center relative architectural-grid border-b border-[color:var(--border)]">
      <Reveal>
        <div className="flex flex-col items-center p-8 sm:p-12 border border-[color:var(--border)] bg-[color:var(--bg)]/90 [backdrop-filter:blur(8px)] rounded-[var(--radius-s)]" style={{ gap: 'var(--space-5)' }}>
          <Label className="text-[color:var(--accent-text)] tracking-widest">ERR_404 // TRAJECTORY_NULL</Label>
          <Display>404</Display>
          <div className="flex flex-col items-center" style={{ gap: 'var(--space-2)' }}>
            <Title as="h2">Signal Lost</Title>
            <Body className="text-[color:var(--muted)]" style={{ maxWidth: '420px' }}>
              The trajectory you&apos;re following doesn&apos;t map to any known coordinates in this space.
            </Body>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/" className="btn-cta-solid">
              <span>RETURN TO BASE</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/projects"
              className="min-h-[44px] px-4 inline-flex items-center font-mono text-xs tracking-wider uppercase border border-[color:var(--border)] rounded-[var(--radius-s)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] transition-colors"
              style={{ textDecoration: 'none' }}
            >
              PROJECTS
            </Link>
            <Link
              href="/writing"
              className="min-h-[44px] px-4 inline-flex items-center font-mono text-xs tracking-wider uppercase border border-[color:var(--border)] rounded-[var(--radius-s)] text-[color:var(--text-muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent-text)] transition-colors"
              style={{ textDecoration: 'none' }}
            >
              WRITING
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
