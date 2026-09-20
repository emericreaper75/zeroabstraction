---
name: Observatory Editorial Engine
colors:
  surface: '#faf9f5'
  surface-dim: '#dadad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#eeeeea'
  surface-container-high: '#e8e8e4'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#52443a'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f1f1ed'
  outline: '#847468'
  outline-variant: '#d7c3b5'
  surface-tint: '#89511b'
  primary: '#864f18'
  on-primary: '#ffffff'
  primary-container: '#a3672f'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb77b'
  secondary: '#8a501d'
  on-secondary: '#ffffff'
  secondary-container: '#fdb074'
  on-secondary-container: '#77410e'
  tertiary: '#595c60'
  on-tertiary: '#ffffff'
  tertiary-container: '#717578'
  on-tertiary-container: '#fbfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#ffb77b'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6c3a03'
  secondary-fixed: '#ffdcc4'
  secondary-fixed-dim: '#ffb77f'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6d3905'
  tertiary-fixed: '#e0e3e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#181c1f'
  on-tertiary-fixed-variant: '#43474a'
  background: '#faf9f5'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
  paper-base: '#fbfbfa'
  paper-surface: '#f4f4f0'
  paper-container: '#eaeae5'
  ink-primary: '#181c1e'
  ink-secondary: '#2d3134'
  ink-muted: '#686c6f'
  hairline-rule: '#e0e0db'
  hairline-subtle: '#ecece6'
  accent-amber: '#b3743b'
  accent-ochre: '#965a26'
  amber-wash: '#f6eee3'
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
    fontWeight: '500'
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
    fontWeight: '500'
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

This design system translates the atmospheric rigor of an astronomical observatory into a luminous, daylight editorial environment. Tailored for academic institutions, long-form journals, and archival research collectives, it treats data collection and essayistic inquiry as twin disciplines of equal dignity.

The design movement synthesizes **Literary Broadsheet Publishing** with **Scientific Telemetry**:
- **Parchment and Crisp Vellum**: The canvas abandons sterile synthetic whites in favor of mineral-toned parchment, alabaster, and soft paper substrates (`#FBFBFA`, `#F4F4F0`, `#EAEAE5`), creating an organic reading experience reminiscent of tactile archives and physical monographs.
- **Deep Slate Editorial Ink**: High-contrast typography in deep charcoal (`#181C1E`) and weathered slate (`#2D3134`) anchors the page with unambiguous authority.
- **Instrumental Amber Accents**: Warm ochre and burnished brass tones (`#B3743B`, `#965A26`) evoke historical measuring devices, astrolabes, and daylight optical instruments.
- **Structural Hairlines**: Crisp 1px rules in soft stone grey (`#E0E0DB`) preserve architectural division without clutter, avoiding shadows in favor of balanced typography and deliberate negative space.

## Colors

The light-mode palette draws directly from fine publication papers and daylight optical workshops, providing superior long-form legibility with deliberate tactile contrast.

### Palette Hierarchy & Roles
- **Canvas Ground (`paper-base` / `#FBFBFA`)**: The primary root background; an unbleached alabaster base that eliminates eye strain while preserving crisp visual pop.
- **Surfaces & Worksheets (`paper-surface` / `#F4F4F0`)**: Assigned to sidebars, table headers, document cards, and telemetry shelves.
- **Containers & Recessed Wells (`paper-container` / `#EAEAE5`)**: Applied to input wells, active row states, and metadata panels.
- **Hairline Rules (`hairline-rule` / `#E0E0DB`)**: Standard 1px visual dividers separating columns, articles, and navigation bars.
- **Editorial Ink**:
  - `ink-primary` (`#181C1E`): Used for primary headlines, monograph titles, and active reading copy.
  - `ink-secondary` (`#2D3134`): Used for section subtitles, author bylines, and primary monospaced telemetry figures.
  - `ink-muted` (`#686C6F`): Applied to table headers, index labels, and inactive utility controls.
- **Instrument Accents**:
  - `accent-amber` (`#B3743B`): Active indicators, primary action triggers, status chips, and focused tab marks.
  - `accent-ochre` (`#965A26`): Deepened hover states, active links, and prominent telemetry callouts.
  - `amber-wash` (`#F6EEE3`): Light background fill for selected states, callout containers, and highlighted passages.

## Typography

Typographic hierarchy bridges historical printing traditions and exact observational notation:

1. **Editorial Serifs (`Newsreader`)**: Anchors monographs, archive headlines, chapter lead-ins, and pulls. Display levels (`headline-xl` and `headline-lg`) support an italic styling for literary emphasis.
2. **Reading Prose (`IBM Plex Sans`)**: Balances the serifs with contemporary legibility across essay drafts, observational narratives, and configuration menus.
3. **Telemetry & Indexing (`JetBrains Mono`)**: Handles all tabular metrics, celestial coordinates, metadata stamps, catalog registration numbers, and system controls. Tabular figures (`font-variant-numeric: tabular-nums`) and uppercase tracking are standard across label tiers.

