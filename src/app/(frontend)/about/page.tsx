import type { Metadata } from 'next';
import { Display, Heading, Title, Label, Body } from '@/components/typography';
import { ProjectImage } from '@/components/ProjectImage';
import { EditorialLink } from '@/components/EditorialLink';
import { Reveal } from '@/components/Reveal';
import { getProfile } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About — ZeroAbstraction',
  description:
    'Manoj Amavasya — Electronics and Communication Engineering undergraduate building a foundation for research in Physics, Astrophysics, and Scientific Computing.',
};

export default async function AboutPage() {
  const profile = await getProfile().catch(() => null);

  const profileImgUrl =
    typeof profile?.photograph === 'object' && profile?.photograph?.url
      ? profile.photograph.url
      : '/placeholder.svg';
  const profileImgAlt =
    typeof profile?.photograph === 'object' && profile?.photograph?.alt_text
      ? profile.photograph.alt_text
      : 'Manoj Amavasya — Researcher';

  return (
    <div className="container-wide pb-32">
      {/* 1. Header & Researcher Dossier */}
      <Reveal>
        <section
          className="pt-16 md:pt-24 pb-16 ui-border-b"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="flex flex-col gap-4 mb-10">
            <Label className="text-[color:var(--muted)] tracking-widest">
              ABOUT ZEROABSTRACTION
            </Label>
            <Display>Researcher</Display>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left / Photo column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="w-full ui-border overflow-hidden bg-[color:var(--bg)]">
                <ProjectImage
                  src={profileImgUrl}
                  alt={profileImgAlt}
                  width={600}
                  height={750}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Metadata Card */}
              <div className="ui-border p-6 flex flex-col gap-4 bg-[color:var(--bg)]">
                <Label className="text-[color:var(--muted)] border-b border-[color:var(--border)] pb-2">
                  ACADEMIC AFFILIATION
                </Label>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">INSTITUTION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      JNTU Anantapur
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">GRADUATION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      2027
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">LOCATION</Label>
                    <span className="font-mono text-sm text-[color:var(--text)]">
                      India
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <Label className="text-[color:var(--muted)]">PRIMARY FOCUS</Label>
                    <span className="font-mono text-sm text-right text-[color:var(--text)]">
                      ECE → Physics & Astrophysics
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right / Biography column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Title as="h2" className="text-3xl md:text-4xl leading-tight">
                Manoj Amavasya
              </Title>
              <div className="flex flex-col gap-6 text-[color:var(--text)] text-lg leading-relaxed font-sans">
                <p>
                  I am a final-year Electronics and Communication Engineering undergraduate building a
                  strong engineering foundation spanning embedded systems, digital signal processing,
                  quantum and scientific computing, and communications, with a long-term goal of pursuing
                  research in Physics and Astrophysics.
                </p>
                <p className="text-[color:var(--muted)]">
                  My academic interests connect engineering with scientific discovery. I view
                  Electronics and Communication Engineering as the foundational layer that enables work in
                  computational physics, astrophysics, signal processing, and future applications of
                  quantum computing. I prefer approaching scientific questions through evidence,
                  computation, and engineering rather than speculation.
                </p>
              </div>

              {/* Trajectory / Core Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  PHYSICS
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  ASTROPHYSICS
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  ELECTRONICS & SIGNAL PROCESSING
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  SCIENTIFIC COMPUTING
                </span>
                <span className="px-3 py-1 text-xs font-mono ui-border text-[color:var(--muted)]">
                  QUANTUM INFORMATION
                </span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 2. Why ZeroAbstraction Exists */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 flex flex-col gap-2">
              <Label className="text-[color:var(--muted)]">01 / PURPOSE</Label>
              <Heading as="h2">Why ZeroAbstraction Exists</Heading>
            </div>
            <div className="md:col-span-8 flex flex-col gap-8">
              <div>
                <Title as="h3" className="mb-4">
                  The Digital Workspace
                </Title>
                <div className="flex flex-col gap-4 text-lg leading-relaxed text-[color:var(--muted)]">
                  <p className="text-[color:var(--text)] font-medium">
                    Scientific discovery depends on documentation.
                  </p>
                  <p>
                    Ideas that are not written down disappear. Experiments that are not recorded cannot
                    be reproduced. Research that is not shared cannot be built upon.
                  </p>
                </div>
              </div>

              {/* Manifest statement */}
              <div
                className="p-8 border-l-2 bg-[color:var(--bg)] flex flex-col gap-3"
                style={{ borderColor: 'var(--accent)' }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--accent)] font-semibold">
                  ZeroAbstraction is the answer to that problem.
                </p>
                <p className="text-xl md:text-2xl font-serif text-[color:var(--text)] leading-snug">
                  It is not a portfolio designed to attract employers. It is not a blog optimized for
                  search engines. It is a research workspace — a living record of ideas, experiments,
                  engineering, and scientific exploration built to last.
                </p>
              </div>

              <div>
                <Title as="h3" className="mb-4">
                  Connecting Engineering with Fundamental Science
                </Title>
                <div className="flex flex-col gap-4 text-lg leading-relaxed text-[color:var(--muted)]">
                  <p className="text-[color:var(--text)]">
                    The distance between engineering and fundamental science is smaller than it appears.
                  </p>
                  <p>
                    Everything published here is written to be understood from first principles, reviewed
                    for scientific accuracy, and presented without artificial urgency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3. Questions That Drive My Research */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 flex flex-col gap-2">
              <Label className="text-[color:var(--muted)]">02 / INQUIRY</Label>
              <Heading as="h2">Questions That Drive My Research</Heading>
              <p className="text-sm text-[color:var(--muted)] mt-2">
                Fundamental questions at the frontier of matter, nucleosynthesis, computation, and quantum discovery.
              </p>
            </div>
            <div className="md:col-span-8 flex flex-col">
              {[
                {
                  index: '01',
                  question: 'How does matter behave under extreme gravity?',
                  description:
                    'Gravitational collapse, stellar evolution, and the microscopic physics of dense stellar remnants.',
                },
                {
                  index: '02',
                  question: 'How do stars forge heavier elements?',
                  description:
                    'Stellar nucleosynthesis — the chain of fusion reactions that produce carbon, oxygen, iron, and beyond.',
                },
                {
                  index: '03',
                  question: 'What can computation reveal about astrophysical systems?',
                  description:
                    'Using simulation, numerical methods, and data analysis to model phenomena that observation alone cannot resolve.',
                },
                {
                  index: '04',
                  question: 'Where does quantum information fit in scientific discovery?',
                  description:
                    'Exploring how quantum algorithms might contribute to sensing, communication, and future computational science.',
                },
              ].map((item, idx) => (
                <div
                  key={item.index}
                  className={`py-8 ${idx > 0 ? 'ui-border-t' : ''} flex flex-col gap-3`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="font-mono text-sm text-[color:var(--accent)] shrink-0 font-medium"
                    >
                      {item.index}
                    </span>
                    <Title as="h3" className="text-xl md:text-2xl leading-snug">
                      {item.question}
                    </Title>
                  </div>
                  <Body className="text-[color:var(--muted)] pl-8 text-base md:text-lg">
                    {item.description}
                  </Body>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 4. Research Vision */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 flex flex-col gap-2">
              <Label className="text-[color:var(--muted)]">03 / VISION</Label>
              <Heading as="h2">Research Vision</Heading>
            </div>
            <div className="md:col-span-8 flex flex-col gap-8">
              <blockquote
                className="pl-6 border-l-2 py-2"
                style={{ borderColor: 'var(--accent)' }}
              >
                <p
                  className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-[color:var(--text)] leading-snug"
                >
                  &ldquo;To contribute to scientific understanding by combining Physics, Astrophysics,
                  engineering, computation, and mathematics — investigating physical systems through
                  rigorous evidence and computational experimentation.&rdquo;
                </p>
              </blockquote>
              <div className="flex flex-col gap-4 text-lg leading-relaxed text-[color:var(--muted)]">
                <p>
                  My long-term goal is not to build engineering systems as an end in themselves, but to
                  use engineering, mathematics, and computation to better understand nature.
                </p>
                <p>
                  The journey toward them is long. ZeroAbstraction documents every step.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 5. Research Domains */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="flex flex-col gap-2 mb-10">
            <Label className="text-[color:var(--muted)]">04 / DOMAINS</Label>
            <Heading as="h2">Research Domains</Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                index: '01',
                title: 'Physics & Astrophysics',
                description:
                  'The primary scientific destination. Investigating fundamental laws from quantum-scale interactions to large-scale cosmological structure.',
              },
              {
                index: '02',
                title: 'Electronics & Mathematics',
                description:
                  'The engineering and mathematical foundation. Signal processing, communication systems, embedded design, and the analytical tools that connect physics to computation.',
              },
              {
                index: '03',
                title: 'Scientific Computing & Quantum',
                description:
                  'Numerical methods, machine learning for scientific data, and quantum computing as an emerging tool for problems resistant to classical approaches.',
              },
            ].map((domain) => (
              <div
                key={domain.index}
                className="ui-border p-8 flex flex-col gap-4 bg-[color:var(--bg)] justify-between"
              >
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-xs text-[color:var(--accent)] font-semibold">
                    {domain.index}
                  </span>
                  <Title as="h3" className="text-xl leading-snug">
                    {domain.title}
                  </Title>
                </div>
                <Body className="text-[color:var(--muted)] text-base leading-relaxed">
                  {domain.description}
                </Body>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 6. Research Toolkit */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 flex flex-col gap-2">
              <Label className="text-[color:var(--muted)]">05 / TOOLKIT</Label>
              <Heading as="h2">Research Toolkit</Heading>
              <p className="text-sm text-[color:var(--muted)] mt-2">
                Instruments, software, languages, and environments utilized for scientific inquiry and system design.
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  category: 'PROGRAMMING',
                  tools: ['Python', 'C'],
                },
                {
                  category: 'SCIENTIFIC COMPUTING',
                  tools: ['MATLAB', 'NumPy', 'Jupyter'],
                },
                {
                  category: 'ELECTRONICS',
                  tools: ['Verilog', 'Arduino', 'KiCad', 'LTspice'],
                },
                {
                  category: 'INFRASTRUCTURE',
                  tools: ['Linux', 'Git', 'Docker'],
                },
                {
                  category: 'EMERGING',
                  tools: ['Qiskit', 'Machine Learning'],
                },
              ].map((group) => (
                <div key={group.category} className="flex flex-col gap-3">
                  <Label className="text-[color:var(--muted)] tracking-wider">
                    {group.category}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {group.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 text-sm font-mono ui-border bg-[color:var(--bg)] text-[color:var(--text)]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 7. Working Principles */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 flex flex-col gap-2">
              <Label className="text-[color:var(--muted)]">06 / PRINCIPLES</Label>
              <Heading as="h2">Working Principles</Heading>
              <p className="text-sm text-[color:var(--muted)] mt-2">
                Core guidelines for intellectual integrity, scientific investigation, and engineering practice.
              </p>
            </div>
            <div className="md:col-span-8 flex flex-col">
              {[
                {
                  num: '01',
                  title: 'Think from first principles',
                  text: 'Break every problem down to its fundamental physical laws before reaching for tools or heuristics.',
                },
                {
                  num: '02',
                  title: 'Prefer evidence over assumptions',
                  text: 'Scientific reasoning begins with observation and measurement, not with intuition or trend.',
                },
                {
                  num: '03',
                  title: 'Build strong foundations before specialization',
                  text: 'Deep understanding of the basics enables genuine contribution at the frontier.',
                },
                {
                  num: '04',
                  title: 'Treat engineering as a means to scientific discovery',
                  text: 'Electronics, computation, and systems design are instruments — not the destination.',
                },
                {
                  num: '05',
                  title: 'Stay curious. Continue learning.',
                  text: 'Scientific careers are built over decades. Intellectual humility and sustained curiosity matter more than early achievement.',
                },
              ].map((principle, idx) => (
                <div
                  key={principle.num}
                  className={`py-6 ${idx > 0 ? 'ui-border-t' : ''} flex flex-col gap-2`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-[color:var(--accent)] font-medium">
                      {principle.num}
                    </span>
                    <Title as="h3" className="text-xl">
                      {principle.title}
                    </Title>
                  </div>
                  <Body className="text-[color:var(--muted)] pl-8 text-base">
                    {principle.text}
                  </Body>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 8. Current Focus */}
      <Reveal>
        <section
          className="ui-border-b pb-16"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div className="flex flex-col gap-2 mb-10">
            <Label className="text-[color:var(--muted)]">07 / TRAJECTORY</Label>
            <Heading as="h2">Current Focus</Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stage: 'NOW',
                tagline: 'Immediate Priorities',
                items: [
                  'Completing undergraduate studies',
                  'Building ZeroAbstraction',
                  'Graduate preparation',
                ],
              },
              {
                stage: 'LEARNING',
                tagline: 'Active Studies',
                items: [
                  'Physics & Astrophysics foundations',
                  'Quantum Computing',
                  'Quantum Algorithms',
                ],
              },
              {
                stage: 'NEXT',
                tagline: 'Long-term Horizon',
                items: [
                  'Graduate studies',
                  'Scientific research',
                  'Publications',
                ],
              },
            ].map((col) => (
              <div
                key={col.stage}
                className="ui-border p-8 flex flex-col gap-6 bg-[color:var(--bg)]"
              >
                <div className="flex flex-col gap-1 border-b border-[color:var(--border)] pb-4">
                  <span className="font-mono text-sm tracking-wider font-semibold text-[color:var(--accent)]">
                    {col.stage}
                  </span>
                  <span className="font-mono text-xs text-[color:var(--muted)]">
                    {col.tagline}
                  </span>
                </div>
                <ul className="flex flex-col gap-3 font-sans text-[color:var(--text)]">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-[color:var(--accent)] font-mono text-xs pt-1">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 9. Continue Exploring */}
      <Reveal>
        <section className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
            <div className="md:col-span-4 flex flex-col gap-2">
              <Label className="text-[color:var(--muted)]">08 / NAVIGATION</Label>
              <Heading as="h2">Continue Exploring</Heading>
              <p className="text-sm text-[color:var(--muted)] mt-2">
                Follow the research logs, engineering experiments, and long-form writing across the workspace.
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-3">
                <Title as="h3" className="text-xl">
                  Research
                </Title>
                <Body className="text-[color:var(--muted)] text-sm">
                  Explore detailed research notes, simulations, and scientific logs.
                </Body>
                <EditorialLink href="/writing">EXPLORE RESEARCH</EditorialLink>
              </div>
              <div className="flex flex-col gap-3">
                <Title as="h3" className="text-xl">
                  Projects
                </Title>
                <Body className="text-[color:var(--muted)] text-sm">
                  Engineering builds, hardware experiments, and open-source work.
                </Body>
                <EditorialLink href="/projects">VIEW PROJECTS</EditorialLink>
              </div>
              <div className="flex flex-col gap-3">
                <Title as="h3" className="text-xl">
                  Writing
                </Title>
                <Body className="text-[color:var(--muted)] text-sm">
                  Read technical articles, journals, and long-form thoughts.
                </Body>
                <EditorialLink href="/writing">READ ARTICLES</EditorialLink>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
