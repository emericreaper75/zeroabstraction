# Color Schema & Collage Art Redesign Plan

## Goal

Restructure the entire ZeroAbstraction design system to center on three core colors:

| Name | Hex | Role |
|------|-----|------|
| Warm Ivory | `#F9EBD7` | Background / surface base |
| Emerald Green | `#046A38` | Primary accent, interactive elements |
| Vermillion | `#E34222` | Secondary accent, highlights, status |

Plus implement collage art styling on public pages.

---

## 1. Color Mapping Strategy

### Full Palette Generation

**Light Theme (`data-theme='light'`):**

| CSS Variable | Hex | Notes |
|---|---|---|
| `--bg` | `#F9EBD7` | Warm Ivory — page/surface background |
| `--surface` | `#F9EBD7` | Same as bg (flat ivory substrate) |
| `--surface-hover` | `#f0ddbb` | 10% darker ivory |
| `--text` | `#0a1a10` | Ultra-dark green — near black, text |
| `--text-strong` | `#040a06` | Strongest text contrast |
| `--muted` | `#8a9a8e` | Desaturated green-gray for secondary text |
| `--border` | `#d5c9b8` | Soft ivory-brown border |
| `--border-strong` | `#b8a894` | Slightly stronger borders, dividers |
| `--accent` | `#046A38` | Emerald Green — primary brand |
| `--accent-hover` | `#03542d` | Darker emerald |
| `--accent-ink` | `#046A38` | Emerald for text links |
| `--focus-ring` | `#046A38` | Emerald focus outline |
| `--secondary` | `#E34222` | Vermillion — secondary/interactive |
| `--secondary-hover` | `#c4331a` | Darker vermillion |
| `--error` | `#E34222` | Vermillion for errors |
| `--success` | `#046A38` | Emerald for success states |
| `--warning` | `#c97a00` | Amber for warnings (derived) |

**Dark Theme (`data-theme='dark'`):**

| CSS Variable | Hex | Notes |
|---|---|---|
| `--bg` | `#031a10` | Deep forest green — dark background |
| `--surface` | `#0a2e1a` | Slightly lighter green for cards |
| `--surface-hover` | `#143e28` | Lighter hover state |
| `--text` | `#F9EBD7` | Warm Ivory — text color |
| `--text-strong` | `#FDF6F0` | Full ivory for emphasis |
| `--muted` | `#a8c4af` | Soft green for muted/secondary text |
| `--border` | `#2e5a40` | Dark green border |
| `--border-strong` | `#4a7a5b` | Stronger dividers |
| `--accent` | `#3EB364` | Brighter emerald for dark mode |
| `--accent-hover` | `#2da052` | Hover state |
| `--accent-ink` | `#3EB364` | Accent text |
| `--focus-ring` | `#3EB364` | Focus outline |
| `--secondary` | `#FF6350` | Brighter vermillion for dark mode |
| `--secondary-hover` | `#E85038` | Hover state |
| `--error` | `#FF6350` | Vermillion |
| `--success` | `#3EB364` | Bright emerald |
| `--warning` | `#FFD166` | Amber warning |

**Tailwind token mapping (used in JSX class names):**

