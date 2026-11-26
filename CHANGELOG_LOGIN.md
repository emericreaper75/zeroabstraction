# ZeroAbstraction Login Page Changelog

Tracking all 60 presentation, typography, and interactive UX improvements to the Observatory Sign In page (`src/app/(auth)/layout.tsx`, `src/app/(auth)/login/page.tsx`, `src/components/auth/*`, and `src/styles/admin-atelier.css`).

---

## Milestone 1: Typography Unification, Theme Architecture & Layout Foundations (#1 – #15)

1. **Panze Studio Font Stack (`(auth)/layout.tsx`)**: Loaded `Plus Jakarta Sans`, `Inter`, and `JetBrains Mono` in `src/app/(auth)/layout.tsx` to match the refined Admin Atelier typography, replacing the legacy `Newsreader`, `DM Serif Display`, and `IBM Plex Sans` fonts.
2. **`.admin-simple-text` Typography Role Alignment**: Applied `.admin-simple-text` on the auth `<body>` so headings (`Plus Jakarta Sans` 600), UI/body (`Inter`), and telemetry (`JetBrains Mono` `tabular-nums`) match the Admin Dashboard.
3. **Dual Light/Dark Theme Architecture**: Removed hardcoded dark-only attributes from `(auth)/layout.tsx` and added `<meta name="color-scheme" content="light dark" />` plus the FOUC-free `payload-admin-theme` boot script.
4. **Cross-Tab Theme Synchronization**: Added `window` `storage` event listener for `payload-admin-theme` so toggling theme in `/admin` or another tab updates `/login` live.
5. **Interactive Theme Toggle Pill**: Added a Light/Dark theme switcher button in the top utility bar of `ObservatoryHero` updating `localStorage`, `data-theme`, `className`, and `meta[name="color-scheme"]`.
6. **Semantic Panze Surface Palette**: Replaced hardcoded `#0F1117`/`#161922` colors with semantic `var(--admin-paper-base)`, `var(--admin-paper-surface)`, `var(--admin-paper-container)`, and `var(--admin-hairline-rule)` tokens.
7. **20px Rounded Panze Credential Card**: Evolved the right-pane credential card to `rounded-[20px]` with layered elevation and subtle precision registration ticks.
8. **12px Rounded Form Controls**: Updated email, password, and action inputs to `rounded-[12px]` matching `.admin-simple-text` form primitives.
9. **Responsive Split-Pane Proportions**: Refined the `58% / 42%` desktop split with `min-h-[calc(100dvh-2rem)]` viewport sizing and balanced responsive padding.
10. **Skip-to-Form Accessibility Link**: Added a keyboard-accessible `Skip to sign in form` link targeting `#login-form`.
11. **Reduced-Motion Guard**: Ensured orbital animations and error shake respect `prefers-reduced-motion: reduce` in `admin-atelier.css`.
12. **Top-Right "Public Site" Navigation Link**: Added a direct `← Public Site` link in the hero header bar returning to `/`.
13. **Refined Selection & Scrollbar Styling**: Applied `.admin-simple-text` selection colors and theme-aware scrollbar styling.
14. **Heading & Subtitle Hierarchy Rewrite**: Replaced italic serif subtitles with upright `Plus Jakarta Sans` headings (`Manoj Amavasya`, `Sign In`) and crisp `Inter` subtitles.
15. **Tabular-Nums Telemetry Alignment**: Applied `tabular-nums` to all clocks, latency readouts, and strength indicators so digits never jitter on tick.

---

## Milestone 2: Left Observatory Hero Pane — Interactive Celestial & Telemetry Showcase (#16 – #30)

16. **Interactive SVG Starfield & Constellation Canvas**: Added a zero-dependency, theme-aware SVG starfield with subtle constellation lines in `ObservatoryHero`.
17. **Orbital Astrolabe Reticle**: Added concentric SVG orbital rings (`.auth-orbit-slow`, `.auth-orbit-reverse`) in the hero background.
18. **Live Julian Date (`JD`) & Sidereal Readout**: Computed real-time Julian Date (`JD`) alongside UTC/Local clock in `JetBrains Mono` `tabular-nums`.
19. **Interactive Clock Format Toggle**: Made the bottom clock badge clickable to cycle between `UTC`, `LOCAL`, and `JD` formats.
20. **Live Node Health Ping Badge**: Added an interactive `/api/health` probe in the hero status bar displaying `Operational · XXms` on mount and click-to-reping.
21. **Interactive Observatory Optics Pills**: Upgraded the 4 static icons (`Observatory Optics`, `Cryptographic Access`, `Terminal Node`, `Spectroscopy Matrix`) into an accessible `tablist`/`tabpanel` displaying live subsystem specs.
22. **3-Column Observatory Spec Strip**: Added a 3-card spec strip (`TLS 1.3 · E2E`, `Payload v3.88`, and active spectrum mode) in the hero pane.
23. **Cyclable Observatory Field Note**: Added an interactive field-note epigraph card with a manual cycle button.
24. **Dual-Theme `.cosmic-grid` Overlay**: Updated `.cosmic-grid` in `admin-atelier.css` to adapt its grid line tint between Light Canvas and Zinc Dark themes.
25. **Hero Emblem Badge Upgrade**: Upgraded the hero emblem to a `14px`-rounded layered surface badge.
26. **Header Breadcrumb**: Added `ZeroAbstraction / Observatory` breadcrumb in the top hero bar.
27. **Responsive Hero Compact Mode**: Hid secondary decorative specs/panels on small screens so the Sign In card remains visible above the fold on mobile.
28. **Ambient Radial Spotlights**: Added subtle theme-aware radial gradient spotlights behind both panes.
29. **Keyboard Focusable Hero Controls**: Wired `focus-visible` rings and descriptive `aria-label`s on all interactive hero controls.
30. **Status Bar Footer Polish**: Upgraded the bottom status bar with live `LINK: ONLINE/OFFLINE` indicator and clickable `?` shortcuts trigger.

