# 08 — Home Page: Runtime Theme with Glass Top Bar

*Reference: MotionSites "AI Runtime" (free listing). Used for hero layering and choreography only; this document is self-contained.*
*Owner of: the Home page hero, the glass top bar variant, and the Home section rhythm. Right Now is owned by 03. Tokens from 04.*

## Scope decision
"Runtime-like theme" applies to the **hero and the rhythm between Home sections**. The other Home sections keep their current structure and content, recolored with tokens. The glass treatment applies to the **top navigation bar on Home only**.

## Page order (unchanged from today)
1. Hero with glass top bar
2. Right Now (03)
3. Featured work (current large editorial artifact)
4. Writing teaser (current dated list; uses the same list component as 06's List view)
5. About teaser (current)
6. Footer (current)

## Hero
**Height:** `min-height:88svh`. **Layers (bottom to top):**
1. Media: a real night-sky or observatory photograph via `next/image` (`priority`, `fill`, `object-fit:cover`), meaningful `alt`.
2. Scrim: `--hero-scrim`.
3. Content.
4. Glass top bar (fixed/sticky, above everything).
5. Bottom blend: a 160px gradient from transparent to `--bg` at the hero's bottom edge, so there is no hard line and no torn edge.

**Content (existing copy stays):**
- Name in `--font-display` at `--text-hero`, color `--hero-fg`.
- Identity statement in `--font-display`, light, about `--text-h2`, color `--hero-fg-muted`.
- Discipline line `PHYSICS · ECE · ASTROPHYSICS` in mono `--text-label`, `--hero-accent`.
- Contact links (email, GitHub, LinkedIn) in mono `--text-ui-sm`, `--hero-fg-muted`, hover `--hero-fg`.
- Explore cue: `SCROLL TO EXPLORE ↓` in mono at the bottom, `--hero-fg-muted`.
- No résumé CTA. No sage circle. No black placeholder box.
- Composition is asymmetric: text anchored lower-left within `--measure-wide`; not centered.

**Media rules:**
- Static image by default. No video required; if a looped video is ever added, it must be muted, `playsInline`, ≤ 2 MB, paused under reduced motion, and the poster image must be the same still.
- **Never a black box:** if the image is missing or fails, show a CSS gradient built from `--hero-scrim` over `--n-1`-independent dark tones (use `--inverse-bg`).
- Image file: optimized web version only (about 1920px wide, under ~400 KB, AVIF/WebP via `next/image`). Large originals stay out of Git.
- Credit/caption: show a mono `--text-ui-sm` credit (bottom right) **only if a real credit exists**. No invented coordinates or data labels.
- Until a personal photograph is supplied, use the current sample image with the fallback in place; the Content guidelines prefer personal astrophotography.

**Theme behavior:** the hero is theme-independent (always dark under the scrim). Everything below follows the active theme. The bottom blend goes to the active `--bg`.

**Contrast:** hero text must meet 4.5:1 against the worst-case region of the actual image under the scrim. Verify with screenshots of both themes; increase scrim opacity in 04 if needed (not in this file).

## Glass top bar
- Same component and dimensions as the bar on other pages: height 64px, same content (wordmark `Zero Abstraction`, links `HOME WRITING PROJECTS ABOUT`, search, theme toggle). **Only the surface differs.** Do not change structure, labels or order.
- **Over the hero:** floating bar inset by `--space-3` from the top and sides, max width `--measure-wide`, radius `--radius-bar`, background `--hero-glass-bg`, border 1px `--hero-glass-border`, `backdrop-filter:blur(var(--hero-glass-blur)) saturate(140%)`. Text `--hero-fg`; active link underline `--hero-accent`.
- **After scrolling past the hero:** compact sticky state (as the design system allows): full-width, background `--glass-bg`, bottom border `--glass-border`, `backdrop-filter:blur(var(--glass-blur))`, text `--text`. Transition `--dur-base`.
- **Fallbacks:** `@supports not (backdrop-filter:blur(1px))` uses a near-opaque solid (`--inverse-bg` over the hero, `--bg` when compact). `@media (prefers-reduced-transparency: reduce)` does the same. Reduced motion removes the state transition.
- Anchor links and `scroll-padding-top` account for the bar height.
- Skip link, focus order and focus ring are unchanged; the bar never traps focus.
- Other pages use the same bar in its **solid** surface (`--bg`, bottom border `--border`), so moving between pages keeps orientation.
- Mobile: the same bar with the existing full-screen menu; the glass surface applies the same way.

## Motion
- Hero content: staggered fade/translate on load (opacity and `translateY(12px)`, `--dur-slow`, stagger 80ms, at most three groups). No loaders, no delayed access to content.
- Optional subtle image parallax: at most 40px translate over the hero's height via Framer Motion `useScroll`; disabled under reduced motion.
- No particle systems, cursor effects, WebGL, or scroll-jacking.

## Sections below the hero
- Keep structure and content. Apply tokens; remove zigzag/tilt/outline from images (00); normalize vertical spacing to `--space-8`/`--space-9`.
- Featured work: do not reuse the hero image or any image used elsewhere on the page.
- About teaser: swap the placeholder portrait for a real photograph when available (content task).

## Out of scope
Page re-ordering, new sections (The Path So Far, Beyond the Core), new copy, video backgrounds, WebGL.

## Acceptance
- [ ] No black box at any time, including with the image removed.
- [ ] Glass bar legible on the real hero image in both themes; solid fallbacks work.
- [ ] After the hero, the bar becomes compact and follows the theme.
- [ ] Other pages show the same bar in solid form with identical height and layout.
- [ ] Hero image, scrim and text meet contrast; hero text is within `--text-hero` scale.
- [ ] Right Now renders per 03 directly after the hero (nothing if empty).
- [ ] No sage circle, zigzag, tilt, or reused image on the page.
- [ ] Lighthouse performance not worse than before; no layout shift from the hero.