| Tailwind Token | Light | Dark | Replacement |
|---|---|---|---|
| `primary` | `#9c602a` → `#046A38` | n/a | `--accent` |
| `accent-amber` | `#b3743b` → `#046A38` | n/a | `--accent` |
| `accent-ochre` | `#965a26` → `#E34222` | n/a | `--secondary` |
| `background` | `#faf9f5` → `#F9EBD7` | n/a | `--bg` |
| `paper-surface` | `#faf9f5` → `#F9EBD7` | n/a | `--surface` |
| `paper-base` | `#faf9f5` → `#F9EBD7` | n/a | `--bg` |
| `paper-sidebar` | `#f0efe9` → `#F0EDD3` | n/a | `--surface` variant |
| `paper-card` | `#f7f6f1` → `#F9EBD7` | n/a | `--surface` |
| `paper-input` | `#ffffff` → `#FFFFFF` or `#F9EBD7` | keep white with green border | |
| `paper-border` | `#e3ded3` → `#d5c9b8` | n/a | `--border` |
| `ink-primary` | `#11181c` → `#0a1a10` | n/a | `--text` |
| `ink-secondary` | `#2c3437` → `#2a4232` | `--F9EBD7` | `--text`/`--muted` |
| `ink-muted` | `#6a7378` → `#8a9a8e` | `#a8c4af` | `--muted` |
| `amber-wash` | `#f6eee3` → `#FFF0EB` | n/a | vermillion wash |
| `surface-container-highest` | `#e2e3df` → `#F0EDD3` | n/a | `--surface-hover` |
| `surface-container-high` | `#e8e8e4` → `#eddec9` | n/a | `--border` |
| `surface-container-low` | `#f6f5f0` → `#FFF9F3` | n/a | white variant |
| `surface-container-lowest` | `#ffffff` → `#FFFFFF` | n/a | white |
| `hairline-rule` | `#e5e4de` → `#d5c9b8` | `#2e5a40` | `--border` |
| `hairline-subtle` | `#ecece6` → `#e3d7c3` | n/a | `--border` variant |
| `surface-tint` | `#89511b` → `#046A38` | n/a | `--accent` |
| `cosmic-bg` | `#0b1013` → `#031a10` | n/a | dark `--bg` |
| `cosmic-surface` | `#0e1417` → `#0a2e1a` | n/a | dark `--surface` |
| `cosmic-container-low` | `#12181c` → `#0f3222` | n/a | dark variant |
| `cosmic-container` | `#182025` → `#14402f` | n/a | dark variant |
| `cosmic-container-high` | `#222a2f` → `#1e5a3d` | n/a | dark variant |
| `embarrass-500` | `#d49a68` → `#FF6350` | n/a | emerald/bright vermillion |
| `emerald-500` | `#10b981` → `#046A38` | `#3EB364`# | keep as-is |
| `emerald-600` | `#059669` → `#046A38` | `#2da052` | |
| `emerald-700` | `#047857` → `#03542d` | `#1a7a3c` | |
| `rose-50` → `rose-600` | `rose-*` → remap to vermillion | `rose-*` → vermillion | |
| `amber-wash` | `#f6eee3` → `#FFF0EB` | n/a | light vermillion tint |

**Key principle:** In light theme, backgrounds stay ivory (`#F9EBD7`), text is near-black green, emerald is primary, vermillion is secondary. In dark theme, backgrounds go deep forest green, text is ivory, emerald brightens for contrast, vermillion brightens.

---

## 2. Collage Art Aesthetic

### Concept
Implement an editorial collage style that evokes a research notebook / astronomical logbook with overlapping layers, torn paper effects, and subtle depth — while maintaining readability and accessibility.

### Implementation on Public Pages

1. **Layer system**: Each content section wraps in a `<Reveal>` component that applies a subtle collage-style shadow/offset.
2. **Torn paper edges**: Use CSS clip-path or SVG masks on section containers for a "torn paper" look on key sections (hero, featured cards).
3. **Overlapping elements**: Position decorative geometric shapes (emerald circles, vermilion lines) behind content as pseudo-elements — not actual content, purely aesthetic depth.
4. **Paper texture**: Subtle background texture (SVG data-uri) for `--bg` in both themes.
5. **Accent color as framing**: Use emerald/vermillion colored frames/borders around images and content blocks.

### Specific Collage Elements

| Location | Collage Feature |
|---|---|
| Home hero section | Overlapping geometric shapes (emerald circle, vermilion diagonal slash) behind text |
| Featured project cards | Slight rotation on alternating cards (±2deg via CSS), torn-paper clip-path |
| About page | Portrait image with emerald-colored border, torn edge on photo frame |
| Writing cards | Layered shadow effect, vermilion accent underline on hover |
| Section headers | Hand-drawn underline in vermillion, emerald dot marker |
| Journey timeline | Alternating emerald/vermillion colored nodes on orbital arc |
| Search results | Staggered card positions with depth shadows |

