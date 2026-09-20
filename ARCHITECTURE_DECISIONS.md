# Architecture Decision Record (ADR): ZeroAbstraction Platform Core

- **Status**: Accepted
- **Date**: 2026-09-10
- **Scope**: Platform Architecture, CMS, Database, Object Storage, and Hosting Infrastructure
- **Author**: Manoj Amavasya

---

## 1. Context & Requirements

ZeroAbstraction is a personal universe and digital garden exploring theoretical physics, electrical and computer engineering (ECE), and astrophysics. Unlike a basic static resume or portfolio, the platform has distinct operational requirements:
- **Rich Content & Taxonomy**: Long-form technical writing, engineering projects, topical taxonomy (astrophysics, quantum mechanics, silicon design), and relational connections between articles, projects, and topics.
- **Dynamic Personal State**: A real-time "Right Now" section (current reading, active builds, ongoing thoughts) and an orbital journey roadmap.
- **High-Resolution Astrophotography**: Serving detailed, high-resolution photography and telescope captures with zero bandwidth billing surprises.
- **Unified Ownership**: Complete ownership of code, database, and assets without vendor lock-in or recurring SaaS subscriptions for a single-author site.
- **Frictionless Content Workflow**: Intuitive admin dashboard for drafting, publishing, relationship management, and live editing without requiring code commits for every essay edit.

---

## 2. Decision: Next.js + Payload CMS + PostgreSQL

We selected **Next.js (App Router) + Payload CMS 3.x + PostgreSQL** as the core technology stack.

### Why This Stack Wins:
1. **Single Unified Application**: Payload 3.x runs directly inside the Next.js App Router. Public frontend routes, server components, admin panel (`/admin`), and REST/GraphQL APIs reside in a single codebase with shared TypeScript types and zero inter-service network latency for local API queries.
2. **Native Relational Integrity**: PostgreSQL provides strict ACID compliance and relational power, ensuring bi-directional references (e.g., a project listing its related articles and research papers) remain consistent without denormalization workarounds.
3. **Local Server-Side Data Retrieval**: Frontend server components fetch data directly using Payload's `getPayload()` Local API (executing direct SQL queries without HTTP roundtrips), ensuring blazing fast SSR/SSG speeds and eliminating client-side API waterfall requests.
4. **Autonomous Infrastructure**: Open-source and self-hostable with standard Docker containers; no mandatory third-party CMS cloud dependencies.

---

## 3. Evaluation of Alternatives

| Alternative Evaluated | Why It Was Considered | Reasons Rejected |
| :--- | :--- | :--- |
| **Markdown-Only Static Site**<br>*(e.g., Hugo, Jekyll, Next-MDX)* | Zero operational overhead, trivial deployment to GitHub Pages or Cloudflare Pages, git-backed content. | **Rejected**: Becomes deeply unmaintainable once complex relations (projects ↔ posts ↔ topics), media metadata, and dynamic personal states ("Right Now", Journey) are introduced. Drafting or editing minor text from mobile or outside a code editor is clumsy. |
| **Astro + Supabase + Custom Admin** | Astro excels at content-driven static sites with minimal JS; Supabase offers a managed Postgres database with auth. | **Rejected**: Requires building a custom admin dashboard from scratch to handle drafting, publishing, relation pickers, and media upload interfaces. Disjointed architecture increases maintenance overhead for a single-author site. |
| **Hosted Headless CMS**<br>*(e.g., Sanity, Contentful, Strapi Cloud)* | Fully managed SaaS admin UI, zero database management, ready-made media asset pipelines. | **Rejected**: Vendor lock-in, proprietary query languages (e.g., GROQ), and punishing pricing cliffs if content, API requests, or user seats scale beyond free tiers. Violates the core ethos of self-sovereign digital ownership. |

---

## 4. Final Infrastructure & Provider Selections

| Layer | Selected Provider | Rationale & Configuration |
| :--- | :--- | :--- |
| **Application Hosting** | **Coolify** (Self-Hosted PaaS on VPS)<br>*Local: Docker Compose* | Runs the multi-stage Next.js standalone container (`output: 'standalone'`). Provides automatic git-push deployments, dashboard secrets injection, zero PaaS lock-in, and full control over compute and memory. |
| **PostgreSQL Database** | **Neon** (Serverless PostgreSQL)<br>*Local: PostgreSQL 16 Alpine* | 500 MB free tier (current site footprint is only 9.7 MB, leaving 490+ MB headroom). Instant copy-on-write database branching enables risk-free migration testing. Scale-to-zero keeps compute consumption under free-tier allowances. Automated 24h point-in-time recovery (PITR). |
| **Object Storage** | **Cloudflare R2**<br>*Local: MinIO S3 Emulator* | S3-compatible object storage with **$0.00 egress fees**. Absolutely critical for high-resolution astrophotography delivery to eliminate bandwidth cost spikes. 10 GB free storage tier with inexpensive overage ($0.015/GB-month). |

