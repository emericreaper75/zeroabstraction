# 06 — Writing Page: Shelf

*Reference: MotionSites "Shelf Hero" (a shelf-style portfolio hero). Used for idea and choreography only; this document is self-contained. Distinct from the Projects Library (07).*
*Owner of: the Writing archive page. Topic filter from 02. Tokens from 04.*

## Concept
All writing is displayed as **spines on shelves**: slim vertical volumes grouped by year, newest first. Selecting a spine shows its details in a stable "reading desk" panel. Every writing is a real link. A **List view** is the always-available alternative.

(Projects use *front-facing covers*, not spines. See 07.)

## Page structure
1. Page header: mono label `WRITING`, serif title (`--text-h1`), one-line intro, real count (for example `12 ESSAYS`) in mono.
2. TopicFilter (02).
3. View switch: `SHELF · LIST` (links, `?view=shelf|list`; `aria-current` on the active one).
4. Content area (Shelf or List).
5. Footer (existing).

## Shelf view
**Layout (≥1024px):** two columns. Left (about 8/12): shelves. Right (about 4/12): sticky reading-desk panel. **640–1023px:** panel above the shelves, not sticky. **<640px:** List view is the default; Shelf remains available with the panel above.

**Year groups:** each year has a mono year label at the left of its shelf rows, then one or more rows (wrap when the container is full). Each row stands on a **board**: `border-bottom:1px solid var(--border-strong)` plus `box-shadow:0 10px 12px -10px var(--shade)`. The board always spans the container width, even with a single spine.

**Spine:**
- Width `clamp(44px, 4.2vw, 64px)`; height between 240px and 320px, chosen **deterministically** from a hash of the slug (stable across renders; no `Math.random`).
- Color: one of `--spine-1…5` chosen from a hash of the first topic slug (or the post slug if no topic). Text color `--spine-fg`. 1px `--border` outline.
- Title: `--font-display`, `writing-mode:vertical-rl`, about `1.125rem`, clipped to the spine with a bottom fade (mask) rather than ellipsis. The full title is in `aria-label` and in the panel.
- Foot: mono `--text-label` date such as `26 SEP`.
- Interaction (pointer: fine): hover or focus lifts the spine by 10px (`--dur-base`, `--ease-out`) and selects it for the panel. Leaving does not reset the selection.
- Interaction (pointer: coarse): first tap selects and updates the panel; the panel's link opens the article.
- Selected spine: stays lifted 10px with a 2px top border `--accent`.
- Focus: visible `--focus-ring`.

**Reading-desk panel:** cover image if present (16:10, plain rectangle), topics (mono, `--accent-text`), title in `--font-display` at `--text-h2`, excerpt `--text-body` `--text-muted`, `DATE · N MIN READ` mono, then `READ ARTICLE →`. Default selection is the newest published writing. Content cross-fades in `--dur-fast`.

**Markup/accessibility:** each spine is an `<a href="/writing/<slug>">` inside a list; `aria-label="<title>, <date>, <n> min read"`. The panel is a labeled region ("Selected writing preview") and is not an ARIA live region. Server-render all spines and the default panel; hover/focus updating is progressive enhancement.

## List view
Per the page spec: a dated archive. Each row: date (mono, left), title (serif) with description beneath, reading time (mono, right); 1px `--border` between rows. Same list component as the Home page's writing teaser so the two cannot drift.

## Data
Published posts only. Fields: title, slug, excerpt, cover image, publication date, reading time, topics. No schema changes. Reading time uses the rule in 01.

## States
- **One writing:** one spine plus the panel; the board still spans the width.
- **Zero:** short message "Nothing published yet." No empty shelf drawing.
- **Many:** 48 per page, server pagination via `?page=`, link `OLDER WRITING →` (mono). Year grouping applies within the page.
- **Filtered by topic:** shelf shows only matching writings; years with none are hidden.

## Motion
Spine lift and panel cross-fade only. No parallax, no 3D, no continuous animation. Reduced motion: no lift (selection is shown by the 2px top border), panel swaps instantly.

## Out of scope
WebGL/3D books, page-turn effects, search, infinite scroll, per-post cover spines requiring new fields.

## Acceptance
- [ ] Spine heights/colors are identical across reloads and server/client renders (no hydration warning).
- [ ] Every writing is reachable by keyboard and by tap, with and without JavaScript.
- [ ] Default panel shows the newest writing; hover/focus swaps it.
- [ ] List view and Shelf view show the same set of writings; filtering applies to both.
- [ ] Works with 1 writing and with 100.
- [ ] Contrast of `--spine-fg` on every spine tint passes in both themes.
