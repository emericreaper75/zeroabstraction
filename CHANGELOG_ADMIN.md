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

---

## Milestone 3: Collection Views & Data Tables Polish (#35 – #50)

35. **Posts Table — Server-Side Status Filtering**: Fixed `posts/page.tsx` so `?status=published`, `?status=draft`, and `?status=archived` filter the Payload query (`where: { status: { equals } }`).
36. **Posts Table — Live Search & Sortable Columns**: Added real-time client search (title, slug, topic) and `aria-sort` sortable headers (`Title`, `Status`, `Updated`).
37. **Posts Table — Status-Preserving Pagination**: Updated pagination links to preserve active `?status=` filters.
38. **Posts Table — Bulk Selection & Floating Action Bar**: Wired row checkboxes and Select All to a floating Bulk Action Bar (`Publish Selected`, `Move to Draft`, `Export Selected`, `Clear`) backed by `bulkUpdatePostStatusAction`.
39. **Posts Table — JSON Manifest Export**: Wired the `Manifest` button to download `zeroabstraction-posts-YYYY-MM-DD.json`.
40. **Posts Table — One-Click Copy Slug & Topic Array Fix**: Added copy `/writing/<slug>` button with toast feedback and fixed topic chip rendering for `post.topics`.
41. **Posts Table — Accessible Scroll Region & Sticky Header**: Applied `tabIndex={0}`, `role="region"`, `aria-labelledby`, and sticky `thead` via `.admin-table-region`.
42. **Projects Table — Live Search, Status Tabs & Sortable Columns**: Upgraded `projects/page.tsx` with `ProjectsTableClient` supporting search, status filtering (`All`, `In Progress`, `Completed`, `Archived`), and sorting (`Title`, `Status`, `Year`).
43. **Projects Table — Manifest Export, Copy Slug & Link Count**: Added JSON manifest export, copy `/projects/<slug>`, featured star badge, and external link count.
44. **Topics Manager — Instant Filter & Type Tabs**: Added real-time topic search and dynamic type filter pills (`All`, `Astrophysics`, etc.).
45. **Topics Manager — Accessible Delete `<dialog>`**: Replaced `window.confirm` with `AdminDialog` (`autoFocus` on Cancel) and toast notifications.
46. **Media Manager — Grid / List View Toggle & Search**: Added Grid vs. List view switcher and live filtering by filename, alt text, or MIME type.
47. **Media Manager — Lightbox Plate Inspector & Copy URL**: Added an interactive `<dialog>` plate inspector showing full preview, alt text, MIME/size metadata, and one-click URL copy.
48. **Media Manager — Native `<dialog>` Upload & Delete Modals**: Converted upload and delete flows to `AdminDialog` with dark-mode-safe feedback banners.
49. **Users & Access Page — Dark Mode Contrast Polish**: Replaced `bg-white` and light-mode-only emerald/amber text classes with theme-aware surface and semantic colors.
50. **Styled Empty States**: Added consistent Observatory empty states with clear-filter actions across collection tables.

---

## Milestone 4: Editors, Globals & Final Verification (#51 – #60)

51. **PostEditor — `⌘S` / `Ctrl+S` Save Shortcut**: Added global keyboard save handler in `PostEditor` with toast feedback.
52. **PostEditor — Live Word Count & Reading Time Telemetry**: Computed live word count and estimated reading time (`200 wpm`) in Document Telemetry.
53. **PostEditor — Live SERP SEO Preview & Character Counters**: Added `60`-char title and `160`-char description counters plus a live search snippet preview card.
54. **PostEditor — Native `<dialog>` Delete Confirmation**: Replaced `window.confirm` with `AdminDialog` (`autoFocus` on Cancel).
55. **ProjectEditor — `⌘S` / `Ctrl+S` Save Shortcut**: Added keyboard save shortcut and toast feedback.
56. **ProjectEditor — Native `<dialog>` Delete Confirmation**: Replaced `window.confirm` with `AdminDialog` (`autoFocus` on Cancel).
57. **CurrentStateEditor — Live "Right Now" Homepage Preview**: Added a 4-column live preview card showing how Studying, Building, Reading, and Contemplating render on the public site.
58. **CurrentStateEditor — `⌘S` Save Shortcut & Toast Feedback**: Added keyboard save shortcut and non-blocking toast notifications.
59. **Accessibility & Top-Layer Compliance**: Verified native `<dialog>` usage (`showModal()`, `closedby="any"` + fallback, `overscroll-behavior: contain`), `aria-sort` table headers, and `aria-label` coverage on icon-only controls.
60. **Full TypeScript, ESLint & Production Build Verification**: Verified all 4 milestones pass `npx tsc --noEmit` and `npm run lint` with 0 errors.

---