---

## 5. Deviations & Adaptations Made During Implementation

During the transition from initial planning to concrete implementation, the following key adaptations were made:

1. **Pivoted from Astro/Markdown to Full Next.js/Payload Monolith**:
   - *Original Plan*: An early concept proposed Astro + static Markdown on Cloudflare Pages for pure presentation.
   - *Deviation*: Abandoned early once dynamic taxonomy, media credit/metadata tracking, and admin authoring workflows were identified as mandatory.
2. **Version-Controlled Migrations over Auto-Sync**:
   - *Original Plan*: Relying on Payload's default Drizzle schema push (`db.push: true`) for rapid prototyping.
   - *Deviation*: Auto-sync was disabled (`push: false`), and explicit version-controlled migrations (`src/migrations/`) were mandated. This prevents accidental schema drift and ensures safe, predictable rollbacks in production.
3. **Local S3 Emulation via MinIO**:
   - *Original Plan*: Relying on local disk storage for development and only testing S3 storage in production.
   - *Deviation*: Added a containerized **MinIO** instance and bucket auto-initialization script to `docker-compose.yml`. This allowed 100% realistic validation of the `@payloadcms/storage-s3` plugin and presigned media routing locally before cloud provisioning.
4. **Sharp Image Optimization Guardrails**:
   - *Original Plan*: Direct upload of full-resolution captures to the public media bucket.
   - *Deviation*: Established strict media handling rules: only web-optimized derivative images (WebP/AVIF, ≤ 2400px via Sharp) are stored in the active R2 bucket, reserving heavy RAW/FITS telescope stacks for offline archival storage to preserve the 10 GB free-tier allowance.
5. **Debian Base Image for PBKDF2 Acceleration**:
   - *Original Plan*: Use `node:22-alpine` for the smallest possible Docker image footprint (~140MB).
   - *Deviation*: Migrated to `node:22-slim` (Debian/glibc) resulting in a ~220MB base image. Payload v3 natively relies on Web Crypto `PBKDF2` for authentication hashing. On Alpine (musl libc) without optimized OpenSSL bindings, this took 11.9 seconds per hash, causing connection deadlocks. Debian's native bindings execute the same hash in ~70ms. Removing the manual `apk add python3 make g++` step also sped up build times, outweighing the minor 80MB size penalty.

6. **Environment-Agnostic Middleware Authentication**:
   - *Original Plan*: Use Edge-compatible `jose` for lightweight JWT signature verification in Next.js middleware.
   - *Deviation*: Payload v3 derives the actual JWT secret by hashing `PAYLOAD_SECRET` (via Node crypto). Re-implementing this derivation safely inside Edge middleware is brittle. The middleware was rewritten to perform a direct `fetch` to Payload's native `/api/users/me` endpoint. While this introduces an extra HTTP round-trip, the latency is entirely local (same container) and adds only ~15-20ms per protected page load. This tradeoff was accepted to guarantee robust, environment-agnostic auth without duplicating Payload internals.

7. **Design Tokens & Palette Source of Truth**:
   - *Original Plan*: Use the bespoke locked palette (`#0B1114` charcoal, `#C88A5A` bronze) and font stack (DM Serif Display, IBM Plex Mono, JetBrains Mono) defined in earlier planning and `ADMIN_STITCH_INTEGRATION.md`.
   - *Deviation*: The finalized `google-stitch-dashboard` export was delivered using generic Material Design 3 (MD3) semantic tokens (e.g., `surface-container-lowest` mapped to `#090f12`, `primary` mapped to `#f8ba85`, and `Newsreader` preceding `DM Serif Display`). Per strict instruction, the **Stitch export's embedded MD3 values are the new locked palette and source of truth** for the Custom Admin Dashboard, completely replacing all older `#0B1114`/`#C88A5A` references.

---

## 6. Architecture Boundaries & Constraints (V1)

- **Single Application Boundary**: No microservices, separate backend servers, or third-party authentication services.
- **Single Administrator**: Visitors are strictly read-only; single admin account manages all resources.
- **Server-First Data Fetching**: Prefer Next.js Server Components and Payload Local API over client-side REST/GraphQL querying wherever possible.
- **Zero Committed Secrets**: Secrets must exclusively enter through runtime environment variables (`.env` locally, Coolify dashboard in production).
