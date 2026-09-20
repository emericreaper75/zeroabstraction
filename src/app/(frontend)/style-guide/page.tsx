'use client';

import { useTheme } from '@/components/theme-provider';
import { notFound } from 'next/navigation';
import { Display, Heading, Title, Body, Label } from '@/components/typography';
import { EditorialLink } from '@/components/EditorialLink';
import { Divider } from '@/components/Divider';
import { ProjectImage } from '@/components/ProjectImage';

export default function StyleGuide() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  const { theme, setTheme } = useTheme();

  const simpleToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <main className="container-wide" style={{ paddingBlock: 'var(--space-8)' }}>
      <header className="mb-12 flex items-center justify-between">
        <h1 style={{ fontSize: 'var(--text-hero)', fontFamily: 'var(--font-display)' }}>
          Style Guide
        </h1>
        <button
          onClick={simpleToggle}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            background: 'var(--bg)',
            color: 'var(--text)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-small)',
            cursor: 'pointer',
          }}
        >
          Toggle Theme ({theme})
        </button>
      </header>

      {/* Colors Section */}
      <section style={{ marginBottom: 'var(--space-9)' }}>
        <h2
          style={{
            fontSize: 'var(--text-heading)',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Colors
        </h2>
        <div className="flex flex-wrap gap-8">
          {[
            { name: '--bg', color: 'var(--bg)' },
            { name: '--text', color: 'var(--text)' },
            { name: '--muted', color: 'var(--muted)' },
            { name: '--border', color: 'var(--border)' },
            { name: '--accent', color: 'var(--accent)' },
          ].map((token) => (
            <div key={token.name} className="flex flex-col items-center">
              <div
                style={{
                  backgroundColor: token.color,
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  marginBottom: 'var(--space-3)',
                }}
              />
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)' }}>
                {token.name}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section style={{ marginBottom: 'var(--space-9)' }}>
        <h2
          style={{
            fontSize: 'var(--text-heading)',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Typography
        </h2>
        <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;Display&gt;
              </code>
            </div>
            <Display>The quick brown fox</Display>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;Heading&gt;
              </code>
            </div>
            <Heading>The quick brown fox</Heading>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;Title&gt;
              </code>
            </div>
            <Title>The quick brown fox</Title>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;Body&gt;
              </code>
            </div>
            <Body>The quick brown fox jumps over the lazy dog.</Body>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;Label&gt;
              </code>
            </div>
            <Label>THE QUICK BROWN FOX</Label>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section>
        <h2
          style={{
            fontSize: 'var(--text-heading)',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Spacing Scale
        </h2>
        <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="shrink-0 text-right md:w-32">
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)' }}>
                  --space-{i}
                </code>
              </div>
              <div
                style={{
                  height: 'var(--space-3)',
                  width: `var(--space-${i})`,
                  backgroundColor: 'var(--accent)',
                  borderRadius: '2px',
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Components Section */}
      <section style={{ marginTop: 'var(--space-9)' }}>
        <h2
          style={{
            fontSize: 'var(--text-heading)',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Components
        </h2>
        <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;EditorialLink variant="default"&gt;
              </code>
            </div>
            <EditorialLink href="#">View Project</EditorialLink>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="shrink-0 md:w-48">
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;EditorialLink variant="muted"&gt;
              </code>
            </div>
            <EditorialLink href="#" variant="muted">
              Back to home
            </EditorialLink>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)' }}>
                &lt;ProjectImage /&gt;
              </code>
            </div>
            <div style={{ maxWidth: '600px' }}>
              <ProjectImage
                src="/placeholder.svg"
                alt="Project Placeholder"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Borders & Dividers */}
      <section style={{ marginTop: 'var(--space-9)' }}>
        <h2
          style={{
            fontSize: 'var(--text-heading)',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Borders & Dividers
        </h2>
        
        <div className="flex flex-col" style={{ gap: 'var(--space-8)' }}>
          <div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)', display: 'block', marginBottom: 'var(--space-4)' }}>
              &lt;Divider /&gt;
            </code>
            <Divider />
          </div>

          <div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)', display: 'block', marginBottom: 'var(--space-4)' }}>
              .ui-border utilities
            </code>
            <div className="flex flex-wrap gap-8">
              <div className="ui-border flex items-center justify-center" style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg)' }}>
                <Label>.ui-border</Label>
              </div>
              <div className="ui-border-t flex items-center justify-center" style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg)' }}>
                <Label>.ui-border-t</Label>
              </div>
              <div className="ui-border-b flex items-center justify-center" style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg)' }}>
                <Label>.ui-border-b</Label>
              </div>
              <div className="ui-border-l flex items-center justify-center" style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg)' }}>
                <Label>.ui-border-l</Label>
              </div>
              <div className="ui-border-r flex items-center justify-center" style={{ width: '120px', height: '120px', backgroundColor: 'var(--bg)' }}>
                <Label>.ui-border-r</Label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
