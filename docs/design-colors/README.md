# Design Colors Catalog & ChromaForge Implementation Blueprints

This directory contains design drafts, implementation blueprints, token scale specifications, and generated visual references for color palettes in the **ZeroAbstraction** design system.

---

## Palettes Overview

| Palette ID | Name | Primary Anchors | Status | Blueprint & Tokens | Tonal Scales Reference | Visual Showcase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | ChromaForge Warm Sand & Triadic System | `#BE9D6F` (Base)<br>`#6F90BE` (Comp)<br>`#6FBE9D` (Triad CW)<br>`#9D6FBE` (Triad CCW) | Approved / Production Spec | • [Draft Blueprint](./palette-01-warm-sand-harmonic.md)<br>• [CSS Tokens](./palette-01-chromaforge.css) | [palette-01-chromaforge-tonal-scales.png](./palette-01-chromaforge-tonal-scales.png) | • [Visual Concept](./palette-01-visual-reference.png)<br>• [Technical Swatches](./palette-01-technical-swatches.png) |
| **02** | ChromaForge Amethyst & Jewel Triadic System | `#A662CB` (Base)<br>`#87CB62` (Comp)<br>`#CBA662` (Triad CW)<br>`#62CBA6` (Triad CCW) | Approved / Production Spec | • [Draft Blueprint](./palette-02-amethyst-harmonic.md)<br>• [CSS Tokens](./palette-02-chromaforge.css) | [palette-02-chromaforge-tonal-scales.png](./palette-02-chromaforge-tonal-scales.png) | • [Visual Concept](./palette-02-visual-reference.png)<br>• [Technical Swatches](./palette-02-technical-swatches.png) |
| **03** | ChromaForge Electric Indigo & Cyber Triadic System | `#5636F7` (Base)<br>`#D7F736` (Comp)<br>`#F75636` (Triad CW)<br>`#36F756` (Triad CCW) | Approved / Production Spec | • [Draft Blueprint](./palette-03-indigo-harmonic.md)<br>• [CSS Tokens](./palette-03-chromaforge.css) | [palette-03-chromaforge-tonal-scales.png](./palette-03-chromaforge-tonal-scales.png) | • [Visual Concept](./palette-03-visual-reference.png)<br>• [Technical Swatches](./palette-03-technical-swatches.png) |
| **04** | ChromaForge Sage & Triadic System | `#9F918E` (Base)<br>`#8E9C9F` (Comp)<br>`#8E9F91` (Triad CW)<br>`#918E9F` (Triad CCW) | Approved / Production Spec | • [Draft Blueprint](./palette-04-sage-harmonic.md)<br>• [CSS Tokens](./palette-04-chromaforge.css) | [palette-04-chromaforge-tonal-scales.png](./palette-04-chromaforge-tonal-scales.png) | • [Visual Concept](./palette-04-visual-reference.png)<br>• [Technical Swatches](./palette-04-technical-swatches.png) |

---

## File Naming Standard

For every color palette registered:
- **Implementation Draft / Spec:** `palette-{XX}-{kebab-name}.md`
- **Standalone CSS Tokens:** `palette-{XX}-chromaforge.css`
- **OKLCH Tonal Scales Reference:** `palette-{XX}-chromaforge-tonal-scales.png`
- **Visual Design Reference:** `palette-{XX}-visual-reference.png`
- **Technical Swatches & Contrast Card:** `palette-{XX}-technical-swatches.png`
