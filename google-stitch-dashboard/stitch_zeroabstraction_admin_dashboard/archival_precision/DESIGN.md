---
name: Archival Precision
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#51443b'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#837469'
  outline-variant: '#d5c3b6'
  surface-tint: '#835428'
  primary: '#835428'
  on-primary: '#ffffff'
  primary-container: '#d49a68'
  on-primary-container: '#5a3208'
  inverse-primary: '#f8ba85'
  secondary: '#615e5c'
  on-secondary: '#ffffff'
  secondary-container: '#e7e1df'
  on-secondary-container: '#676462'
  tertiary: '#615e5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#aaa5a1'
  on-tertiary-container: '#3e3b38'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#f8ba85'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#673d13'
  secondary-fixed: '#e7e1df'
  secondary-fixed-dim: '#cac5c4'
  on-secondary-fixed: '#1d1b1a'
  on-secondary-fixed-variant: '#494645'
  tertiary-fixed: '#e7e1dc'
  tertiary-fixed-dim: '#cbc5c1'
  on-tertiary-fixed: '#1d1b18'
  on-tertiary-fixed-variant: '#494643'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Noto Serif
    fontSize: 2.5rem
    fontWeight: '400'
    lineHeight: 3rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 2rem
    fontWeight: '400'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 1.625rem
    fontWeight: '400'
    lineHeight: 2.125rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 1.375rem
    fontWeight: '400'
    lineHeight: 1.875rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: '0'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: '0'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: '0'
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.05em
  code-md:
    fontFamily: Space Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
  code-sm:
    fontFamily: Space Mono
    fontSize: 0.6875rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the rigor of a scholarly archive and the clarity of a modern headless content management system. It balances architectural restraint with intellectual warmth, serving content engineers, research editors, and technical curators who navigate dense relational structures.

The visual style is **Minimalist Archival**:
- **Discipline & Clarity**: Grounded in paper-like neutral surfaces, razor-sharp dividing rules, and strict grid alignments. Every element has an evidentiary purpose.
- **Editorial Sophistication**: High-contrast, literary display serifs anchor landmark navigation and collection titles, elevating database administrative views into curated artifacts.
- **Monospaced Utility**: Technical metadata, field names, relational IDs, and entry statistics are elevated to first-class visual components, instilling confidence and scientific rigor.

## Colors

The palette mimics physical archival artifacts: vellum papers, crisp ink, and warm metallic markers.

- **Canvas & Surfaces**:
  - `canvas`: `#F9F9F8` — Base atmospheric background, softly warm and non-glaring.
  - `surface`: `#FFFFFF` — Primary content cards, active document viewports, and editing panels.
  - `surface-container`: `#F4F4F0` — Recessed utility panels, code editors, sidebar navigation, and table header rows.
  - `surface-hover`: `#EFEFEA` — Subtle interactive feedback on inactive neutral surfaces.
- **Rules & Boundaries**:
  - `border-subtle`: `#E6E4E0` — Structural hairline rules, grid separators, and input boundaries.
  - `border-strong`: `#C8C5BF` — Focused dividers and active pane separators.
- **Ink Hierarchy**:
  - `text-primary`: `#1C1B1A` — Dense, carbon-black ink for primary content and interface text.
  - `text-secondary`: `#5E5B56` — Muted carbon for secondary metadata, field descriptions, and navigation items.
  - `text-tertiary`: `#8C8882` — Ghost ink for timestamps, structural paths, and disabled elements.
- **Accents**:
  - `accent-primary`: `#D49A68` (Restrained Bronze / Cognac) — Reserved strictly for active states, selected collection toggles, primary creation triggers, and key status highlights.
  - `accent-surface`: `#FBF5EE` — Delicate wash for selected table rows and badge backgrounds.
  - `accent-hover`: `#BF8554` — Focused interactive states for accent-filled elements.

## Typography

The typography strategy leverages three deliberate voices:
- **Noto Serif**: Serves as the primary editorial display face, lending literary weight to page headers, collection root names, and major document headings.
- **IBM Plex Sans**: Acts as the structural workhorse for operational UI elements, input field values, form headers, and navigation menus. Clean, humanistic, and engineered for readability across high-density data tables.
- **Space Mono**: Governs record IDs, timestamps, payload size indicators, raw API payloads, document version hashes, and schema definitions.

