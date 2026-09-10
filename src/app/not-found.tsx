import { Display, Title, Body, Label } from '@/components/typography';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-wide min-h-[70vh] flex flex-col justify-center items-center text-center">
      <Reveal>
        <div className="flex flex-col items-center" style={{ gap: 'var(--space-6)' }}>
          <Display>404</Display>
          <div className="flex flex-col items-center" style={{ gap: 'var(--space-2)' }}>
            <Title as="h2">Signal Lost</Title>
            <Body className="text-[color:var(--muted)]" style={{ maxWidth: '400px' }}>
              The trajectory you're following doesn't map to any known coordinates in this space.
            </Body>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link href="/" className="hover:text-[color:var(--accent)] transition-colors" style={{ textDecoration: 'none' }}>
              <Label>RETURN TO BASE</Label>
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