---

## Milestone 3: Right Credential Card — Form UX, Validation & Security Feedback (#31 – #45)

31. **Inline Email Format Validation**: Validated email format on blur/change with inline error text and `aria-invalid` / `aria-describedby`.
32. **Caps Lock Detection Warning**: Detected `getModifierState('CapsLock')` on the password field and surfaced a `CAPS LOCK ON` badge.
33. **Clear Email Quick-Action Button**: Added an inline `×` clear button inside the email input when non-empty.
34. **Enhanced Password Visibility Toggle**: Upgraded the visibility button with `aria-pressed={showPassword}` and descriptive `aria-label`.
35. **Password Key Entropy Indicator**: Added a 4-segment visual strength meter (`Weak` / `Fair` / `Good` / `Strong`) below the Access Key field while typing.
36. **Remembered Identity Persistence**: Wired `Remember identity` checkbox to `localStorage` (`za_remembered_email`) for returning observers.
37. **Smart Auto-Focus Placement**: Auto-focused the Access Key input when a remembered email is pre-filled, or the email input otherwise.
38. **Submit Loading Spinner & State**: Added an animated SVG spinner and `Verifying Credentials...` state with `aria-busy={isLoading}`.
39. **Success Transition State**: Added an emerald `Access Granted — Entering Atelier...` confirmation state before redirecting to `/admin`.
40. **Shake-on-Error Micro-Animation**: Added `.auth-shake` animation on the credential card when login fails or validation blocks submission.
41. **Dismissible Error Banner**: Upgraded the error alert with `role="alert"`, `aria-live="assertive"`, error icon, and dismiss button.
42. **Interactive Forgot Access Dialog**: Wired `Forgot access?` to a native `<dialog>` modal (`AuthDialogs`) with one-click copy of `npx payload users:reset-password`.
43. **Interactive Passkey / Hardware / CLI Dialogs**: Wired `Passkey`, `FIDO2`, and `CLI` buttons to native `<dialog>` modals, including a copyable `curl` login snippet.
44. **Global Keyboard Shortcuts**: Added `?` to open the Shortcuts & Diagnostics dialog and `Escape` to dismiss active errors or modals.
45. **Autofill & Password Manager Attributes**: Added `autoComplete="username"`, `autoComplete="current-password"`, `name="email"`, and `name="password"`.

---

## Milestone 4: Polish, Interactive Extras, Documentation & Verification (#46 – #60)

46. **Accessible Toast Notification System**: Created `LoginToast` (`aria-live="polite"`) for clipboard copy, health ping, and preference feedback.
47. **Active Session Detection**: Added a non-blocking `/api/users/me` check on mount that surfaces a `Continue →` banner if the observer is already signed in.
48. **Offline Network Guard**: Added `online`/`offline` event listeners disabling submission with a clear banner when disconnected.
49. **One-Click Node Diagnostics Copy**: Added `Copy Node Diagnostics` inside the `?` shortcuts modal.
50. **Refined Input Hover & Focus Micro-States**: Added smooth border transitions and focus rings across all inputs and buttons.
51. **Dual-Theme Contrast Alignment**: Verified semantic token usage across Light Canvas and Zinc Dark for WCAG AA legibility.
52. **Responsive Overflow Protection**: Used `overflow-x-hidden` and flexible `min-w-0` containers to prevent horizontal scroll on mobile.
53. **Modular Component Architecture**: Extracted `ObservatoryHero.tsx`, `AuthDialogs.tsx`, and `LoginToast.tsx` under `src/components/auth/`.
54. **Backward-Compatible CSS**: Scoped login additions cleanly in `src/styles/admin-atelier.css` without disrupting `/admin` pages.
55. **Updated Auth Metadata**: Refined `(auth)/layout.tsx` title and description (`Observatory Sign In // ZeroAbstraction`).
56. **Created `CHANGELOG_LOGIN.md`**: Recorded all 60 improvements across Milestones 1–4.
57. **TypeScript Typecheck**: Verified zero type errors via `npx tsc --noEmit`.
58. **ESLint Verification**: Verified lint cleanliness on all modified auth files.
59. **Production Build Verification**: Verified `npm run build` compiles cleanly.
60. **GitHub Milestone Sync**: Committed and pushed milestones to `origin/main`.

---

## Milestone 5: Minimalist Hero & Full-Page Unified Background Animation

61. **Reduced Left Hero Copy**: Removed the paragraph description, 3-column spec strip, interactive subsystem tablist/panel, and field-note epigraph from `ObservatoryHero` for an airy, distraction-free left pane (`ZeroAbstraction`, `Observatory Console`, `Manoj Amavasya`, `Astronomical Atelier`).
62. **Full-Page Unified Animated Backdrop (`ObservatoryBackdrop`)**: Moved the cosmic grid, twinkling starfield, constellation lines, drifting ambient aurora orbs (`.auth-drift-a`, `.auth-drift-b`), and centered concentric orbital rings (`auth-orbit-slow`, `auth-orbit-reverse`) into a fixed full-viewport layer spanning the entire webpage seamlessly.
63. **Translucent Glassmorphic Auth Card & Footer**: Updated the right credential card and bottom status bar to use translucent surfaces (`backdrop-blur-md` / `backdrop-blur-sm`) so the full-page animation flows cleanly behind every element.

