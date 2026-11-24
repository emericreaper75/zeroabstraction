# 04 — Color Tokens, Typography Scale & Dark Mode

*Single source of truth. Every other document references these tokens by name only.*

## Approach
A Radix Colors–style stepped system, built from the project's own anchors. Each theme has two 12-step scales: **neutral (`--n-1…12`)** and **bronze accent (`--a-1…12`)**. Step roles: 1 app background · 2 subtle background · 3–5 interactive/surface backgrounds · 6–8 borders · 9–10 solid fills · 11 low-contrast text · 12 high-contrast text. Components consume **semantic tokens**, never raw steps (except in 05's generated mapping).

**Anchors (fixed, from the visual design system):**
| Role | Light | Dark |
|---|---|---|
| Background | `#F3EFE7` (n-1) | `#0B1114` (n-1) |
| Text | `#17191A` (n-12) | `#F1ECE2` (n-12) |
| Muted text | `#65635E` (n-11) | `#A7A49D` (n-11) |
| Border | `#D5D0C6` (n-6) | `#2A3032` (n-6) |
| Accent | `#C88A5A` (a-9) | `#D49A68` (a-9) |

All other steps are derived proposals and may be adjusted by the contrast script; **anchors are not changed**.

**Important finding:** the light accent `#C88A5A` on `#F3EFE7` is about 2.5:1, so it must **never be used as text or as a focus ring** on light. Accent text uses `--accent-text` (a-11). Text on a solid accent fill uses `--on-accent` (charcoal), not white.

## Theme wiring
- The theme is `data-theme="light|dark"` on `<html>`, set before first paint by the existing no-flash script (OS preference detection stays). Payload's admin uses the same attribute name.
- Light values are the `:root` defaults. Dark values live only under `:root[data-theme="dark"]`.
- The toggle, persistence and OS detection already exist and are not modified.

## `src/styles/tokens.css` (create this file; imported by the public site and by the admin stylesheet)
```css
:root {
  color-scheme: light;

  /* Neutral scale — light */
  --n-1:#F3EFE7; --n-2:#EFEADF; --n-3:#E9E3D7; --n-4:#E3DDD0; --n-5:#DCD6C8; --n-6:#D5D0C6;
  --n-7:#C8C2B7; --n-8:#B1ABA0; --n-9:#8F8A82; --n-10:#7A766F; --n-11:#65635E; --n-12:#17191A;

  /* Bronze accent scale — light */
  --a-1:#F7F0E6; --a-2:#F3E8DA; --a-3:#EEDCC8; --a-4:#E8D0B5; --a-5:#E0C3A3; --a-6:#D6B391;
  --a-7:#CBA17B; --a-8:#BC8B61; --a-9:#C88A5A; --a-10:#B97C4C; --a-11:#8A5A33; --a-12:#4A2E17;

  /* Semantic */
  --bg:var(--n-1); --bg-subtle:var(--n-2);
  --surface:var(--n-3); --surface-hover:var(--n-4);
  --border:var(--n-6); --border-strong:var(--n-7);
  --text:var(--n-12); --text-muted:var(--n-11);
  --accent:var(--a-9); --accent-hover:var(--a-10); --accent-text:var(--a-11);
  --accent-subtle:var(--a-3); --accent-border:var(--a-7);
  --on-accent:#17191A;
  --focus-ring:var(--a-11);

  /* Status (status use only) */
  --success:#357050; --warning:#7D5A12; --danger:#B3412F;

  /* Code */
  --code-bg:var(--n-2); --code-keyword:var(--a-11); --code-string:var(--success);
  --code-number:var(--n-11); --code-comment:var(--n-10);

  /* Shelf / library spine tints (06, 07) */
  --spine-1:var(--a-4); --spine-2:var(--n-4); --spine-3:var(--a-6); --spine-4:var(--n-6); --spine-5:var(--a-3);
  --spine-fg:var(--n-12);
  --shade:rgba(11,17,20,.28);

  /* Glass — scrolled/compact state follows the theme */
  --glass-bg:rgba(243,239,231,.78); --glass-border:rgba(23,25,26,.10); --glass-blur:14px;

  /* Hero surface — theme-independent (always over a dark scrim) */
  --hero-scrim:linear-gradient(180deg,rgba(11,17,20,.35) 0%,rgba(11,17,20,.55) 45%,rgba(11,17,20,.88) 100%);
  --hero-fg:#F1ECE2; --hero-fg-muted:#C9C4B9; --hero-accent:#D49A68;
  --hero-glass-bg:rgba(11,17,20,.42); --hero-glass-border:rgba(241,236,226,.18); --hero-glass-blur:16px;

  /* Sidebar (admin) and inverse surfaces (login panel) */
  --sidebar-bg:#0B1114; --sidebar-fg:#F1ECE2; --sidebar-fg-muted:#A7A49D;
  --sidebar-border:#2A3032; --sidebar-active-bg:#141C1F; --sidebar-accent:#D49A68;
  --inverse-bg:#0B1114; --inverse-fg:#F1ECE2; --inverse-border:#2A3032;

  /* Typography */
  --font-display:"Cormorant Garamond","Instrument Serif",Georgia,serif;
  --font-sans:"Inter","Manrope",system-ui,-apple-system,"Segoe UI",sans-serif;
  --font-mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;

  --text-hero:clamp(3.25rem,8vw,6rem);          /* 52–96px */
  --text-h1:clamp(2.5rem,5vw,4.25rem);          /* 40–68px */
  --text-title:clamp(2.4rem,5.5vw,4.5rem);      /* 38–72px, article/project titles */
  --text-h2:clamp(1.75rem,2.6vw,2.25rem);
  --text-h3:1.5rem;
  --text-body:clamp(1.0625rem,.4vw + 1rem,1.125rem); /* 17–18px */
  --text-body-lg:1.25rem;                       /* 20px */
  --text-small:.875rem;                         /* 14px */
  --text-ui-sm:.75rem;                          /* 12px */
  --text-label:.6875rem;                        /* 11px, mono labels */
  --lh-display:1.08; --lh-heading:1.2; --lh-body:1.7; --lh-ui:1.4;
  --tracking-label:.08em;

  /* Layout */
  --measure-reading:44rem;                      /* ≈704px */
  --measure-wide:87.5rem;                       /* 1400px */
  --gutter:clamp(1.25rem,4vw,3rem);

  /* Spacing (8,12,16,24,32,48,64,96,128,160) */
  --space-1:8px; --space-2:12px; --space-3:16px; --space-4:24px; --space-5:32px;
  --space-6:48px; --space-7:64px; --space-8:96px; --space-9:128px; --space-10:160px;

  /* Shape and motion */
  --radius-s:2px; --radius-m:10px; --radius-bar:14px;
  --ease-out:cubic-bezier(.22,.61,.36,1);
  --dur-fast:150ms; --dur-base:220ms; --dur-slow:480ms;
}

:root[data-theme="dark"] {
  color-scheme: dark;

  --n-1:#0B1114; --n-2:#0F171A; --n-3:#141C1F; --n-4:#192225; --n-5:#1F292C; --n-6:#2A3032;
  --n-7:#343D40; --n-8:#465054; --n-9:#6B7377; --n-10:#868D90; --n-11:#A7A49D; --n-12:#F1ECE2;

  --a-1:#120E0B; --a-2:#1A1511; --a-3:#261C14; --a-4:#33241A; --a-5:#402E21; --a-6:#50392A;
  --a-7:#664834; --a-8:#85603F; --a-9:#D49A68; --a-10:#E0A877; --a-11:#E8B98A; --a-12:#F6DDC3;

  --on-accent:#0B1114;
  --success:#6FB58C; --warning:#D9AE55; --danger:#E27A66;

  --glass-bg:rgba(11,17,20,.72); --glass-border:rgba(241,236,226,.10);

  /* Sidebar sits one step above the dark page so it stays distinguishable */
  --sidebar-bg:#0F171A;
}

@media (prefers-reduced-motion:reduce) {
  :root { --dur-fast:0ms; --dur-base:0ms; --dur-slow:0ms; }
}
```
Notes: `--spine-*`, `--code-*`, `--bg`, etc. are semantic aliases, so they switch automatically with the scales. Everything not under the dark block is intentionally theme-independent (hero, inverse, sidebar except `--sidebar-bg`).

