'use client';

import { useTheme } from '@/components/theme-provider';
import { notFound } from 'next/navigation';
import { Display, Heading, Title, Body, Label } from '@/components/typography';
import { EditorialLink } from '@/components/EditorialLink';
import { Divider } from '@/components/Divider';
import { ProjectImage } from '@/components/ProjectImage';
import { CollageFrame } from '@/components/CollageFrame';
import { CollageShape } from '@/components/CollageShape';

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
          Core Palette (Palette 01 Warm Sand Light / Palette 03 Indigo Dark)
        </h2>
        <div className="flex flex-wrap gap-8">
          {[
            { name: '--bg', label: 'Base Canvas', color: 'var(--bg)' },
            { name: '--surface', label: 'Surface', color: 'var(--surface)' },
            { name: '--surface-hover', label: 'Surface Hover', color: 'var(--surface-hover)' },
            { name: '--text', label: 'Text / Heading', color: 'var(--text)' },
            { name: '--muted', label: 'Muted Text', color: 'var(--muted)' },
            { name: '--border', label: 'Divider / Border', color: 'var(--border)' },
            { name: '--border-strong', label: 'Outline / Strong', color: 'var(--border-strong)' },
            { name: '--accent', label: 'Primary Accent', color: 'var(--accent)' },
            { name: '--accent-hover', label: 'Accent Hover', color: 'var(--accent-hover)' },
            { name: '--secondary', label: 'Secondary Accent', color: 'var(--secondary)' },
            { name: '--secondary-hover', label: 'Secondary Hover', color: 'var(--secondary-hover)' },
            { name: '--success', label: 'Success', color: 'var(--success)' },
            { name: '--warning', label: 'Warning', color: 'var(--warning)' },
          ].map((token) => (
            <div key={token.name} className="flex flex-col items-center">
              <div
                style={{
                  backgroundColor: token.color,
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  marginBottom: 'var(--space-3)',
                }}
              />
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', fontWeight: 600 }}>
                {token.name}
              </code>
              <span style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', maxWidth: '100px', marginTop: '2px' }}>
                {token.label}
              </span>
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
              &lt;Divider variant=&quot;default&quot; /&gt;
            </code>
            <Divider />
          </div>

          <div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)', display: 'block', marginBottom: 'var(--space-4)' }}>
              &lt;Divider variant=&quot;hand-drawn&quot; /&gt; (Vermillion Editorial Wave)
            </code>
            <Divider variant="hand-drawn" />
          </div>

          <div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)', display: 'block', marginBottom: 'var(--space-4)' }}>
              &lt;Divider variant=&quot;vermillion&quot; /&gt; (Vermillion Node Rule)
            </code>
            <Divider variant="vermillion" />
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

      {/* Collage Art Components Section */}
      <section style={{ marginTop: 'var(--space-9)' }}>
        <h2
          style={{
            fontSize: 'var(--text-heading)',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--space-6)',
          }}
        >
          Collage Art Components
        </h2>

        <div className="flex flex-col gap-10">
          <div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)', display: 'block', marginBottom: 'var(--space-4)' }}>
              &lt;CollageFrame tornEdge rotation={-2} borderAccent=&quot;emerald&quot; /&gt;
            </code>
            <div className="flex flex-wrap gap-8 items-center">
              <CollageFrame
                rotation={-2}
                tornEdge={true}
                shadow="md"
                borderAccent="emerald"
                className="p-6 max-w-xs"
              >
                <Title as="h3">Torn Emerald Frame</Title>
                <Body className="text-sm text-[color:var(--muted)] mt-2">
                  Editorial frame with torn paper clip-path and subtle counter-clockwise rotation.
                </Body>
              </CollageFrame>

              <CollageFrame
                rotation={2}
                tornEdge={true}
                shadow="lg"
                borderAccent="vermillion"
                className="p-6 max-w-xs"
              >
                <Title as="h3">Torn Vermillion Frame</Title>
                <Body className="text-sm text-[color:var(--muted)] mt-2">
                  Warm Ivory card substrate with vermillion accent border and clockwise rotation.
                </Body>
              </CollageFrame>
            </div>
          </div>

          <div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-label)', color: 'var(--muted)', display: 'block', marginBottom: 'var(--space-4)' }}>
              &lt;CollageShape /&gt; Decorative Abstract Geometries
            </code>
            <div className="relative h-48 border border-dashed border-[color:var(--border)] rounded flex items-center justify-center overflow-hidden bg-[color:var(--surface)]">
              <CollageShape type="circle" color="emerald" size={160} opacity={0.2} style={{ top: '10px', left: '20px' }} />
              <CollageShape type="slash" color="vermillion" size={180} opacity={0.35} style={{ top: '40px', left: '220px' }} />
              <CollageShape type="ring" color="emerald" size={120} opacity={0.4} style={{ top: '20px', right: '140px' }} />
              <CollageShape type="dots" color="vermillion" size={80} opacity={0.4} style={{ bottom: '15px', right: '30px' }} />
              <span className="relative z-10 font-mono text-sm text-[color:var(--text)] bg-[color:var(--bg)]/80 px-4 py-2 rounded">
                Layered Astronomical Collage Layer Demo
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
