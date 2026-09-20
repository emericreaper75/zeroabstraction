---
name: Observatory Editorial Engine
colors:
  surface: '#0e1417'
  surface-dim: '#0e1417'
  surface-bright: '#343a3d'
  surface-container-lowest: '#090f12'
  surface-container-low: '#161c20'
  surface-container: '#1a2024'
  surface-container-high: '#252b2e'
  surface-container-highest: '#303639'
  on-surface: '#dee3e7'
  on-surface-variant: '#d5c3b6'
  inverse-surface: '#dee3e7'
  inverse-on-surface: '#2b3135'
  outline: '#9e8e82'
  outline-variant: '#51443b'
  surface-tint: '#f8ba85'
  primary: '#f8ba85'
  on-primary: '#4c2700'
  primary-container: '#d49a68'
  on-primary-container: '#5a3208'
  inverse-primary: '#835428'
  secondary: '#cac6bf'
  on-secondary: '#32302b'
  secondary-container: '#484741'
  on-secondary-container: '#b8b5ae'
  tertiary: '#94d0e2'
  on-tertiary: '#003641'
  tertiary-container: '#74afc1'
  on-tertiary-container: '#004250'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#f8ba85'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#673d13'
  secondary-fixed: '#e6e2da'
  secondary-fixed-dim: '#cac6bf'
  on-secondary-fixed: '#1c1c17'
  on-secondary-fixed-variant: '#484741'
  tertiary-fixed: '#b0ecff'
  tertiary-fixed-dim: '#94d0e2'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5e'
  background: '#0e1417'
  on-background: '#dee3e7'
  surface-variant: '#303639'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 3.5rem
    fontWeight: '400'
    lineHeight: 4rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 2.5rem
    fontWeight: '400'
    lineHeight: 3rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.875rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.06em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.625rem
    fontWeight: '400'
    lineHeight: 0.875rem
    letterSpacing: 0.1em
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves an archive-scale personal workspace and content management environment tailored for rigorous scientific writing, archival astrophotography, and deep speculative prose. The audience consists of discerning researchers, curators, and writers who view the CMS not merely as a database utility, but as an intellectual retreat and publishing atelier.

The design movement synthesizes **Literary Editorial Elegance** with **Scientific Precision / Technical Brutalism**:
- Deep cosmic charcoals ground the canvas in cinematic stillness, reminiscent of late-night celestial observations.
- Typographic tension emerges between the authoritative, humanistic literary weight of editorial serif headings and the clinical clarity of monospaced coordinates, epochs, and metrics.
- Surfaces adopt an unhurried, generous pacing reminiscent of fine print quarterly journals (*The Paris Review*, *Aperture*, *Aeon*), stripping away generic SaaS clutter in favor of crisp 1px hairline rules, asymmetrical metadata sidebars, and warm amber illumination.

## Colors

The palette simulates high-grade optical instruments operating in darkrooms and deep-sky observatories. It relies on subtle contrast steps rather than neon saturation.

### Functional Palette Structure
- **Canvas Base (`#0B1114`)**: A profound, near-black cosmic charcoal with cold oceanic undertones. Applied strictly to root backgrounds and full-viewport empty states.
- **Surface (`#0E1417`)**: The primary interactive ground for workspace panels, document sheets, and navigation rails.
- **Surface Container (`#1A2123`)**: Elevated grouping tier for table rows, popovers, media card wells, and modal surfaces.
- **Hairline Borders (`#2A3032`)**: Single-pixel architectural demarcations defining columns, grid divisions, and split panes without visual noise.
- **Text & Editorial Ink**:
  - Primary (`#F1ECE2`): An unbleached warm archival white, reducing ocular fatigue during prolonged cataloging sessions.
  - Secondary / Metadata (`#A7A49D`): A warm slate tone dedicated to labels, observational parameters, and secondary body.
  - Muted Inactive (`#5C6264`): Subdued structural framing, table column indicators, and disabled actions.
- **Bronze Accent (`#D49A68`)**: A restrained, reflective amber reminiscent of brass astrolabes and dry-plate photography tones. Used strictly for focus outlines, active document states, publication markers, and cursor indicators.

## Typography

The typographical system operates across three distinct semantic domains:

1. **Editorial Display (`Newsreader`)**: Reserved for archive titles, monograph chapters, and collection mastheads. Set preferentially with italic styling for primary headings to introduce an authentic literary rhythm akin to physical literary gazettes.
2. **System Interface (`IBM Plex Sans`)**: Provides disciplined, neutral readability across prose drafting canvases, documentation body paragraphs, and administrative form descriptions.
3. **Astrophysical Indexing & Metrics (`JetBrains Mono`)**: Serves telemetry blocks, celestial coordinates (RA/Dec), UTC timestamps, schema keys, word counts, and status indicators. Always configured in tabular numbers (`tnum`) with uppercase tracking applied on labels.

## Layout & Spacing

The layout model implements an **Asymmetrical Fixed-Fluid Hybrid Grid** calibrated for long-form cataloging and archival review:

- **Desktop Shell**:
  - Global Navigation Rail: 72px fixed collapsed width (or 260px expanded archive index).
  - Editorial Canvas: Centered manuscript column fixed at 768px maximum width for optimized reading cadence.
  - Metadata Telemetry Inspector: 360px sticky sidebar panel anchored right, bounded by vertical 1px `#2A3032` continuous division.
- **Breakpoints**:
  - `desktop` (1280px and above): Full 3-pane workbench (Rail, Content, Telemetry).
  - `tablet` (768px - 1279px): Telemetry panel shifts to a collapsable slide-over drawer; main canvas occupies fluid width with `margin: 2rem`.
  - `mobile` (under 768px): Single-column stack. Global rail collapses into a persistent bottom archival dock. Canvas margins contract to `1rem`.
- **Rhythm Principle**: Micro-spacing inside form fields and data cells conforms strictly to a 4px baseline rhythm (`space-xs` through `space-md`), while outer layout sections breathe with deliberate, generous pauses (`space-xl` and above) to evoke print publication margins.

## Elevation & Depth

This design system rejects conventional diffused drop shadows and faux-3D skeuomorphism. Spatial depth is achieved exclusively through **Surface Tonal Layering** combined with **1px Low-Contrast Architectural Outlines**:

- **Tier 0 (Base Canvas)**: Background at `#0B1114`. Completely unbordered.
- **Tier 1 (Panels & Sheets)**: Document writing surfaces, sidebars, and sticky header bars at `#0E1417`, demarcated with a crisp `border: 1px solid #2A3032`.
- **Tier 2 (Popovers, Drawers, Floating Menus)**: `#1A2123` with a razor-thin border `1px solid rgba(212, 154, 104, 0.25)` (accent-tinted boundary) and an ultra-subtle, non-blurry occlusion ring `0 0 0 1px #0B1114`.
- **Optical Focus**: When an active panel or editor cell gains operational focus, the bounding border transitions cleanly from `#2A3032` to `#D49A68` without changing physical dimensions.

## Shapes

The design system enforces a **Sharp (`0`) Geometric Language**. Corners throughout the interface remain unrounded (0px radius):

- Buttons, form controls, media cards, dialog boxes, and badges feature razor-sharp rectangular perimeters.
- The absence of curved corners reinforces technical rigor, referencing optical instrumentation, printed broadsheet columns, and architectural blueprint framing.
- Visual softness is achieved solely through generous whitespace, typographic line length, and warm neutral tones rather than organic corner radiuses.

## Components

### Action Triggers (Buttons)
- **Primary**: Solid background `#D49A68`, foreground `#0B1114`, sharp edges, typography `label-md` in JetBrains Mono. Hover state darkens slightly to `#BC8353`.
- **Ghost / Editorial Secondary**: Transparent background, border `1px solid #2A3032`, text `#F1ECE2`. Hover transitions border to `#A7A49D` and background to `#1A2123`.
- **Utility / Archive Action**: Monospaced text-only button with prefix icon/bracket `[ + ADD CATALOG ENTRY ]` in `#A7A49D`, active state shifting to `#D49A68`.

### Status Badges & Chips
- Crisp 1px bordered enclosures containing uppercase microcopy in `label-sm`.
- Static/Draft state: Background `#0E1417`, border `#2A3032`, text `#A7A49D`.
- Published/Cataloged: Border `1px solid rgba(212, 154, 104, 0.6)`, text `#D49A68`, background `rgba(212, 154, 104, 0.05)`.

### Form Fields & Technical Inputs
- Text inputs and rich text nodes share `#0E1417` background with a static 1px `#2A3032` border.
- Inactive input text is set in `body-md`, while associated contextual labels rest outside the input above in `label-md` JetBrains Mono (`#A7A49D`).
- Focus state activates an unbroken `1px solid #D49A68` bounding line accompanied by a subtle amber glow hint restricted to the border itself.

### Selection Controls (Checkboxes & Radios)
- Checkboxes: Strict 16x16px squares with 0px radius, bounded by `#2A3032`. When checked, the box fills `#D49A68` displaying an `#0B1114` geometric checkmark.
- Radio indicators: Sharp 14x14px rotated diamond markers (`transform: rotate(45deg)`) that fill solid bronze when active, bypassing standard circular SaaS tropes.

### Collection Lists & Telemetry Tables
- Borderless table rows punctuated only by a bottom `1px solid #2A3032` separator.
- Columns align strictly to fixed grids with metadata cells (right ascension, observation date, exposure index) locked in `JetBrains Mono` at `body-sm`.
- Row hover triggers a solid background highlight of `#1A2123` with the lead cell displaying an amber vertical bar `2px solid #D49A68`.

### Archival Media Cards
- Zero-radius framing with full-bleed astrophotography preview.
- Metadata placard underneath set in `#0E1417` containing italic `Newsreader` image title, followed by an inline horizontal strip of camera telemetry and spectral filters in `label-sm`.