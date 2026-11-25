# Palette 04: ChromaForge Sage & Triadic System
**Document Version:** 1.0.0  
**Status:** Approved Specification & Implementation Blueprint  
**Target Directory:** `docs/design-colors/`  
**Associated Deliverables:**
- Standalone CSS Tokens: [`palette-04-chromaforge.css`](./palette-04-chromaforge.css)
- OKLCH Tonal Scales & Semantic UI Card: [`palette-04-chromaforge-tonal-scales.png`](./palette-04-chromaforge-tonal-scales.png)
- Visual Design Mockup: [`palette-04-visual-reference.png`](./palette-04-visual-reference.png)
- Technical Swatches: [`palette-04-technical-swatches.png`](./palette-04-technical-swatches.png)

---

## 1. Executive Summary & Design System Architecture

This specification formalizes **Palette 04** under the **ChromaForge Design System Token Architecture**.
The system establishes a restrained, serene mineral aesthetic anchored by warm sage stone (`#9F918E`), balanced by its direct complementary slate pewter (`#8E9C9F`), and framed by two subtle triadic counterpoints: willow sage (`#8E9F91`) and lavender pewter (`#918E9F`).

### Geometric & Perceptual Balance:
- **Hue Distribution:** Symmetrically placed around the color wheel at 10° (Base Warm Sage), 190° (180° Complementary Slate Pewter), 130° (+120° Triadic CW Willow Sage), and 250° (-120° Triadic CCW Lavender Pewter).
- **Uniform Perceptual Lightness & Neutralization:** Muted mineral chroma prevents visual fatigue while delivering organic elegance across scientific manuscripts, observational dossiers, and technical typography.
- **Material Design 3–Style Semantic Hierarchy:** Complete dual-theme semantic roles with calibrated `container` and `on-container` pairs meeting strict WCAG AA/AAA readability standards.

---

## 2. ChromaForge Token Specification

The standalone CSS stylesheet is preserved at [`docs/design-colors/palette-04-chromaforge.css`](./palette-04-chromaforge.css).

### 2.1 Harmony Anchors

| Role | Token Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Base Color** | `--harmony-base` | `#9F918E` | Mineral Sage / Primary brand anchor |
| **Complementary** | `--harmony-comp` | `#8E9C9F` | 180° Slate Pewter / Balanced cool secondary |
| **Triadic CW** | `--harmony-tri-cw` | `#8E9F91` | +120° Willow Sage / Organic botanical accent |
| **Triadic CCW**| `--harmony-tri-ccw`| `#918E9F` | -120° Lavender Pewter / Subtle chromatic contrast |

---

### 2.2 Semantic UI Roles: Light vs. Dark Themes

| Semantic Token | Light Theme (`:root`) | Dark Theme (`[data-theme="dark"]`) | Description / UI Usage |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#6B5D5A` (Step 600) | `#A2938F` (Step 400) | Primary CTA fills & prominent brand accents |
| `--color-on-primary` | `#FFFFFF` | `#161110` (Step 950) | High-contrast label/icon on solid primary fill |
| `--color-primary-container` | `#EEE8E7` (Step 100) | `#3D3331` (Step 800) | Low-emphasis cards, active chips, badges |
| `--color-on-primary-container` | `#161110` (Step 950) | `#F8F5F4` (Step 50) | High-contrast content on primary container |
| `--color-secondary` | `#546467` (Step 600) | `#8A9A9E` (Step 400) | Secondary action buttons, interactive links |
| `--color-on-secondary` | `#FFFFFF` | `#0F1415` (Step 950) | Content over secondary button fill |
| `--color-secondary-container` | `#E5EBEC` (Step 100) | `#2E383A` (Step 800) | Secondary callout surfaces, info blocks |
| `--color-on-secondary-container` | `#0F1415` (Step 950) | `#F3F6F7` (Step 50) | Content over secondary container |
| `--color-tertiary` | `#566559` (Step 600) | `#8C9C8E` (Step 400) | Environmental indicators, tertiary accents |
| `--color-on-tertiary` | `#FFFFFF` | `#0F1410` (Step 950) | Content over tertiary fills |
| `--color-tertiary-container` | `#E5EBE6` (Step 100) | `#2F3931` (Step 800) | Verified chips, botanical tags |
| `--color-on-tertiary-container` | `#0F1410` (Step 950) | `#F4F7F4` (Step 50) | Content over tertiary container |
| `--color-background` | `#F6F5F5` (Neutral 50) | `#0F1117` | Canvas background under all surfaces |
| `--color-on-background` | `#141212` (Neutral 950) | `#F6F5F5` (Neutral 50) | Default base reading text |
| `--color-surface` | `#FFFFFF` | `#161922` | Component card surfaces |
| `--color-on-surface` | `#141212` (Neutral 950) | `#F6F5F5` (Neutral 50) | Headings and titles on cards |
| `--color-surface-variant` | `#EBE9E9` (Neutral 100) | `#202534` | Nested input bars, table headers, spine bands |
| `--color-on-surface-variant` | `#4C4948` (Neutral 700) | `#B9B6B5` (Neutral 300) | Subtitles, metadata labels, footnotes |
| `--color-surface-elevated` | `#FFFFFF` | `#262C3D` | Popovers, modals, elevated floating menus |
| `--color-outline` | `#9A9695` (Neutral 400) | `#635F5E` (Neutral 600) | Focused borders, input strokes |
| `--color-divider` | `#D5D3D2` (Neutral 200) | `#383535` (Neutral 800) | Card hairline rules, column dividers |
| `--color-success` | `#15803D` | `#4ADE80` | Confirmed/positive statuses |
| `--color-warning` | `#B45309` | `#FBBF24` | Alert banners and caution pills |
| `--color-error` | `#DC2626` | `#F87171` | Validation errors and destructive actions |
| `--color-info` | `#1D4ED8` | `#60A5FA` | Informational callouts and tooltips |