## Layout & Spacing

The layout model uses a multi-tier asymmetric workspace configured for extended reading and granular editing:

- **Desktop Structure (1280px+)**:
  - Left Index Rail: 240px fixed or collapsible to 64px icon bar.
  - Central Manuscript Deck: Max-width 780px centered column with 65–75 character line lengths for uninterrupted reading.
  - Right Telemetry Inspector: 320px fixed panel bound by a 1px `#E0E0DB` vertical hairline rule.
- **Tablet (768px - 1279px)**:
  - Inspector converts to an anchored bottom drawer or tabbed side-rail. The main canvas adapts fluidly with `margin: 2rem` and `gutter: 1.25rem`.
- **Mobile (< 768px)**:
  - Single-column linear layout. Navigation consolidates into an archival drawer, canvas margins drop to `1rem`, and all telemetry blocks stack inline below reading sections.
- **Spacing Cadence**: Micro-spacing adheres to an 8px grid (with 4px substeps via `space-xs`), while outer sections honor spacious editorial margins to evoke wide broadsheet page borders.

## Elevation & Depth

This design system deliberately eschews heavy drop shadows, synthetic blurs, and skeuomorphic gradients. Spatial order is conveyed purely through surface contrast, structural rules, and intentional boundary lines:

- **Tier 0 (Root Page)**: `#FBFBFA` raw paper canvas.
- **Tier 1 (Panels & Broadside Dividers)**: `#F4F4F0` bounded by a crisp `1px solid #E0E0DB`. Sidebars, header bars, and document drawers sit at this level.
- **Tier 2 (Floating Palettes & Tooltips)**: `#FFFFFF` backing wrapped in a dual perimeter: `border: 1px solid #B3743B` with an ambient paper drop `0 2px 8px rgba(24, 28, 30, 0.06)`.
- **Active / Focused Depth**: Active editorial modules or data rows do not physically lift; they change border state from `#E0E0DB` to `#B3743B` and gain a gentle `#F6EEE3` paper tint.

## Shapes

The design system adheres strictly to a **Sharp (`0`) Geometric Language**:

- Corner radius is `0px` across buttons, cards, modals, tabs, form inputs, and status chips.
- Rectangular perimeters reinforce the print broadsheet aesthetic, technical charting instruments, and microfiche apertures.
- Softness is achieved through warm paper tones and balanced serif curves rather than synthetic corner rounding.

## Components

### Buttons
- **Primary**: Solid `#B3743B` fill, `#FFFFFF` text, `0px` border radius, typeset in `label-md` JetBrains Mono uppercase. Hover shifts to `#965A26`.
- **Secondary (Hairline)**: Transparent background, `1px solid #E0E0DB` border, `#2D3134` text. Hover shifts border to `#B3743B` with `#F4F4F0` surface.
- **Archival Text Action**: Raw monospaced trigger formatted as `[ EXPORT REGISTRY ]` in `#686C6F`, transitioning to `#B3743B` on hover.

### Status Chips & Metadata Badges
- Strict rectangular tags with `1px solid #E0E0DB` border, `padding: 2px 8px`, `label-sm` JetBrains Mono.
- **Draft / In Review**: `#F4F4F0` background, `#2D3134` ink.
- **Archived / Published**: `#F6EEE3` amber-wash background, `1px solid #B3743B` border, `#965A26` ink.

### Form Inputs & Telemetry Fields
- Background set to `#FFFFFF` with `1px solid #E0E0DB`. Typography uses `body-md` in `#181C1E`.
- Focus activates a crisp `1px solid #B3743B` frame.
- Field labels sit directly above in `label-md` JetBrains Mono in `#686C6F`.

### Checkboxes & Radios
- **Checkbox**: 16x16px square, `0px` radius, `1px solid #E0E0DB` border, `#FFFFFF` background. Checked state fills `#B3743B` with a `#FFFFFF` hairline tick.
- **Radio**: 14x14px square rotated 45 degrees (diamond geometry), filling `#965A26` when selected.

### Collection Lists & Observation Logs
- Alternating or clean-ruled lists with `1px solid #E0E0DB` dividers.
- Hover triggers `#F6EEE3` paper wash, accompanied by a 2px left indicator line in `#B3743B`.
- Observation data columns (RA, Dec, Epoch, Spectral Class) strictly align to tabular mono cells.

### Manuscript Cards & Media Plates
- Flat rectangular enclosures using `paper-surface` (`#F4F4F0`) bounded by `1px solid #E0E0DB`.
- Media embeds sit flush with no inner border radius, paired with bottom metadata placards set in italic `Newsreader` alongside monospaced exposure details in `label-sm`.