## Required contrast pairs (checked by `scripts/check-contrast.mjs`)
Text pairs need ≥ 4.5:1; UI and focus pairs need ≥ 3:1. The script runs both themes and exits non-zero on failure.

| Foreground | Background | Min | Hand estimate (script is authoritative) |
|---|---|---|---|
| `--text` | `--bg`, `--bg-subtle`, `--surface` | 4.5 | ≈15:1 (light), ≈15:1 (dark) |
| `--text-muted` | `--bg`, `--bg-subtle` | 4.5 | ≈5.2:1 (light), ≈7.6:1 (dark) |
| `--accent-text` | `--bg`, `--bg-subtle`, `--accent-subtle` | 4.5 | ≈5.1:1 (light) |
| `--on-accent` | `--accent` | 4.5 | ≈6.1:1 (light), ≈7.8:1 (dark) |
| `--focus-ring` | `--bg` | 3 | ≈5:1 (light) |
| `--border-strong` | `--bg` | 1.5 (decorative) | — |
| `--spine-fg` | each `--spine-1…5` | 4.5 | ≈9:1 |
| `--code-keyword/string/number/comment` | `--code-bg` | 4.5 | — |
| `--success/--warning/--danger` | `--bg` | 4.5 | — |
| `--hero-fg`, `--hero-fg-muted` | worst-case hero image under `--hero-scrim` | 4.5 | verify by screenshot (08) |
| `--sidebar-fg`, `--sidebar-fg-muted` | `--sidebar-bg` | 4.5 | — |

If a **derived** step fails, adjust that step and note it in the report. If an **anchor** fails for a use, restrict that use (as done for the accent).

## Migration map (old → new)
| Found in code | Replace with |
|---|---|
| Green/teal text, labels, links | `--accent-text` |
| Green buttons/solid fills | `--accent` fill with `--on-accent` text |
| Red-orange squiggles/underlines | removed (hairline `--border`) |
| Red-orange sample banner | `--warning` |
| Sage/green decorative circle | removed |
| Peach/off-spec backgrounds | `--bg` |
| Any hex/rgb literal | nearest semantic token |

## Typography rules
- Display serif for major titles, sans for body/UI, mono for dates, categories, section labels and technical metadata (families as above, unchanged).
- Mono labels: `--text-label`, uppercase, `letter-spacing:var(--tracking-label)`, color `--text-muted` or `--accent-text` only.
- Never use weight 700 on mono labels; 500 maximum.

## Enforcement
1. `scripts/check-contrast.mjs` (above).
2. `scripts/check-hex.sh`: fails if any `#RRGGBB` or `rgb(`/`rgba(` literal appears in `src/` outside `tokens.css`, excluding third-party CSS and SVG assets.
3. Visual check: light and dark screenshots of every touched page.

## Acceptance
- [ ] `tokens.css` exists, imported by site and admin; theme switching changes every surface without a flash.
- [ ] Contrast script and hex check pass.
- [ ] No green, red-orange, sage or peach remains outside status uses.
- [ ] Reduced-motion zeroes all token durations.