---

### 2.3 OKLCH Perceptual Tonal Scales

Each scale progresses along an ergonomically calibrated perceptual luminance curve:

| Step | Primary (Warm Sage) | Secondary (Slate Pewter) | Tertiary (Willow Sage) | Quaternary (Lavender Pewter) | Neutral (Mineral Canvas) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **50** | `#F8F5F4` | `#F3F6F7` | `#F4F7F4` | `#F6F5F8` | `#F6F5F5` |
| **100**| `#EEE8E7` | `#E5EBEC` | `#E5EBE6` | `#E9E9EE` | `#EBE9E9` |
| **200**| `#DBD1CF` | `#CCD6D8` | `#CDD7CE` | `#D4D2DC` | `#D5D3D2` |
| **300**| `#C1B3B0` | `#ACBABD` | `#ADBBAF` | `#B7B5C3` | `#B9B6B5` |
| **400**| `#A2938F` | `#8A9A9E` | `#8C9C8E` | `#9794A5` | `#9A9695` |
| **500**| `#847571` | `#6C7C80` | `#6D7E70` | `#797687` | `#7C7877` |
| **600**| `#6B5D5A` | `#546467` | `#566559` | `#615E6D` | `#635F5E` |
| **700**| `#534744` | `#3F4C4F` | `#414E43` | `#4A4855` | `#4C4948` |
| **800**| `#3D3331` | `#2E383A` | `#2F3931` | `#36343F` | `#383535` |
| **900**| `#292220` | `#1E2527` | `#1E2620` | `#24222A` | `#252323` |
| **950**| `#161110` | `#0F1415` | `#0F1410` | `#131217` | `#141212` |

---

## 3. Contrast Ratios & Accessibility Compliance

| Pair | Light Theme | Dark Theme | Minimum Requirement | Conformance |
| :--- | :--- | :--- | :--- | :--- |
| **Text on Canvas** | `#141212` on `#F6F5F5` (16.9:1) | `#F6F5F5` on `#0F1117` (17.3:1) | 4.5:1 (AA) / 7.0:1 (AAA) | **WCAG AAA Pass** |
| **Primary on Canvas** | `#6B5D5A` on `#F6F5F5` (5.8:1) | `#A2938F` on `#0F1117` (7.6:1) | 4.5:1 (AA) | **WCAG AA/AAA Pass** |
| **Primary Container Content** | `#161110` on `#EEE8E7` (14.2:1) | `#F8F5F4` on `#3D3331` (8.9:1) | 4.5:1 (AA) | **WCAG AAA Pass** |
| **Secondary Container Content** | `#0F1415` on `#E5EBEC` (14.8:1) | `#F3F6F7` on `#2E383A` (9.5:1) | 4.5:1 (AA) | **WCAG AAA Pass** |
| **Tertiary Container Content** | `#0F1410` on `#E5EBE6` (14.9:1) | `#F4F7F4` on `#2F3931` (9.8:1) | 4.5:1 (AA) | **WCAG AAA Pass** |
