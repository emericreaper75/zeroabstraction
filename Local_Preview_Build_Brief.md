# Local Preview Build Brief — Personal Universe Portfolio + Blog

**Phase:** Local review only. Do NOT deploy, publish, or connect production infrastructure.
**Goal:** Stand up the site on `localhost` with realistic sample content so the visual direction, layout, and interactions can be reviewed before any real content or production deployment.

Hand this brief to your coding agent (e.g. Claude Code) as-is. It consolidates the visual, content, and backend planning docs into one implementation spec.

---

## 0. Ground rules for this phase

- Everything built now is **disposable/sample**. Real content, real media, and production deployment come later, after sign-off.
- Every piece of seeded text and every image must be clearly traceable as a placeholder (see Section 4) — nothing should look like it's "secretly" final content.
- No production database, no production object storage, no live domain. Local Postgres (or SQLite for speed) and local file storage are fine for this phase.
- Stop before: hosting setup, real credentials, real email, custom domains, or public deployment. Those come after review.

---

## 1. Stack & local setup

Per the backend verdict: **Next.js + Payload CMS + PostgreSQL**, single application, object storage swapped for local disk in dev.

Local setup should:
1. Scaffold a Next.js + Payload project (TypeScript).
2. Use the containerized PostgreSQL instance via Docker Compose (the only supported local database workflow).
3. Store uploaded media on local disk during this phase (no cloud storage bucket needed yet).
4. Put all secrets (DB URL, Payload secret) in a local `.env` — never commit it.
5. Provide a single `admin` user for content review.
6. Confirm `docker compose up --build` (or `npm run dev`) boots both the public site and the `/admin` panel on port 3000.

---

## 2. Design system to implement

**Colors**
- Light: background `#F3EFE7`, text `#17191A`, muted `#65635E`, border `#D5D0C6`, accent `#C88A5A`.
- Dark: background `#0B1114`, text `#F1ECE2`, muted `#A7A49D`, border `#2A3032`, accent `#D49A68`.
- Treat exact values as provisional pending contrast testing.

**Typography** — three roles:
- Display/serif (e.g. Instrument Serif or Cormorant Garamond) for hero and major headings.
- Sans-serif (e.g. Inter or Manrope) for UI and body.
- Monospace (e.g. IBM Plex Mono) for dates, categories, labels, technical metadata.

Scale: hero 72–96px desktop, major heading 52–68px, project/article title 38–76px, body 17–20px, small UI 12–14px, technical labels 10–12px. Scale down on mobile, keep body comfortable.

**Layout & spacing**
- Asymmetrical editorial grid, not everything centered. Wide content ~1400px, reading column ~680–760px.
- Spacing scale: 8/12/16/24/32/48/64/96/128/160px.

**Components**
- Buttons: compact editorial text-links like `VIEW PROJECT →`, not SaaS-style buttons.
- Cards: rare — prefer typography/spacing/imagery over boxed components.
- Borders: thin and quiet; circles/arcs only as subtle orbital references, not literal space motifs.
- Navigation: small and quiet on desktop; simple mobile menu (may use full-screen transition); optional compact sticky state on scroll.

**Accessibility (non-negotiable even in preview build)**
- Readable contrast in both themes, visible keyboard focus states, reduced-motion support, meaningful alt text on all seeded images, comfortable touch targets, semantic heading hierarchy.

---

## 3. Pages to build (seed all of these for review)

- **Homepage**: hero (name, identity statement, Physics/ECE/Astrophysics reference, subtle explore cue, night photo), Right Now, Featured Work, Writing (recent posts), The Path So Far (trajectory, not a résumé list), Beyond the Core, About teaser, Footer.
- **Project detail page**: context, what was built, why, approach, images, technologies, current state, lessons, links.
- **Writing detail page**: title, date, reading time, category, comfortable line length, image/diagram spacing, code blocks, related content at end.
- **Writing archive page**.
- **About page**: personal photo + story-driven intro (not a qualifications list).
- **(Optional, flag for approval)** Now page — build it in preview only if you want to evaluate it; it's not committed scope yet.