## Milestone 5: Icon-First & Visual Priority Refinement (#61 – #68)

61. **Streamlined Header Chrome**: Replaced verbose breadcrumb prefixes, version tags, and `"ADMIN // CHIEF OBSERVER"` text with clean icon triggers (`open_in_new`, `search`, `add`) and compact route pill.
62. **Minimalist Sidebar & Footer Telemetry**: Trimmed redundant section headings and verbose footer text in favor of crisp icons (`auto_awesome`, `database`, `keyboard`) and live status indicators.
63. **Highlighted Priority KPIs**: Elevated the **Draft Queue** card (`PRIORITY` badge + accent border) and **Posts** card above secondary collections.
64. **Prominent Active Manuscript Resume Card**: Highlighted the latest manuscript with a dedicated accent border, reading-time icon, and one-click `Resume` CTA.
65. **Icon-Driven Recent Activity**: Replaced multi-line text badges and subtitles with clean collection icons (`article`, `qr_code_2`, `image`) and icon-tab filters.
66. **Icon-Labeled Field Telemetry ("Right Now")**: Replaced all-caps `STUDYING:` / `BUILDING:` / `READING:` / `THINKING:` labels with intuitive icons and compact edit/copy-JSON icon buttons.
67. **Compact Readiness, Notes & Health Widgets**: Reduced explanatory prose to scannable icons, ring progress, and compact action pills.
68. **Clean Collection Headers**: Replaced verbose `OBSERVATORY / COLLECTIONS / ...` text breadcrumbs with a home-icon breadcrumb and concise total pills across Posts, Projects, and Media.

---

## Milestone 6: Calm Neutral Palette & Simple Sans Typography (#69 – #70)

69. **Neutral Zinc/Slate Palette**: Replaced heavy electric-indigo/violet/vermillion tokens in `admin-atelier.css` with a calm neutral Zinc palette (`#FAFAFA`/`#FFFFFF` light, `#09090B`/`#111113` dark) and understated blue accent (`#2563EB`/`#60A5FA`).
70. **Simple Sans Text Style (Same Sizes)**: Applied `.admin-simple-text` in `admin-atelier.css` and `(admin)/layout.tsx` to normalize all serif/monospace/italic/heavy-tracked headings and labels to clean `IBM Plex Sans` (`font-weight <= 500`, `font-style: normal`) while keeping all font sizes unchanged.

---

## Milestone 7: Panze Studio 3-Column Single-Canvas Refactor (#71 – #75)

71. **Slate-Mist Canvas & Borderless Tonal Cards**: Updated `admin-atelier.css` and `(admin)/layout.tsx` to `#F1F5F9` canvas with borderless `#FFFFFF` `rounded-[20px]` cards, uniform `24px` padding, and `20px` grid gaps.
72. **Panze Studio Typography (`Plus Jakarta Sans` + `Inter` + `JetBrains Mono`)**: Loaded `Plus Jakarta Sans`, `Inter`, and `JetBrains Mono` in `(admin)/layout.tsx` for upright headings, clean body labels, and `tabular-nums` telemetry.
73. **Floating Left Icon Rail & Pill Top Bar**: Refactored `AdminSidebarClient.tsx` into a transparent left icon rail with solid `#0F172A` active circle, and `AdminHeader.tsx` with `OBSERVATORY OVERVIEW` pill, rounded search input, compose, bell, gear, theme toggle, and `Admin` avatar pill.
74. **3-Column Studio Grid (`25% / 50% / 25%`)**: Rebuilt `DashboardOverviewClient.tsx` with Left Focus & Readiness card (Active Manuscript, Readiness ring/checklist, Apricot-wash On Going Tasks), Center Operations & Activity (Thick-stroke Donut chart, 2-col metric grid, Recent Activity rows), and Right Plates/Notes/System Health column.
75. **Interactive Filter Pills & Persistent Tasks**: Wired the `Drafts` / `Published` / `Archived` / `Reports` pill switcher, `localStorage`-persisted On Going Tasks checkboxes, Quick Field Notes, and live `/api/health` Ping.

---

## Milestone 8: Panze Studio Sub-Page Harmonization & Interactive Tasks (#76 – #79)

