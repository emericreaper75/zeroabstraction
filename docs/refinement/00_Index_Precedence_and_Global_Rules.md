# 00 — Refinement Pack: Index, Precedence & Global Rules

*ZeroAbstraction · Personal Universe · Frontend refinement (Nov 2026)*

## Purpose
This pack turns eight design decisions into build-ready specs for the local coding agent. It refines the existing visual planning documents (`01_Visual_Vision_and_Identity` … `05_Content_Imagery_and_Presentation_Guidelines`) and the backend documents. Nothing here changes the content model, the stack, or the admin/frontend separation.

## Document map (numbers match the owner's list of eight)
| # | File | Owns |
|---|---|---|
| 01 | `01_Article_Reading_Page.md` | Public article page (`/writing/[slug]`) layout and typography |
| 02 | `02_Related_Content_and_Connected_Universe.md` | Related/connected logic, the Related block, topic filter component |
| 03 | `03_Right_Now_Section.md` | Right Now section: keep design, recolor, empty-state rule |
| 04 | `04_Color_Tokens_and_Dark_Mode.md` | **Every** color, type-scale, spacing, motion and glass token. Single source of truth |
| 05 | `05_Admin_Dashboard_and_Login_Recolor.md` | Payload admin + login recolor only |
| 06 | `06_Writing_Page_Shelf.md` | Writing archive page (Shelf) |
| 07 | `07_Projects_Page_Library.md` | Projects listing page (Library) |
| 08 | `08_Home_Page_Runtime_Theme.md` | Home hero, glass top bar, home section rhythm |
| 09 | `09_Execution_Prompt.md` | The prompt that runs everything |

## Precedence (how conflicts are prevented)
1. **Token values live only in 04.** Other documents reference tokens by name (`--accent-text`) and never contain hex codes, font sizes in px for color/type roles, or timing values that exist as tokens. If a document needs a new value, it is added to 04 first.
2. **Each page has exactly one owning document** (table below). A non-owning document may only add a clearly named *block* to that page (for example 02's Related block).
3. **Order of authority:** 00 (global rules) → 04 (tokens) → the owning page document → older visual planning documents. Older documents fill gaps only; where they disagree with this pack on a covered topic, this pack wins.
4. **If the agent finds a conflict, an ambiguity, or code that contradicts a document, it stops that item, records it in `docs/refinement/REPORT.md`, and continues with unaffected items. It does not guess.**
5. **Reference prompts** (MotionSites) are inspiration only. They sit in `docs/refinement/reference/` if the owner adds them. Every document here is self-contained; a reference can add polish but never overrides a document.

## Ownership matrix
| Surface | Owner | Blocks added by others |
|---|---|---|
| Colors, type scale, spacing, motion, glass | 04 | — |
| Article page | 01 | Related block (02), topic chips (02) |
| Project detail page | existing spec `03_Page_and_Screen_Specification` | Related block (02), tokens (04) |
| Writing listing page | 06 | Topic filter (02) |
| Projects listing page | 07 | Topic filter (02) |
| Home page | 08 | Right Now section (03) |
| Right Now component | 03 | placed by 08 |
| Admin + login | 05 | tokens (04) |

## Locked constraints (apply to every document)
- Stack unchanged: Next.js + Payload CMS + PostgreSQL, single repo. **No schema changes in this pack.**
- Admin and public site stay separate, with no cross-linking.
- No WebGL, no Three.js, no continuous particle systems, no cursor trails, no heavy 3D. CSS transforms and Framer Motion only.
- All motion respects `prefers-reduced-motion`; the site must be fully usable with motion off.
- No fake scientific data or decorative telemetry. Coordinates, dates, spectra and credits appear only when real.
- Both themes (light and dark) must work on every page touched. No page ships light-only.
- Accessibility floor: WCAG AA contrast, visible keyboard focus, semantic headings, meaningful alt text, comfortable touch targets.
- Local workflow is Docker-only: use the project's existing compose workflow; no host-level `npm`.

## Global cleanup rules (apply everywhere, owned here)
1. **Image treatment:** remove every zigzag/torn-edge `clip-path`, static tilt (`rotate`) on images, and thin colored image outlines. Images are plain rectangles with `--radius-s` or none.
2. **Accent:** the only accent is bronze (`--accent*`). Remove green and red-orange accent usage and the sage decorative circle. Status colors (`--success`, `--warning`, `--danger`) are used only for status.
3. **Background:** use `--bg` (the specified warm paper). Remove any peach or off-spec background literal.
4. **Dividers:** squiggle/hand-drawn dividers are replaced by a 1px `--border` hairline.
5. **Hex ban:** after Phase A, no hex/rgb color literals outside `tokens.css` (enforced by the grep check in 04).
6. **Sample banner:** the `[SAMPLE CONTENT — NOT FINAL]` strip stays until real content ships; it uses `--warning`. It must be removable by one flag.
7. **Repeated imagery:** the same astronomy image must not appear twice on one page. Use real media; until then, keep the existing sample images but never reuse one within a page.

## Reference intake (optional, improves fidelity)
Create `docs/refinement/reference/` and drop the prompt text of the MotionSites references the owner has access to:
- `shelf-hero.prompt.md` (for 06), `book-library.prompt.md` (for 07), `ai-runtime.prompt.md` (for 08).
The agent may read them for layering, choreography and technique, then **must override** colors, fonts, copy, media and any WebGL/video-dependency with this pack. If a file is absent, build from the document alone and note that in the report.

## Execution phases
| Phase | Work | Docs |
|---|---|---|
| 0 | Inventory (no code changes), writes `reference/INVENTORY.md` | all |
| A | Tokens, theme wiring, global cleanup, contrast script | 04, 00 |
| B | Admin and login recolor | 05 |
| C | Article page, Related block, topic filter | 01, 02 |
| D | Writing page (Shelf), Projects page (Library) | 06, 07 |
| E | Home page, glass bar, Right Now recolor | 08, 03 |
| F | QA, report | all |

Gate after every phase: clean Docker build, no console errors or hydration warnings, light+dark screenshots of each touched page, contrast script passes.

## Assumptions the owner should confirm
1. The "glassy hero bar" is the **top navigation bar over the Home hero**, glass on Home only; other pages keep the same bar in its solid form. (08)
2. "AI Runtime-like theme" applies to the **Home hero and its section rhythm**, not the whole site. (08)
3. Writing = **Shelf of spines**, Projects = **Library of covers**, deliberately different so the two book metaphors do not clash. (06, 07)
4. The existing Projects listing was not available when these documents were written; 07 requires the agent to inventory and preserve it.
5. Login panel follows the earlier locked decision (dark charcoal panel). (05)
6. The AI Runtime, Shelf Hero and book references were not opened in full; documents are written to stand alone. (06–08)

## Definition of done
- All checklist items at the end of documents 01–08 pass.
- `docs/refinement/REPORT.md` lists what changed, what was skipped, and every conflict raised.
- Screenshots (light and dark) for: Home, Writing, an article, Projects, a project detail page, About, admin login, admin dashboard, admin post editor.
