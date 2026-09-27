# Content Authoring & Editorial Guide: ZeroAbstraction

This guide details how to author, categorize, and publish content across the ZeroAbstraction observatory platform.

---

## 1. Content Collections

### Manuscripts & Essays (`/admin/collections/posts`)
- **Title & Slug:** Titles should be descriptive. Canonical slugs are auto-generated from titles, but can be customized to maintain short, permanent URLs.
- **Abstract / Excerpt:** 1–3 sentence synopsis displayed on `/writing` archive cards and search previews.
- **Topics:** Categorize each essay under research topics (e.g. *Astrophysics*, *Electrodynamics*, *Signal Processing*).
- **Publication Lifecycle:**
  - `Draft`: Work in progress; strictly hidden from anonymous public visitors.
  - `Published`: Visible on public site and included in `sitemap.xml`.
  - `Archived`: Historic essay removed from primary public feeds.

### Engineering & Research Projects (`/admin/collections/projects`)
- **Year & Status:** Project timeline anchor and development status (`active`, `completed`, `concept`, `archived`).
- **Cover Image & Alt Text:** Scientific diagrams or instrument photographs. All images require descriptive alt text for accessibility.
- **Bidirectional Links:** Projects can reference relevant published essays, creating reciprocal research trails.

---

## 2. Global Observatory Telemetry

### Current State (`/admin/globals/current-state`)
The live beacon broadcast on the homepage:
- **Studying:** Current academic literature or field of deep research.
- **Building:** Active engineering, software, or instrumentation project.
- **Reading:** Papers, textbooks, or scientific publications.
- **Contemplating:** High-level open questions or conceptual thought experiments.
- **Beacon Toggle:** Click *Beacon Active / Muted* to control public visibility on the homepage.

### Journey Timeline (`/admin/collections/journey`)
Chronological milestones documenting your academic and engineering evolution:
- **Category:** `physics`, `ece`, or `astrophysics`.
- **Milestone Flag:** Mark landmark accomplishments (degrees, published papers, major project deployments) with `★ KEY MILESTONE`.
- **Ordering:** Use the up/down controls to keep milestones strictly sequenced.

### Lead Observer Dossier (`/admin/globals/profile`)
Controls the biographical narrative rendered on `/about`:
- **Introduction:** Concise summary of research focus and academic background.
- **Current Focus:** Narrative on ongoing intellectual and technological pursuits.
