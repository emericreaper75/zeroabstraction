# ZeroAbstraction Admin Dashboard: Google Stitch Integration Guide

## Overview

This document specifies the integration of the **Observatory Editorial Engine** design system—designed and generated via **Google Stitch** under project **"ZeroAbstraction Admin Dashboard"** (`projects/1963686508283023894`)—into the Next.js (App Router) + Payload CMS 3.x + PostgreSQL administration platform.

---

## 1. Design System Foundations: Observatory Editorial Engine

The integration adheres strictly to the confirmed design identity and tokens from the Stitch specification:

### Color System
- **Canvas Base (`#0B1114`)**: Cosmic charcoal canvas for background depth and darkroom immersion.
- **Surface Level 1 (`#0E1417`)**: Primary ground for workspace panels, collection views, and navigation rails.
- **Surface Container (`#1A2024` / `#1A2123`)**: Elevated groupings, table rows, cards, and inspector panels.
- **Hairline Borders (`#2A3032`)**: Crisp 1px architectural lines defining columns, tables, and split views.
- **Bronze Accent (`#D49A68` / `#C88A5A`)**: Brass astrolabe gold for focus rings, status indicators, and primary action triggers.
- **Editorial Ink (`#F1ECE2` / `#17191A`)**: Warm archival white (dark mode) / deep charcoal (light mode).
- **Secondary Ink (`#A7A49D` / `#65635E`)**: Slated gray for labels, telemetry metrics, and observational parameters.

### Typography
- **Editorial Display**: `Newsreader` (Italic serif) for monograph titles, collections, and archive headers.
- **System Interface**: `IBM Plex Sans` for manuscript drafting, form fields, and administrative labels.
- **Astrophysical Telemetry & Metrics**: `JetBrains Mono` for UTC clocks, celestial coordinates (RA/Dec), epoch tags, and tabular data.

### Geometry & Interaction
- **0px Sharp Radius**: Enforces razor-sharp corners across all buttons, inputs, chips, cards, and modal drawers.
- **WCAG AA Compliance**: High-contrast ratios preserved in both dark and light modes.
- **Reduced Motion**: Complete usability without motion under `@media (prefers-reduced-motion: reduce)`.

---

## 2. Screen Integration Mapping (All 10 Core Screens)

| Screen | Stitch Source Reference | Integration Point in Payload CMS | Rationale & Modifications |
| :--- | :--- | :--- | :--- |
| **1. Dashboard** | `8f361b07...` / `2e228adb...` | `admin.components.views.dashboard` (`DashboardView.tsx`) | Full editorial workbench with 30-day activity matrix, telemetry tiles, quick-create cluster, and live current state monitor. |
| **2. Posts** | `08dffa52...` (List), `f44784f8...` (Edit), `a78e2a58...` (Preview) | `collections/Posts.ts` (`beforeList`, `afterList`), `InAdminPreview.tsx` | Active astrophotography plate reference (`RA 48m 6s, -41° 18' 4"`), status filter pills, read-time calculator, and 50:50 live preview. |
| **3. Projects** | `15fc25e7...` (List), `da244b48...` (Edit) | `collections/Projects.ts` (`beforeList`, `afterList`) | Active engineering rigs monitor (DSP/FPGA/Keck pipeline), technology badges, and featured toggle. |
| **4. Topics** | `db40b0b8...`, `f5e90572...` | `collections/Topics.ts` (`beforeList`, `afterList`) | Disciplinary domain taxonomy (Astrophysics, Physics, ECE, Programming, Photography, Other) with linked post/project counts. |
| **5. Media** | `71abc56d...` | `collections/Media.ts` (`beforeList`, `afterList`) | Storage cluster status (4.82 GB indexed, S3 EU-Central-1), FITS/spectrogram/monograph breakdown, and Sharp auto-processor. |
| **6. Current State** | `ba608222...` | `globals/CurrentState.ts` (`beforeDocumentControls`) | Real-time broadcast monitor with live pulse beacon, UTC clock, and studying/building/reading telemetry cards. |
| **7. Profile** | `951dc559...` | `globals/Profile.ts` (`beforeDocumentControls`) | Editorial biography manuscript editor with portrait plate and authentic voice guidelines. |
| **8. Journey** | `6d81fa49...` | `collections/Journey.ts` (`beforeList`), `/admin/journey-trajectory` | Chronological trajectory engine with monotonic sequence controls (`#01`–`#08`) and milestone flags. |
| **9. Site Settings** | `30387ecf...` | `globals/SiteSettings.ts` (`beforeDocumentControls`) | Platform configuration, social linkages, navigation schemas, and system diagnostics. |
| **10. Users** | `5a8adce9...` | `collections/Users.ts` (`beforeList`, `afterList`) | Single-Admin V1 security architecture monitor, JWT session auth, and closed registration enforcement. |
| **Login** | `9e148a71...` | `app/(payload)/admin/login` (`LoginView.tsx`) | Hybrid light/dark philosophical gateway with typography tension and secure credential submission. |

---

## 3. Shared Component Architecture (`src/components/admin/shared/`)

1. **`ObservatoryBanner`**:
   - Master section header displaying section category, active astronomical reference plate (FITS plate image, RA/Dec coordinates, observational instruments like VLT UT4 MUSE / JWST NIRCam), and telemetry status pills.
2. **`TelemetryTile`**:
   - Metric card presenting numeric values in Newsreader serif with JetBrains Mono delta tags and status indicators.
3. **`ObservatoryFilterToolbar`**:
   - Accessible quick-filter segmented pills (`All`, `Published`, `Drafts`, `Archived`, `Featured`), category dropdowns, and search trigger with `⌘K` badge.
4. **`TelemetryFooter`**:
   - Bottom status strip displaying real-time PostgreSQL connection status (0ms lag), S3 WAL sync status, Git branch, and UTC timestamp.
5. **`observatory-shared.css`**:
   - Strict CSS variable bindings and zero-radius element overrides.

---

## 4. Architectural Non-Destructive Extension Rationale

A primary architectural requirement was:
> *"The integration should enhance the admin workflow without replacing core Payload functionality. All form handling must integrate with Payload CMS (validation, publishing, drafts, status management)."*

To achieve this:
- **Core Form Integrity**: Field validation, auto-saving, Lexical rich-text editing, drafts, and PostgreSQL mutations remain 100% powered by Payload CMS's native React form providers.
- **Visual & Workflow Enhancement**: Rather than replacing entire document editors with fragile custom forms, we injected Stitch components into Payload's `beforeList`, `afterList`, `beforeDocumentControls`, and custom views.
- **Global Theme Injection**: `src/styles/admin-observatory.css` was introduced in `src/app/(payload)/layout.tsx` to theme all Payload admin components (buttons, tables, inputs, sidebars, drawers) to match the Observatory design language.
