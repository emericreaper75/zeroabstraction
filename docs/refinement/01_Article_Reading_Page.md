# 01 — Article Reading Page

*Reference: CSS-Tricks guidance on long-form article design (treat an article as text designed for comfortable, sustained reading; give it breathing room; favor legibility over slickness).*
*Owner of: the public article page. Colors, sizes and timing come from 04; the Related block comes from 02.*

## Goals
Reading comes first. The page should feel like a calm, typographic essay: strong title, comfortable measure, generous spacing, and clearly handled math, code and tables.

## Page anatomy (top to bottom)
1. Header block
2. Cover figure (if the post has a cover image)
3. Article body
4. End matter: topic chips (02), Related block (02)
5. Footer (existing)

## Layout
- Container: `--measure-wide` max, horizontal padding `--gutter`.
- The header and body **share one left edge**. Body column width: `--measure-reading`. Header may run wider than the body (max `56rem`) so a long title is not cramped.
- The cover figure and wide in-body figures break out to the container width. Nothing is centered by default.
- Vertical rhythm uses the spacing scale only. Header top padding `--space-8`; space before end matter `--space-8` (never more than `--space-9`).

## Header block
- **Meta row:** topic labels (links to `/writing?topic=<slug>`) in `--accent-text`, then date, then reading time in `--text-muted`. Mono, `--text-label`, uppercase, separated by a middle dot.
- **Reading time:** use the stored value if set; otherwise compute server-side as `ceil(prose words / 225)`, minimum 1, ignoring code and equations. Do not add a field.
- **Title (`h1`):** `--font-display`, `--text-title`, `line-height:var(--lh-display)`, `letter-spacing:-0.01em`, `text-wrap:balance`.
- **Dek (excerpt):** `--font-sans`, `--text-body-lg`, `--text-muted`, max `--measure-reading`, `margin-top:var(--space-4)`.
- **Divider:** 1px `--border` hairline, `margin-block:var(--space-6)`. No squiggle.
- Date is a `<time datetime>` element.

## Cover figure
- Plain rectangle (see 00 global rules): no clip-path, no rotation, no outline, radius `--radius-s`.
- Natural aspect ratio, `max-height:70vh`, `object-fit:cover` only if a ratio is imposed.
- `<figcaption>`: mono `--text-ui-sm`, `--text-muted`: caption, then credit. Shown only when those fields exist.
- Alt text required from the Media record; if missing, log a build warning (do not invent alt text).
- If there is no cover image, omit the figure. No placeholder box.

## Body typography
| Element | Rule |
|---|---|
| Paragraph | `--font-sans`, `--text-body`, `--lh-body`, `--text`, `margin-block:0 1.25em` |
| `h2` | `--font-display`, `--text-h2`, `--lh-heading`, `margin-top:var(--space-7)`, `margin-bottom:var(--space-3)` |
| `h3` | `--font-display`, `--text-h3`, `margin-top:var(--space-6)` |
| `h4`+ | `--font-sans`, weight 600, `--text-body` |
| Links | `--accent-text`, underline with `text-underline-offset:3px`; hover thickens underline |
| Lists | marker color `--accent-text`; `padding-left:1.25em`; items spaced `0.5em` |
| Blockquote | 2px left border `--accent-border`, `--font-display` italic, `--text-body-lg` |
| Inline code | mono at `.92em`, `--code-bg`, padding `.1em .35em`, radius `--radius-s` |
| `hr` | 1px `--border`, `margin-block:var(--space-7)` |
| Body images | wide by default (container width), lazy-loaded, caption/credit as above |

Heading levels inside the body start at `h2`; the page has exactly one `h1`.

## Math (KaTeX)
- Block equations centered within the reading column, `overflow-x:auto`, `padding-block:var(--space-3)`, font-size `1.05em`.
- Inline math inherits body color and line height without breaking line rhythm.
- KaTeX CSS is loaded once; reserve no extra layout shift.

## Code blocks
- Container `--code-bg`, `1px solid var(--border)`, radius `--radius-s`.
- Header strip: language in mono `--text-label` `--text-muted`.
- Content: mono `--text-small`, `line-height:1.6`, `tab-size:2`, no wrapping, `overflow-x:auto`.
- The scroll container is focusable (`tabindex="0"`) with a visible focus ring so keyboard users can scroll.
- Syntax colors use only `--code-keyword`, `--code-string`, `--code-number`, `--code-comment`; identifiers use `--text`.

## Tables
- Wrap each table in a scroll container (`overflow-x:auto`, `role="region"`, `tabindex="0"`, `aria-label` from the caption or nearest heading).
- `th`: mono `--text-label`, uppercase, weight 500, `--text-muted`, left-aligned text and right-aligned numeric columns.
- `td`: `--font-sans`, `--text-small`; numeric cells use `font-variant-numeric:tabular-nums`.
- Row dividers: 1px `--border` on the bottom. No zebra striping, no heavy bold headers.

## End matter
- Topic chips and the Related block are specified in 02. This page only reserves their place and spacing (`--space-8` above).

## Motion
- Header block fades in once (`opacity` 0→1, `translateY(8px)→0`, `--dur-base`, `--ease-out`). No motion on body content. No scroll-jacking, parallax, or reading-progress bar.
- All of it disabled under reduced motion (tokens already zero the durations).

## Responsive
- ≤768px: body at the small end of `--text-body`, gutters `--gutter`, figures edge-to-edge within the gutter, tables and code scroll horizontally, header meta row wraps.
- Never allow the page body to scroll sideways.

## Accessibility
- Landmarks: `<main>` > `<article>`; heading order valid; `<time>` used; visible `--focus-ring` (2px, offset 2px) on links, code and table scrollers; touch targets ≥ 44px for chips.

## Out of scope
Table of contents, share buttons, comments, reading progress, newsletter prompts, new fields.

## Acceptance
- [ ] The title leading is tight (`--lh-display`) and no giant gaps remain between sections.
- [ ] Body renders at the token size and ≤ `--measure-reading` wide.
- [ ] Reading time is correct for a long post and never shows an impossible value.
- [ ] No zigzag, tilt, outline or squiggle anywhere on the page.
- [ ] Math, code and table samples render correctly in both themes with keyboard-scrollable overflow.
- [ ] No duplicated "Related" labels (02 owns the block).