## 4. Interaction & motion to implement

- Restrained entry animation — no long load sequences.
- Subtle scroll reveals, occasional image movement on scroll.
- Desktop hover: slight image scale, arrow movement, or accent reveal on project items; mobile relies on tap states instead.
- Mobile menu may use a full-screen transition; page transitions must preserve the user's sense of location.
- One distinctive transition (e.g. image expanding into next page) reserved for opening a selected project/article — use once, not everywhere.
- Everything must remain fully usable with `prefers-reduced-motion` on.
- Avoid heavy 3D/WebGL, particle systems, or cursor trails.

## 5. Content model (Payload collections to scaffold)

- **Posts** — title, slug, excerpt, content, cover image, publication date, status, reading time, topics, related projects, related posts, featured flag, SEO metadata.
- **Projects** — title, slug, summary, description, cover image, gallery, year, status, technologies, disciplines/topics, links, lessons, related posts, featured flag.
- **Topics** — name, slug, description, type (connective layer across astrophysics/physics/ECE/programming/photography/books/etc.).
- **Media** — file, alt text, caption, credit, type, optional content relationships.
- **Current State** — studying, building, reading, thinking about, updated date, visibility.
- **Profile** — introduction, story, current focus, photograph, updated date.
- **Journey** — ordered entries (e.g. Physics → ECE → Astrophysics).
- **Site Settings** — name, short bio, social links, email, navigation, theme settings, footer text.

Do not add collections beyond this list for the preview build (Books/Observations/Experiments stay future scope).

---

## 6. Seeding sample content from free public sources

Since real content isn't ready, seed each collection with clearly-labeled placeholder content pulled from free, legally usable public sources:

**Images**
- Astrophotography / night-sky: NASA APOD (images are public domain / US government work) or NASA Image and Video Library.
- General photography, workspace/hardware-style shots: Unsplash or Pexels (free license, no attribution required, but include photographer credit in the `credit` field anyway since Media already has that field).
- Diagrams: create simple original placeholder diagrams rather than pulling copyrighted textbook figures.
- Tag every seeded media item's caption with `[SAMPLE — replace before publish]`.

**Text**
- Do not use Lorem Ipsum — it fights the "natural, personal" voice goal from the content guidelines and won't tell you anything about how real copy will read.
- Instead, write short, genuinely natural-sounding placeholder copy for posts/projects/about/current-state — first person, plain language, no inflated claims — but prefix every seeded title with `[SAMPLE]` and add a one-line banner/badge component on preview pages that reads "Sample content — not final" wherever seeded content is shown.
- Populate 4–6 sample projects, 4–6 sample posts, a handful of Topics, one Profile, one Current State, and a short Journey (3 entries) — enough to see every page type populated, not exhaustive.

**Never fabricate**
- No invented scientific measurements, coordinates, or spectra used as decoration, even as placeholders — either omit that field in sample data or clearly mark it as illustrative.

---

## 7. What "done" looks like for this phase

1. The stack boots via Docker (`docker compose up --build` or `npm run dev`); `/admin` and the public site both load on port 3000.
2. Every page type in Section 3 renders with seeded content and images.
3. Design tokens (colors, type, spacing) from Section 2 are visibly applied, in both light and dark mode.
4. Interactions from Section 4 are present and degrade correctly with reduced motion.
5. All seeded content is visibly marked as sample/placeholder.
6. A short README explains: how to run it locally, where sample data lives, and how to swap it for real content later.

## 8. Explicit stop condition

Once the above is running locally, **stop and wait for review** — no deployment, no real domain, no production database/storage, no publishing. The next step after your review is a separate task: replacing sample content with real content and validating the hosting/DB/storage providers per the risk & deployment doc.

---

*This brief is derived from: Visual Vision & Identity, Visual Design System, Page & Screen Specification, Interaction & Motion Specification, Content Imagery & Presentation Guidelines, Backend Architecture Verdict/Specification, Content & Data Model, Admin Dashboard & Content Workflow, and Backend Risks/Cost/Testing/Deployment.*