All uppercase labels must utilize a minimum letter-spacing of `0.05em` to preserve legibility against neutral backgrounds.

## Layout & Spacing

The layout is built around a structured desktop-first administrative workspace:
- **Grid Architecture**: 12-column adaptive fluid grid with a fixed left utility sidebar (`280px` on desktop, collapsible to `64px` icon-only or off-canvas drawer on mobile).
- **Rhythm**: Built on a strict 4px base increment. Data tables and property sheets use compact 32px row heights; document drafting zones use relaxed 48px/64px breathing rooms.
- **Breakpoints**:
  - `Desktop (>= 1280px)`: Simultaneous three-pane visibility (Directory Navigation, Data Table / Canvas, Properties/Metadata Inspector).
  - `Tablet (768px - 1279px)`: Two-pane visibility; metadata inspector transitions to a slide-over panel.
  - `Mobile (< 768px)`: Single-column linear flow; actions collapse into an edge-anchored bottom sheet.

## Elevation & Depth

This system intentionally rejects heavy drop shadows in favor of **Crisp Archival Planarity**:
- **Low-Contrast Structural Rules**: Depth is created primarily through 1px solid hairline borders (`#E6E4E0`) separating `#FFFFFF` cards from the `#F9F9F8` base canvas.
- **Recessed Inset**: Utility trays, sidebar panels, and formula inputs use `#F4F4F0` to sit visually below the active editing canvas.
- **Floating Overlays**: For popovers, dropdown menus, and modal dialogs, use sharp, razor-thin borders accompanied by an ultra-diffused, bronze-tinted atmospheric shadow: `0 8px 24px -4px rgba(44, 42, 41, 0.06), 0 2px 6px -1px rgba(44, 42, 41, 0.04)`.

## Shapes

The shape system is **Soft & Architectural** (`roundedness: 1`):
- Base interactive elements (buttons, inputs, dropdown items, table row focus rings) use `2px` to `4px` corner radii, maintaining a crisp, paper-like profile.
- Containment elements (cards, modal viewports, drawers) use `6px` maximum radius.
- Rounded circular/pill geometry is strictly prohibited except for numeric record count indicators and binary status pips (`rounded-full`).

## Components

- **Buttons**:
  - *Primary*: `#D49A68` background, `#FFFFFF` text, `4px` radius, medium IBM Plex Sans weight. On hover, background shifts to `#BF8554`.
  - *Secondary*: `#FFFFFF` background with a 1px `#E6E4E0` border, `#1C1B1A` text. On hover, surface becomes `#F4F4F0`.
  - *Ghost / Archival Action*: Monospaced text with underline on hover; no background container.
- **Form Inputs & Fields**:
  - Background `#FFFFFF`, border `1px solid #E6E4E0`, `4px` radius. Focus ring: `1px solid #D49A68` with no glow/blur halo. Field labels render in uppercase `label-sm` with Space Mono field keys placed adjacent.
- **Data Tables & Lists**:
  - Table header uses `#F4F4F0` with `border-bottom: 1px solid #E6E4E0` and `Space Mono` typography.
  - Rows alternate with `#FFFFFF` surfaces; hovering renders `#F9F9F8`. Selected rows apply a left 2px vertical indicator in `#D49A68` and an ambient background of `#FBF5EE`.
- **Chips & Status Badges**:
  - Minimal square-cut pill (`2px` border radius). Draft states: `#F4F4F0` background with `#5E5B56` text. Published states: `#FBF5EE` background with `#9B683B` text and `Space Mono` version indicators.
- **Checkboxes & Radios**:
  - Checkboxes use `2px` corners, crisp `1px solid #C8C5BF` border, checking to `#D49A68` fill with sharp white glyphs.
- **Metadata Inspector (Payload-Specific)**:
  - Sticky right-hand sheet with `#F4F4F0` background and a continuous `1px solid #E6E4E0` left border. Uses `code-sm` to display document schema types, slug revisions, and localization keys.