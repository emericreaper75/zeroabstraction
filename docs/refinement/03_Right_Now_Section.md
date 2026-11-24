# 03 — Right Now Section

*Concept: the /now page idea (https://nownownow.com/about): a short, honest answer to what the person is focused on at this point in their life.*
*Owner of: the Right Now component. Placement belongs to 08. Colors come from 04.*

## Decision
**Keep the current design.** This document changes colors and one data-state rule only. Do not redesign, re-layout, re-type, re-space or re-animate the component.

## What to change
1. **Colors only.** Replace every color literal in the Right Now component with tokens:
   - section label (currently green) → `--accent-text`
   - field labels (Studying, Building, Reading, Thinking about) → `--text-muted`
   - values → `--text`
   - dividers and any border → `--border`
   - any accent mark → `--accent`
   - any hover color → `--accent-hover`
2. **Both themes** must render correctly. No theme-specific markup.
3. Keep existing fonts, sizes, spacing, order and motion as they are. If the component currently uses an off-scale font size or spacing, leave it unless it breaks the layout in one of the themes.

## Data-state rule (behavior, not styling)
Source: the Current State record (`studying`, `building`, `reading`, `thinking about`, `updated date`, `visibility`).
- If `visibility` is off, or **all four fields are empty**, render **nothing** (no heading alone, no "Not set" text).
- If some fields are filled, render only those rows. Never render placeholder text such as "Not set".
- If the component already shows the updated date, keep it, formatted as it is today. Do not add it if it is not shown.
- No fake or placeholder values in production. Sample values for local review are allowed only when the sample-content banner is on.

## Out of scope
Layout changes, new fields, icons, animations, live "telemetry", relative-time widgets.

## Acceptance
- [ ] Visually identical to the current component except for color, in light and in dark.
- [ ] Contrast passes for label, value and divider tokens (script in 04).
- [ ] With empty Current State, the Home page shows no Right Now heading.
- [ ] With partial data, only filled rows render.
