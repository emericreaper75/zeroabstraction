# 07 — Projects Page: Library

*Reference: MotionSites book-style showcases ("Bookshop" / "Book Shelf" listings). Idea only; this document is self-contained. Distinct from the Writing Shelf (06).*
*Owner of: the Projects listing page. Topic filter from 02. Tokens from 04.*

## Concept
Projects are displayed as **front-facing book covers standing in a library**. Each cover is a real link to its project detail page. The **existing listing feature is preserved** and becomes the List view.

## Phase 0 requirement: preserve the current listing
The current Projects listing was not available when this was written. Before any change, the agent must inventory it in `reference/INVENTORY.md`: every control (search, filters, sort, status/tech/year/topic selectors), URL-state behavior, counts, empty states, and keyboard behavior. **All of that must continue to work, with the same URLs and results.** If a control cannot coexist with the Library view, stop and report; do not remove it.

## Page structure
1. Header: mono label `PROJECTS`, serif title (`--text-h1`), one-line intro, real count in mono.
2. Controls row: the existing controls, restyled with tokens; TopicFilter (02) if it does not duplicate an existing topic filter (reuse the existing control if one exists).
3. View switch: `LIBRARY · LIST` (`?view=library|list`, default `library`).
4. Content area.
5. Footer (existing).

## Library view
- Grid: `repeat(auto-fill, minmax(clamp(200px, 22vw, 280px), 1fr))`, gap `--space-5`. Each row stands on a **board** (`border-bottom:1px solid var(--border-strong)` plus `box-shadow:0 10px 12px -10px var(--shade)`).
- **Featured** projects (existing featured flag) come first, with a mono tag `FEATURED` in `--accent-text`.
- **Cover** (3:4 portrait, plain rectangle, radius `--radius-s`):
  - With a cover image: the image fills the cover, with a spine edge on the left, an 8%-wide overlay of `linear-gradient(90deg, var(--shade), transparent)`.
  - Without a cover image: a typographic cover on `--surface` tinted with one `--spine-1…5` (deterministic from the slug): title in `--font-display`, year in mono at the foot. No stock imagery.
- **Under the cover:** title (`--font-display`, about `1.5rem`, `--lh-heading`), then mono line `YEAR · STATUS`, then up to three technologies as plain mono text separated by `/` (not boxed), then `VIEW PROJECT →` in mono `--text-ui-sm`. The cover, title and arrow are **one anchor**, so there is one link per project.
- **Interaction (pointer: fine):** hover or focus lifts the cover 6px and rotates it about 6° on the Y axis (perspective 900px, origin left) with `--dur-base`/`--ease-out`. Pure CSS transforms; no WebGL.
- **Pointer: coarse:** no hover effect; tapping navigates.
- Focus: visible `--focus-ring` around the cover.

## List view (the existing listing, preserved)
Keep the current listing's structure and behavior. Restyle only with tokens: mono year and status, serif title, technology text, 1px `--border` rows. If the current listing has no list-style layout, use: year (mono, left), title and summary, technologies and status (right).

## Data
Published projects. Fields: title, slug, summary, cover image, year, status, technologies, topics, featured flag. No schema changes.

## States
- **One project:** one cover on a board that spans the container. No placeholder covers.
- **Zero:** "No projects published yet."
- **Filtered, no match:** use the current listing's empty-state message and styling logic, with tokens.

## Optional enhancement (only after everything else is done)
Cover-to-detail transition using the View Transitions API for a single shared element, only when supported and motion is allowed; otherwise a normal navigation. Do not block on it.

## Out of scope
3D/WebGL books, page-turn effects, carousels, infinite scroll, new fields, a different detail page.

## Acceptance
- [ ] Every control and URL parameter that worked before still works.
- [ ] Library and List show the same set of projects; filters apply to both.
- [ ] Cover and typographic-cover cases both render well in light and dark.
- [ ] One link per project; keyboard order matches visual order.
- [ ] No hydration warnings; covers do not shift layout while images load (`aspect-ratio` set).
- [ ] Visually distinct from the Writing Shelf (covers, not spines).
