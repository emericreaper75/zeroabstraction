import { Display, Title, Body } from '@/components/typography';
import { EditorialLink } from '@/components/EditorialLink';
import { Reveal } from '@/components/Reveal';

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
            <EditorialLink href="/">RETURN TO BASE</EditorialLink>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