76. **Interactive Task Creation & Removal**: Added inline `+ Add task...` form and hover delete action inside the `On Going Tasks` inset card (`localStorage`-persisted).
77. **Seamless Canvas Footer**: Blended `AdminFooter.tsx` into the `#F1F5F9` canvas with `backdrop-blur-sm` and `JetBrains Mono` telemetry.
78. **Harmonized Collection Tables**: Updated `PostsTableClient.tsx` and `ProjectsTableClient.tsx` to borderless `#FFFFFF` `rounded-[20px]` cards, `rounded-full` filter/action pills, and `#F1F5F9` row hairlines.
79. **Harmonized Media & Topics Managers**: Updated `MediaManager.tsx` and `TopicsManager.tsx` to Panze Studio `rounded-[20px]` cards and `rounded-full` controls.
80. **Purpose-Built Logos & Semantic Icons**: Replaced generic square/QR/hub icons with a custom SVG ZeroAbstraction Observatory orbital brand mark, observatory-radar greeting emblem, `rocket_launch` for Projects & Rigs, `article` for Posts, `sell` for Topics, `add_photo_alternate` for Plate uploads, and `admin_panel_settings` for Users & Access.
81. **Media File Renaming (Upload & Existing)**: Added custom filename input during upload in `MediaManager.tsx` and `renameMediaAction` in `media/actions.ts` with a Rename `<AdminDialog>` accessible from Grid cards, List rows, and the Plate Inspector.

---

## Milestone 9: Global Admin Panel Panze Studio Unification (#82 – #87)

82. **Global Form & Card Primitives**: Added `.panze-card` (`#FFFFFF`, `20px` radius, `24px` padding, zero border/shadow) and borderless `#F8FAFC` `12px`-radius input focus rules in `admin-atelier.css`.
83. **Streamlined RichContentEditor Toolbar**: Collapsed `H1`–`H6` buttons into a single `Heading ▾` dropdown, converted `Write | Preview | Split` to a pill toggle, and styled the editor frame with borderless `#F8FAFC` elevation.
84. **New Rig / Project Editor (`70% / 30%`)**: Refactored `ProjectEditor.tsx` with `OBSERVATORY / RIGS / NEW RIG` naming, sticky `Create Rig` + `Save Draft` pills, compact title + inline `/rigs/...` slug row, unified right inspector card with `1px solid #F1F5F9` dividers, interactive `JetBrains Mono` tech chips, `Featured` pill switch, and visual **Plate Picker** dialog.
85. **Unified Post Editor (`70% / 30%`)**: Refactored `PostEditor.tsx` into a `rounded-[20px]` left editor card and a unified right inspector card with pill taxonomy chips, `Featured` switch, and live SERP preview.
86. **Unified Global Editors (`CurrentState`, `Profile`, `SiteSettings`)**: Updated all global configuration screens to borderless `#FFFFFF` `rounded-[20px]` cards, `#F8FAFC` inputs, and `rounded-full` action pills.
87. **Unified Users & Access Page**: Updated `users/page.tsx` to borderless `#FFFFFF` `rounded-[20px]` cards with `#F1F5F9` row hairlines and pill status badges.

---

## Milestone 10: Minimalistic Sub-Pages Pass (#88 – #90)

88. **Minimal Global & Collection Headers**: Removed redundant breadcrumbs, heavy section numbers, and extra telemetry banners across `SiteSettingsEditor`, `CurrentStateEditor`, `ProfileEditor`, `JourneyEditor`, `MediaManager`, `PostEditor`, and `ProjectEditor`.
89. **Single-Card Global Settings & Timeline**: Consolidated `SiteSettingsEditor` into one clean `#FFFFFF` `rounded-[20px]` card with `1px solid #F1F5F9` dividers, and streamlined `JourneyEditor` into minimal timeline rows.
90. **Single-Card Projects & Posts Index**: Merged search and status filter pills directly into the `ProjectsTableClient` table card for a lighter, uncluttered index view.

---

## Milestone 11: Final UI Polish & Observatory Bug Fixes (#91 – #96)

91. **Clean Bottom Canvas Edge**: Removed the fixed `AdminFooter` status bar from `(admin)/layout.tsx` and removed duplicate `@import url(...)` font imports in `admin-atelier.css`.
92. **Composition Donut Segments & Item Counts**: Updated the `Overview & Content Composition` SVG donut with distinct `#0F172A` / `#2563EB` / `#CBD5E1` segments separated by `3px` gaps, and replaced dual `100%` labels with actual item counts (`1 post`, `1 rig`).
93. **Emerald Readiness Ring & Crisp Checklist**: Changed the `100%` Readiness progress ring stroke to `#059669` and darkened checklist labels to `#475569`.
94. **Clean Plate Captions**: Stripped `.png`/image extensions and formatted Plate captions into readable Title Case with `truncate`.
95. **On Going Tasks Typo & Zero-Draft Guard**: Fixed `Verify N ingested plates` wording and hid `Finalize 0 drafts` when `draftPostsCount === 0`.
96. **Unified Rig Naming & Topics Card**: Standardized `Rigs` / `New Rig` across `AdminHeader`, `AdminSidebarClient`, and `DashboardOverviewClient`, and converted `TopicsManager`'s create card to borderless `#FFFFFF` `rounded-[20px]` styling.