### Components to Create

1. **`CollageFrame`** (`src/components/CollageFrame.tsx`): A wrapper that applies torn-paper clip-path, subtle rotation, and drop shadow.
2. **`CollageShape`** (`src/components/CollageShape.tsx`): Decorative SVG shapes (circles, wedges, lines) in emerald/vermillion, positioned absolutely behind content.
3. **`CollageDivider`** (`src/components/Divider.tsx`): Hand-drawn style divider line in vermillion.
4. Update **`Reveal`** component to optionally accept `rotation` and `offset` props for collage layering.

---

## 3. File-by-File Change List

### Priority 1 — Core Tokens (Color Foundation)

| # | File | Changes |
|---|---|---|
| 1 | `src/styles/tokens.css` | Replace all light/dark theme `:root` color variables with the new palette. Ensure WCAG 4.5:1 contrast for text on backgrounds. |
| 2 | `tailwind.config.ts` | Replace all 60+ color tokens with new palette values. Map `primary`→emerald, `accent-amber`→emerald, `accent-ochre`→vermillion, `background`→warm ivory, `ink-*`→green-tinted grays. |

### Priority 2 — Admin Theme (Authentication & Admin UI)

| # | File | Changes |
|---|---|---|
| 3 | `src/styles/admin-atelier.css` | Replace hardcoded hex colors (`#b3743b`, `#9c602a`, `#f6f5f0`, `#d8d7d0`, `#c9c3b4`, `#7c848b`, `#495057`, `#965a26`, etc.) with new palette. Scrollbar thumb → emerald. Focus rings → emerald. |
| 4 | `src/app/(auth)/layout.tsx` | Replace body gradient (`from-[#0b1013] via-[#12181c] to-[#080c0e]`) with deep forest green gradient. Replace `text-[#a2abb2]` with `--muted`. |
| 5 | `src/app/(auth)/login/page.tsx` | Replace ALL hardcoded hex colors (~20 instances of `#d49a68`, `#b3743b`, `#a2abb2`, `#7c848b`, `#965a26`, `#495057`, `#e3ded3`, `#faf9f5`, `#171a1c`, `#0e1417`, `#0b1013`, `#12181c`, `#080c0e`, `#2b343b`). Use CSS variables where possible; replace icon accent colors with emerald/vermillion. |

### Priority 3 — Components (Using CSS Variables)

| # | File | Changes |
|---|---|---|
| 6 | `src/components/SampleContentBadge.tsx` | Replace hardcoded `#17191a`/`#f1ece2` with `--text`/`--bg` or new palette. Add collage-style border. |
| 7 | `src/components/Reveal.tsx` | Optional: Add `rotation`/`offset` props for collage layering. Keep existing animation. |
| 8 | `src/components/theme-provider.tsx` | No color changes needed — already uses `data-theme` attribute. |

### Priority 4 — New Collage Components (Collage Art)

| # | File | Description |
|---|---|---|
| 9 | `src/components/CollageFrame.tsx` (new) | Wrapper component with torn-paper clip-path, optional rotation, drop shadow. |
| 10 | `src/components/CollageShape.tsx` (new) | Decorative SVG shapes (circle, wedge, diagonal line) in emerald/vermillion, absolute-positioned behind content. |

### Priority 5 — Public Frontend Pages (Collage Art Integration)

