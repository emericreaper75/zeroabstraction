# zeroabstraction — Project Rules

## Project Identity
- This is **Manoj's personal website**: a personal digital identity, not a career portfolio or corporate profile.
- Core identity: **Astrophysics** is the central base. Physics, ECE, projects, writing, interests, and future directions orbit that core.
- Design concept: **Personal Universe** — an evolving person whose interests connect with one another. The universe is a conceptual structure, NOT a literal space theme.
- Emotional direction: **Curious + warm**. Visitors should feel invited into an ongoing exploration.

---

## Tech Stack (Decided — Do Not Change Without Explicit Approval)
- **Framework**: Next.js (App Router)
- **CMS / Admin**: Payload CMS (co-located in the same Next.js application)
- **Database**: PostgreSQL
- **Media Storage**: Object storage (e.g., Cloudflare R2 or similar) for production images
- **Source Control & Deploy**: GitHub → deployment platform (to be chosen)
- **Language**: TypeScript throughout

> Do NOT add microservices, a separate API server, a separate auth service, or a custom admin dashboard for V1.
> The earlier Astro + Markdown + Cloudflare Pages proposal is superseded. Use Next.js + Payload + PostgreSQL.

---

## Visual Design Rules

### Colors
- **Light mode**: warm paper `#F3EFE7` bg, charcoal `#17191A` text, muted gray `#65635E`, soft border `#D5D0C6`, bronze accent `#C88A5A`
- **Dark mode**: deep charcoal `#0B1114` bg, warm white `#F1ECE2` text, muted gray `#A7A49D`, border `#2A3032`, accent `#D49A68`
- Always validate color choices against accessibility contrast requirements.
- Avoid generic, saturated colors. Avoid neon sci-fi palettes.

### Typography
- **Display / major titles**: expressive serif — Instrument Serif or Cormorant Garamond
- **Interface / body**: clean sans-serif — Inter or Manrope
- **Technical labels, dates, categories, metadata**: monospace — IBM Plex Mono
- Type scale (desktop): hero 72–96px, major heading 52–68px, project/article title 38–76px, body 17–20px, small UI 12–14px, technical labels 10–12px
- Mobile: smaller display sizes, keep body comfortable.

### Layout
- Strong grid with **asymmetrical editorial compositions**
- Content area: ~1400px wide; reading width: ~680–760px
- Do NOT center every section
- Spacing scale: 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px
- Use generous vertical breathing room between major sections

### Components
- **Cards are rare** — prefer typography, images, spacing, and alignment over boxed components
- Buttons: compact editorial style (`VIEW PROJECT →`, `READ ARTICLE →`); avoid oversized SaaS-style buttons
- Borders: thin and quiet; do not box every element
- Circles, arcs, fine lines: only as subtle orbital/scientific references — use sparingly

### Navigation
- Desktop: small and quiet
- Mobile: simple menu, may open with full-screen transition
- A compact sticky nav after scrolling is acceptable

### Accessibility (Non-Negotiable)
- Readable contrast in both light and dark themes
- Visible keyboard focus states
- `prefers-reduced-motion` support — site must be fully usable with motion disabled
- Meaningful image `alt` text
- Comfortable touch targets (min 44×44px)
- Semantic heading hierarchy (one `<h1>` per page)

---

## Interaction & Motion Rules
- Interaction level: **moderately experimental** — navigation and reading stay familiar
- Page entry: short restrained reveals; NO long loading sequences that delay content access
- Scroll: subtle section reveals, occasional image movement
- Desktop hover: slight scale, arrow movement, or accent reveal — nothing heavy
- Mobile: clear tap states, no hover-only interactions
- Special transitions (image expanding into next page): use **sparingly**, max one or two places
- **Performance rule**: NO heavy 3D, WebGL, continuous particle systems, cursor trails, or effects that make basic navigation animation-dependent

---

## Content & Imagery Rules
- Content philosophy: document an **evolving identity** — what the person studies, builds, thinks about, explores, learns
- Writing voice: natural and personal; avoid corporate marketing language and academic institutional tone
- Project voice: explain what it is, why it exists, what was tried, what was learned, current state — avoid inflated claims

### Preferred imagery
- Personal photographs
- Actual project screenshots
- Electronics and hardware photographs
- Notes, sketches, books, workspace material
- Astrophotography / night-sky observations
- Scientific diagrams with genuine contextual purpose
- Relevant observatory or instrument imagery

### Imagery to avoid — NEVER use these
- Generic astronaut stock photos
- Random galaxy wallpapers
- AI-generated planets as decoration
- Sci-fi illustrations without content purpose
- Repeated astronomy images that don't add information
- Starfield backgrounds everywhere
- Fake scientific data used as decoration

### Scientific details
- Only use dates, coordinates, spectra, diagrams when they have **real contextual meaning**
- Never invent scientific measurements

---

## Data Model Reference (Content Entities)
Model real content entities, not website pages. Pages assemble content.

| Collection        | Key Fields |
|------------------|------------|
| **Posts**         | title, slug, excerpt, content, cover image, pub date, status, reading time, topics, related projects, related posts, featured, SEO metadata |
| **Projects**      | title, slug, summary, description, cover image, gallery, year, status, technologies, topics, links, lessons, related posts, featured |
| **Topics**        | name, slug, description, type (connects astrophysics, physics, ECE, programming, photography, books, experiments, etc.) |
| **Media**         | file, alt, caption, credit, type, optional content relationships |
| **Current State** | studying, building, reading, thinking about, updated date, visibility |
| **Profile**       | introduction, story, current focus, photograph, updated date |
| **Journey**       | ordered entries (Physics → ECE → Astrophysics) |
| **Site Settings** | name, short bio, social links, email, navigation, footer text |

> Future entities (Books, Observations, Experiments, Collections): add ONLY when a concrete content workflow requires them. Do not overbuild.

---

## Page Structure Reference
- **Homepage sections**: Hero → Right Now → Featured Work → Writing → The Path So Far → Beyond the Core → About → Footer
- **Hero**: name, identity statement, Physics/ECE/Astrophysics reference, explore cue; optional strong astronomical or personal night photo. NO résumé CTA.
- **Featured Work**: large editorial artifacts (not a grid of small cards) — large image, short explanation, fields/technologies, year, project link
- **The Path So Far**: Physics → ECE → Astrophysics as an intellectual trajectory, NOT a résumé timeline
- **Project detail**: context → what was built → why → approach → images → technologies → current state → lessons → links
- **Writing detail**: prioritize reading; strong title, date, reading time, category, comfortable line length, generous image/diagram spacing, code blocks, related content at end

---

## Architecture Boundaries
- Single admin account for V1; do not build team permissions until collaboration is a real requirement
- Public pages must prefer server-side data retrieval over many client-side API calls
- Secrets (DB credentials, Payload secret, storage credentials, etc.) must be in environment variables — never committed to Git
- Use Payload's generated REST API or GraphQL only where needed; no second API server
- Use version-controlled migrations for schema changes; never manually mutate production schema

---

## What to Avoid (Global)
- Generic developer portfolio patterns
- Corporate résumé language
- University research-site styling
- Literal solar-system interfaces
- Excessive 3D or WebGL
- Excessive animation or effects that delay content
- Overbuilding future content types before they have real use cases
- Microservices or extra infra layers for V1
