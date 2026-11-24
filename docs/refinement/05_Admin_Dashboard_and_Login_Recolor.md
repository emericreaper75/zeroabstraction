# 05 — Admin Dashboard & Login Recolor

*Owner of: Payload admin appearance (colors only) and the login page colors. Tokens from 04.*

## Decision
The current admin dashboard is accepted. **Only colors change.** No layout, copy, component, field or data changes. Admin and public site remain separate with no cross-linking.

## Platform notes
- Payload v3.x. Admin CSS is customized through the admin's custom stylesheet and Payload's CSS variables (`--theme-bg`, `--theme-text`, `--theme-elevation-*`, success/warning/error ramps).
- Payload's theme attribute is `data-theme` on `<html>`, matching 04. The admin keeps its own theme toggle; its preference is independent of the public site's.
- Overriding elevations affects dark mode, so both themes are defined (04 already does this).

## Method
1. **Inventory first** (Phase 0): list every color literal and `--theme-*` override in the admin styles, including the login page, dashboard and post editor. Record it in `reference/INVENTORY.md`.
2. Import `tokens.css` into the admin custom stylesheet.
3. Map Payload variables to tokens:
   - `--theme-bg: var(--bg)`; `--theme-text: var(--text)`.
   - `--theme-elevation-0 … --theme-elevation-1000` (steps of 50): `color-mix(in oklab, var(--n-12) calc(N / 10 * 1%), var(--n-1))`, where N is the step number (0 gives `--n-1`, 1000 gives `--n-12`). Generate these 21 lines with a small script; do not hand-pick.
   - Success/warning/error ramps: base from `--success`, `--warning`, `--danger`; lighter/darker steps by `color-mix` with `--bg` / `--n-12`.
4. Replace remaining admin color literals with semantic tokens per the migration map in 04.
5. Verify in light and dark at the dashboard, a collection list, the post editor and the login.

## Admin surfaces
| Element | Token |
|---|---|
| Sidebar background | `--sidebar-bg` |
| Sidebar text / muted text | `--sidebar-fg` / `--sidebar-fg-muted` |
| Sidebar active item | background `--sidebar-active-bg`, 2px left bar `--sidebar-accent`, text `--sidebar-fg` |
| Sidebar dividers | `--sidebar-border` |
| Main area | `--bg` |
| Panels and cards | `--bg-subtle` with 1px `--border` |
| Headings (serif italics already used) | `--text`; mono labels `--text-muted`; link-like mono actions `--accent-text` |
| Primary button | background `--accent`, text `--on-accent`; hover `--accent-hover` |
| Secondary button | transparent, 1px `--border-strong`, text `--text`; hover `--surface-hover` |
| Inputs | background `--bg`, border `--border`, focus border `--accent-text` + ring `--focus-ring` |
| Badges/status chips | `--success`, `--warning`, `--danger` text on a 12% mix with `--bg`; neutral chips use `--text-muted` on `--bg-subtle` |
| Stat figures, toggles, dots | `--accent` (dots/live indicators may use `--success`) |
| Footer status bar | `--bg-subtle`, mono `--text-muted` |

## Login page (colors only)
- Left side: replace the green gradient with a flat or very subtle `--inverse-bg` surface; text `--inverse-fg`; secondary text `--sidebar-fg-muted`; accent marks `--sidebar-accent`.
- Right panel: follows the earlier locked decision, a sharp-edged **dark charcoal panel** (`--inverse-bg`, 1px `--inverse-border`, text `--inverse-fg`). Inputs inside use inverse styling (theme-independent): background transparent, 1px `--inverse-border`, focus border `--sidebar-accent`.
- Primary "Authenticate" button: `--accent` fill, `--on-accent` label.
- The panel and both sides look the same in both themes (inverse surfaces are theme-independent).
- Keep all existing text, fields, passkey options and structure. If the page claims details such as a clock, version or "latency", leave them as they are (they are copy, not color) and flag in the report whether they show real values.

## Out of scope
Changing copy, layout, widgets, adding features, restyling Payload internals beyond color, any link between admin and the public site.

## Acceptance
- [ ] No green or red-orange accent remains in admin or login except for status meaning.
- [ ] Dashboard, collection list, post editor and login pass the contrast script in both themes.
- [ ] Toggling the admin theme changes every surface with no flash.
- [ ] No layout shift compared with the current build (screenshot comparison).
- [ ] The admin imports `tokens.css`; no color literals remain in admin styles.