| # | File | Collage Changes |
|---|---|---|
| 11 | `src/app/(frontend)/page.tsx` | Wrap hero in collage frame. Add emerald circle + vermilion slash behind text. Apply rotating effect on featured project cards. Update journey timeline to use emerald/vermillion colored nodes. |
| 12 | `src/app/(frontend)/about/page.tsx` | Add torn-paper border to portrait. Replace any hex colors (none currently present — uses CSS vars). |
| 13 | `src/components/FeaturedProjectCard.tsx` | Add collage frame wrapper, subtle rotation on alternating cards, vermillion accent underline. |
| 14 | `src/app/(frontend)/writing/page.tsx` | Add staggered collage-style offsets to post cards. |
| 15 | `src/app/(frontend)/writing/[slug]/page.tsx` | Add vermillion hand-drawn underline to section headers. |
| 16 | `src/app/(frontend)/projects/page.tsx` | Add collage-style cards with torn-paper edges. |
| 17 | `src/app/(frontend)/projects/[slug]/page.tsx` | Same collage treatment for project detail. |
| 18 | `src/app/(frontend)/search/page.tsx` | Staggered collage results. |

### Priority 6 — Admin Components (Color Alignment)

| # | File | Changes |
|---|---|---|
| 19 | `src/components/admin/PostEditor.tsx` | Replace `amber-wash`, `bg-primary`, `bg-rose-50`, `bg-emerald-50`, `bg-emerald-600` Tailwind classes with new palette. Replace `text-primary` with `text-emerald`. |
| 20 | `src/components/admin/ProjectEditor.tsx` | Same — replace amber/emerald color classes with new palette. |
| 21 | `src/components/admin/MediaManager.tsx` | Replace `text-primary` accent colors with emerald. |
| 22 | `src/components/admin/ProfileEditor.tsx` | Replace `amber-wash`, `text-primary` classes. |
| 23 | `src/components/admin/AdminHeader.tsx` | Replace `bg-primary`, `text-primary`, `bg-emerald-500`, `text-ink-muted`, `text-on-surface` with new Tailwind tokens. |
| 24 | `src/components/admin/AdminSidebar.tsx` | Replace `text-primary`, `bg-primary`, `bg-emerald-600`, `bg-amber-wash`, `text-ink-muted`, `text-on-surface`. |
| 25 | `src/components/admin/AdminFooter.tsx` | Replace `bg-emerald-600`, `text-ink-muted`, `text-ink-secondary`, `text-primary`. |
| 26 | `src/app/(admin)/admin/page.tsx` | Replace `bg-emerald-500`, `bg-amber-wash`, `text-primary`, `text-ink-muted`, `text-ink-secondary`, `text-on-surface`, `bg-rose-50`, `border-primary/30`, `bg-surface-container-low/highest`. |

### Priority 7 — Remaining Admin Components

| # | File | Changes |
|---|---|---|
| 27 | `src/components/admin/SiteSettingsEditor.tsx` | Replace any color classes with new tokens. |
| 28 | `src/components/admin/CurrentStateEditor.tsx` | Replace any color classes. |
| 29 | `src/components/admin/JourneyEditor.tsx` | Replace color classes. |
| 30 | `src/components/admin/TopicsManager.tsx` | Replace color classes. |
| 31 | `src/components/admin/RichContentEditor.tsx` | Check for hardcoded colors. |
| 32 | `src/components/admin/SidebarNavLink.tsx` | Check. |

### Priority 8 — Remaining Public Components

| # | File | Changes |
|---|---|---|
| 33 | `src/components/RichTextRenderer.tsx` | Replace any hardcoded color classes. |
| 34 | `src/components/RelatedContent.tsx` | Replace color classes. |
| 35 | `src/components/ProjectImage.tsx` | Replace color classes. |
| 36 | `src/components/FeaturedProjectCard.tsx` | Collage + color treatment. |
| 37 | `src/components/SearchModal.tsx` | Replace color classes. |
| 38 | `src/components/EditorialLink.tsx` | Replace color classes. |
| 39 | `src/components/Divider.tsx` | Collage-style divider. |

### Priority 9 — Style Guide Page

