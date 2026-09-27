# ZeroAbstraction System Architecture

**Document Version:** 2.0 (Post-Audit Remediation)  
**Stack:** Next.js 16 (Turbopack) + Payload CMS 3.x + PostgreSQL 16 + Cloudflare R2

---

## 1. System Topology

```
+-----------------------------------------------------------------------------------+
|                                 ZeroAbstraction                                  |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                       Public Web Layer (Next.js 16)                       |   |
|   |   - React Server Components & Static Site Generation (SSG)                |   |
|   |   - View Transitions API & Smooth Fluid Typography                        |   |
|   |   - Routes: / (Home), /about, /writing, /projects, /search                |   |
|   |   - Security: Strict CSP, X-Frame-Options, overrideAccess: false          |   |
|   +---------------------------------------------------------------------------+   |
|                                     │                                             |
|                                     ▼                                             |
|   +---------------------------------------------------------------------------+   |
|   |                  Custom Observatory Admin (/admin)                        |   |
|   |   - Next.js Server Actions with JWT authentication                        |   |
|   |   - Interactive Editors: Posts, Projects, CurrentState, Profile, Journey |   |
|   |   - Astrophotography Plate Media Manager                                  |   |
|   +---------------------------------------------------------------------------+   |
|                                     │                                             |
|                                     ▼                                             |
|   +---------------------------------------------------------------------------+   |
|   |                     Payload CMS 3.x Headless Core                         |   |
|   |   - Local API via getPayload({ config })                                  |   |
|   |   - Collections: Users, Posts, Projects, Topics, Media                    |   |
|   |   - Globals: CurrentState, Profile, Journey, SiteSettings                 |   |
|   |   - Drizzle ORM Database Adapter (PostgreSQL dialect)                     |   |
|   +---------------------------------------------------------------------------+   |
|                         │                               │                         |
|                         ▼                               ▼                         |
|   +----------------------------------+    +-----------------------------------+   |
|   |       PostgreSQL 16 Engine       |    |       Cloudflare R2 Storage       |   |
|   |   - Relational content schema    |    |   - S3-compatible object storage  |   |
|   |   - Native migrations & WAL      |    |   - Astrophotography plates/FITS  |   |
|   |   - Colocated container / Neon   |    |   - Zero bandwidth egress fees    |   |
|   +----------------------------------+    +-----------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Patterns

### A. Access Control Boundary
All public content fetching (`src/lib/content/index.ts`) enforces `overrideAccess: false`. This guarantees that:
- Anonymous visitors can only query records where `_status === 'published'`.
- Draft posts, unpublished revisions, and archived projects never leak through SSR or static generation.
- Admin server actions explicitly verify session authentication via `payload.auth({ headers })` before executing modifications with `overrideAccess: true`.

### B. Payload Local API vs REST API
Rather than making network HTTP hops to internal REST endpoints, the application leverages Payload 3's Local API (`getPayload({ config })`). This achieves:
- Direct database query execution with zero HTTP serialization overhead.
- Native TypeScript types automatically synchronized with schema definitions.
- Server-side transactions and cache revalidation triggers (`revalidatePath`).

### C. Design Tokens & Substrate
The design system uses CSS custom properties defined in `src/styles/tokens.css` with dark mode support:
- Light Mode: `#f3efe7` paper background with `#17191a` ink and `#ad6832` amber accent (>3.5:1 contrast).
- Dark Mode: `#0b1114` deep space substrate with `#f1ece2` starlight text and `#d49a68` accent.
- Responsive typography via CSS `clamp()` fluid scales.
