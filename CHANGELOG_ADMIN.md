# ZeroAbstraction Admin Dashboard Changelog

Tracking all presentation and functional improvements to the Payload Atelier Admin Dashboard (`src/app/(admin)`, `src/components/admin`, `src/styles/admin-atelier.css`).

---

## Milestone 1: Shell, Command Palette, Mobile Drawer & Theme Architecture (#1 – #16)

1. **Live Command Palette (`⌘K` / `Ctrl+K`)**: Replaced the read-only header search input with an interactive native `<dialog>` command palette (`AdminCommandPalette`) supporting live search across Posts, Projects, Topics, Routes, and Quick Actions.
2. **Database-Hydrated Search Index**: Hydrated `AdminLayout` with live records from Payload (`posts`, `projects`, `topics`) so `⌘K` searches real database entries.
3. **Global Keyboard Shortcuts & Chord Navigation**: Added `⌘K` / `Ctrl+K` (Command Palette), `?` (Shortcuts Cheatsheet), and `G` chord navigation (`G D` Dashboard, `G P` Posts, `G R` Projects, `G M` Media, `G T` Topics, `G S` Current State, `G J` Journey).
4. **Mobile Navigation Drawer**: Added a responsive mobile menu trigger in `AdminHeader` (`md:hidden`) opening a native modal `<dialog>` navigation drawer (`AdminMobileDrawer`) with live collection counts.
5. **Interactive Notification Center**: Wired the header bell button to an Observatory Queue popover listing unpublished draft manuscripts with one-click navigation and "Mark read" state.
6. **Quick Create Dropdown (`+ New Entry`)**: Upgraded the `+ New Entry` CTA into an interactive dropdown menu for instant creation of Posts, Projects, Media uploads, or Telemetry updates.
7. **Live "View Site" External Pill**: Added a direct `View Site ↗` action in `AdminHeader` to open the public frontend in a new tab.
8. **Color-Scheme Meta Sync & Cross-Tab Theme Persistence**: Synced theme toggling with `<meta name="color-scheme">`, CSS `:has(> head > meta[name="color-scheme"])`, and `window` `storage` events across tabs.
9. **Dynamic Header Breadcrumb**: Added route-aware breadcrumb labels in `AdminHeader` via `usePathname()`.
10. **Collapsible Sidebar Rail Mode**: Added a collapse/expand toggle on `AdminSidebarClient` (`w-60` ↔ `w-16` icon rail) persisted in `localStorage`.
11. **Grouped Sidebar Navigation**: Organized sidebar links into clear `COLLECTIONS`, `TELEMETRY & GLOBALS`, and `SYSTEM` sections with tooltips when collapsed.
12. **Sidebar Active State & Hover Polish**: Refined active left-border indicator and badge contrast for both light and dark modes.
13. **Live Node Telemetry Card in Sidebar**: Replaced the static `w-3/4` bar in the sidebar footer with real published vs. draft ratio progress bar and counts.
14. **Live UTC Clock & Online Status in `AdminFooter`**: Upgraded `AdminFooter` with a live ticking UTC clock, `navigator.onLine` status dot, and clickable `?` shortcuts trigger.
15. **Accessible Toast Notification System**: Created `AdminToastProvider` (`aria-live="polite"`) for non-blocking feedback across admin actions.
16. **Native Dialog & Table CSS Foundations**: Added `dialog:modal` / `dialog::backdrop` `overscroll-behavior: contain`, `AdminDialog` light-dismiss fallback, and sticky `.admin-table-region` rules in `admin-atelier.css`.

---

## Milestone 2: Observatory Overview Dashboard (`/admin`) Presentation & Data Viz (#17 – #34)

17. **Time-of-Day Dynamic Greeting**: Replaced static greeting with live morning/afternoon/evening greeting personalized from the authenticated user's session.
18. **Live Astronomical Epoch & Julian Date Chip**: Upgraded the epoch chip with an animated status pulse, calculated Julian Date (`JD`), and journey milestone count.
19. **Quick Actions Dock**: Added a 4-button quick-launch bar (`Write Treatise`, `Log Engineering Rig`, `Upload Plate`, `Update Telemetry`) at the top of the overview.
20. **Accurate 5-Card KPI Metric Strip**: Fixed draft/published counts using real `payload.count` queries and added a 5th Taxonomy card.
21. **Inline SVG Micro-Sparklines**: Added crisp SVG trend sparklines and draft percentage badges to KPI cards.
22. **Clickable KPI Cards**: Wired every KPI card to navigate directly to its collection or filtered view.
23. **Unified Multi-Collection Activity Feed**: Merged real recent updates across Posts, Projects, and Media sorted by `updatedAt` descending (replacing static cycling placeholder labels).
24. **Interactive Activity Filter Tabs**: Added `All`, `Posts`, `Projects`, and `Media` filter tabs on the Recent Activity feed.
25. **Archive Composition Stacked Bar**: Added a live Published / Drafts / Archived stacked progress bar visualization.
26. **Taxonomy Distribution Bar Chart**: Added horizontal topic-by-treatise-count bars driven by live post-topic relationships.
27. **Recent Media Plates Strip**: Added a 4-column visual thumbnail strip of the latest uploaded media assets with file size metadata.
28. **Archive Readiness SVG Progress Ring**: Added an SVG circular progress ring scoring excerpt, SEO description, and cover image completeness.
29. **Actionable Metadata Health Audit**: Listed specific counts of posts missing excerpts, SEO descriptions, or cover plates with direct links to fix.
30. **Enhanced Latest Manuscript Card**: Surfaced real post status badge, reading time, updated date, and Editor/Preview actions.
31. **Field Telemetry JSON Copy & Visibility Badge**: Added one-click `JSON` copy (with toast feedback) and `LIVE`/`HIDDEN` visibility indicator to Field Telemetry.
32. **Observatory Field Scratchpad Widget**: Added a `localStorage`-persisted scratchpad card with character counter, clear action, and "Start Draft Post" link.
33. **API & DB Diagnostics Ping**: Added an interactive `Run Ping` button calling `/api/health` with live round-trip latency readout.
34. **Dark Mode Badge Contrast Fix**: Replaced harsh light-mode `bg-emerald-50` / `bg-white` classes on dashboard cards and badges with theme-aware semantic tokens.