| # | File | Changes |
|---|---|---|
| 40 | `src/app/(frontend)/style-guide/page.tsx` | Update to reflect new palette, show emerald/vermillion/ivory examples. |

---

## 4. Collage Art Technical Implementation

### CollageFrame Component
```tsx
// src/components/CollageFrame.tsx
interface CollageFrameProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;    // degrees, default 0
  offset?: string;      // e.g. "translate-y-1", default "0"
  tornEdge?: boolean;   // default false
  shadow?: 'sm' | 'md' | 'lg';
}
```
- Applies CSS transform for rotation
- Applies `clip-path` for torn edge (SVG polygon or CSS `polygon()`)
- Applies Tailwind shadow utilities
- Adds `relative z-10` for stacking context

### Torn Paper Clip-Path
CSS for a torn paper edge:
```css
.torn-edge {
  clip-path: polygon(
    0% 0%, 100% 0%, 100% 100%,
    95% 98%, 90% 100%, 85% 98%,
    80% 100%, 75% 98%, 70% 100%,
    65% 98%, 60% 100%, 55% 98%,
    50% 100%, 45% 98%, 40% 100%,
    35% 98%, 30% 100%, 25% 98%,
    20% 100%, 15% 98%, 10% 100%,
    5% 98%, 0% 100%
  );
}
```

### Paper Texture
Subtle SVG data URI applied as `background-image` on `--bg`:
```css
--bg-texture: url("data:image/svg+xml,...");
background-image: var(--bg-texture);
background-repeat: repeat;
```

---

## 5. Validation & Testing

1. **Contrast testing**: All text on background/surface must pass WCAG AA (4.5:1). Verify with automated tool.
2. **Theme toggle**: Switch between light/dark — all components should adapt.
3. **Visual regression**: Compare key pages before/after.
4. **Admin functionality**: Login, create post, upload media — all still work with new colors.
5. **No hardcoded hex colors remain**: Grep for `#[0-9a-fA-F]{6}` in components.

---

## 6. Rollout Order

1. **Step 1**: Update `tokens.css` + `tailwind.config.ts` — the foundation.
2. **Step 2**: Update `admin-atelier.css` + auth pages (login, auth layout).
3. **Step 3**: Create collage components (`CollageFrame`, `CollageShape`, update `Divider`).
4. **Step 4**: Apply collage to public pages (home, about, writing, projects, search).
5. **Step 5**: Update admin components + dashboard.
6. **Step 6**: Update style guide page.
7. **Step 7**: Grep for remaining hardcoded colors, fix leftovers.
8. **Step 8**: Run lint + typecheck, verify no errors.

---

## 7. Design Decision Notes

- **Admin dashboard**: Uses Tailwind `light` theme classes (`bg-paper-base`, `text-on-surface`, etc.). These tokens are defined in `tailwind.config.ts`. Must update all Tailwind color tokens, not just CSS vars.
- **Login page**: Uses heavily hardcoded hex colors in JSX. Must replace each with CSS variable or new palette value.
- **Admin layout**: Uses `className="light"` forcing light mode on `<html>`. Dark variant of admin tokens should still be defined for completeness.
- **Public frontend**: Uses CSS variables (`var(--bg)`, `var(--text)`, etc.) from `tokens.css`. The primary change is in `tokens.css`.

## 8. Open Questions

1. Should collage art be applied to admin pages, or only public-facing pages?  
   **Recommendation**: Public pages only — admin should remain clean and utilitarian.

2. Should the login page retain its "cosmic/observatory" theme, or should it also adopt the collage aesthetic?  
   **Recommendation**: Retain the cinematic observatory aesthetic but update all colors to the new palette.

3. What's the approach for the paper texture — subtle SVG pattern or CSS gradient?  
   **Recommendation**: Subtle SVG data-URI pattern (low opacity) for authenticity.

4. Should collage rotations be disabled under `prefers-reduced-motion`?  
   **Recommendation**: Yes — respect the existing `useReducedMotion` hook.