# Phase 0 Inventory

## Color literals

All current `#RRGGBB` and `rgb()`/`rgba()` literals under `src/` are:

- `src/styles/tokens.css` — existing legacy token definitions, including warm/green/vermillion literals and torn-edge texture data.
- `src/styles/admin-atelier.css` — legacy green, brown, white, and rgba literals for scrollbars, login grids, checkboxes, focus, and sidebar active state.
- `src/app/(auth)/login/page.tsx` — extensive Tailwind arbitrary green, charcoal, ivory, and vermillion literals.
- `src/app/(auth)/layout.tsx` — background and text hex literals.
- `src/app/globals.css` — green grid rgba and white pseudo-element border.
- `src/app/(admin)/admin/page.tsx` — Tailwind emerald/amber/red/purple/sky shadow rgba and dot classes.

The public and admin also consume named Tailwind colors in some components, including `emerald-*`, `amber-*`, and `sky-*`; these are migration candidates and do not preserve refinement-pack values.

## Theme wiring before first paint

- `src/components/ThemeScript.tsx` defines an inline script that reads `localStorage.theme`, checks `prefers-color-scheme: dark`, sets `data-theme="light|dark"` on `<html>`, and sets `colorScheme`.
- `src/app/(frontend)/layout.tsx` renders `ThemeScript` inside `<head>` and wraps the public app in `ThemeProvider`.
- `src/components/theme-provider.tsx` owns runtime theme state and writes `data-theme` to `<html>`.
- Existing tokens also contain both OS-media and explicit `[data-theme]` branches. The admin layout has `<html className="light">` and does not yet share the public no-flash/theme wiring.

## Public header and navigation

- Shared public nav component: `src/components/Header.tsx`.
- It is rendered by `src/app/(frontend)/layout.tsx` above every public route.
- Current content: wordmark "Zero Abstraction", nav links from Site Settings (fallback Home/Writing/Projects/About), search, and theme toggle.
- Mobile uses a full-screen menu with focus trapping.
- Desktop dimensions and responsive behavior are not currently a glass/solid spec bar. No separate Home-vs-other-page surface variant exists yet.

## Right Now

- Current component is inline in `src/app/(frontend)/page.tsx`.
- It is placed immediately after the Home hero, inside the public layout.
- Fields: studying, building, reading, thinking_about.
- Current visibility rule only checks `visibility`; it can render an empty heading with no fields. It does not implement the "all fields empty" rule.
- No dedicated `RightNow` component currently exists.

## Projects listing

- Implementation: `src/app/(frontend)/projects/page.tsx`.
- Data: `getProjects(12, page)`.
- Existing controls:
  - Pagination via `?page=<number>`.
  - Newer/Older links preserve the current page value.
- Sorting: `getProjects` sorts `-year` in `src/lib/content/index.ts`.
- Filters:
  - No existing search, status, technology, year, topic, or featured controls.
  - The implementation does not read any search params except `page`.
- URL params:
  - `page` only.
- Empty state:
  - No special zero-result or filtered-no-match state in the page.
  - Pagination is omitted when `totalPages <= 1`.
- Keyboard behavior:
  - Native links only; no custom controls beyond project links and pagination.
- Conflict/constraint: 07 says to preserve every existing control. The only existing URL/listing control is `page`; no removal is needed.

## Writing listing

- Implementation: `src/app/(frontend)/writing/page.tsx`.
- Data: `getPosts(12, page)`, sorted `-published_at`.
- Existing controls:
  - Pagination via `?page=<number>`.
  - Newer/Older links.
- No existing topic filter or view switch.
- URL params:
  - `page` only.
- Zero state:
  - No explicit empty message.
- List rows are currently editorial and staggered, not a shared component; Home duplicates the writing row markup.

## Image components and cut/tilt treatments

- `src/components/CollageFrame.tsx` supports static rotation and torn-edge clipping. It is used broadly in Home, writing, project detail, project gallery, and style-guide surfaces.
- `src/components/ProjectImage.tsx` adds hover scale and wrap; no clip-path itself.
- `src/components/ScrollImage.tsx` adds image scale/vertical translation and is used for the Home current placeholder.
- `src/styles/tokens.css` defines `.torn-edge` and `.torn-edge-top-bottom` `clip-path` polygons.
- `src/app/globals.css` has legacy torn-edge pseudo-element treatment.
- `src/app/(frontend)/style-guide/page.tsx` documents torn-edge and rotation as an editorial frame example.

## Admin custom stylesheet entry points

- `src/styles/admin-atelier.css` is imported by:
  - `src/app/(admin)/layout.tsx`
  - `src/app/(auth)/layout.tsx`
- Login route: `src/app/(auth)/login/page.tsx`.
- Custom dashboard pages: `src/app/(admin)/admin/page.tsx` and collection/global routes under `src/app/(admin)/admin/`.
- The admin layout currently sets `<html className="light">`; it has no data-theme switch script.

## Payload version

- `payload`: `^3.88.0`
- `@payloadcms/db-postgres`: `^3.88.0`
- `@payloadcms/next`: `^3.88.0`
- `@payloadcms/richtext-lexical`: `^3.88.0`
- `@payloadcms/ui`: `^3.88.0`

## Optional reference prompts

- `docs/refinement/reference/shelf-hero.prompt.md` — absent
- `docs/refinement/reference/book-library.prompt.md` — absent
- `docs/refinement/reference/ai-runtime.prompt.md` — absent

