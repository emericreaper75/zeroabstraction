# 02 — Related Content & Connected Universe

*Reference: Maggie Appleton's digital garden and notes index (https://maggieappleton.com/ and /notes): a personal site that links ideas to one another instead of treating each post as an island.*
*Owner of: relationship logic, the Related block, the topic chips, the TopicFilter component. Does not own any listing page layout (06, 07).*

## Principle
The same piece of content can appear in several places without being duplicated (Content guidelines, "Personal universe principle"). We deliver that with **resolved relationships** and **topic filters**, using only fields that already exist. We deliberately do **not** add growth stages, a notes collection, backlink graphs or a new topic page. Those remain future scope.

## Data used (no schema changes)
- Posts: `topics`, `relatedProjects`, `relatedPosts`, `status`, `publicationDate`.
- Projects: `topics`, `relatedPosts`, `status`, `year`.
- Topics: `name`, `slug`, `type`.
Only **published** content is ever shown publicly.

## Resolution: `getRelated(item, limit = 3)`
Server-side utility (place it following the repo's conventions, for example `src/lib/related.ts`). Steps, in order, until `limit` is reached:
1. **Explicit:** the item's own related posts and projects, in the order the author set.
2. **Reciprocal:** published items that list this item as related. Authors need not link both directions.
3. **Same topic:** published posts and projects sharing at least one topic, sorted by overlap count descending, then newest first.
Rules: exclude the item itself, drop duplicates (same id and type), exclude drafts and archived items. No type quota.
Each result carries a **provenance**: `explicit`, `reciprocal` or `topic:<name>`.
Performance: at most three database queries per page, no client-side fetching, result cached with the page.

## Related block (end of article and project detail pages)
- Renders **nothing** if there are zero results (no empty heading).
- One section label, `RELATED`, mono `--text-label`, `--text-muted`. This is the only place the word appears (items do not repeat it).
- Presented as **rows, not boxed cards**, separated by 1px `--border`:
  - Left: type and date or year in mono, for example `POST · SEP 2026` or `PROJECT · 2026`.
  - Center: title in `--font-display` at `--text-h3` (not hero size); one-line excerpt in `--text-small` `--text-muted`, clamped to two lines.
  - Provenance, only for topic matches: `SAME TOPIC · ASTROPHYSICS` in mono `--accent-text`.
  - Right: `READ ARTICLE →` or `VIEW PROJECT →` in mono `--text-ui-sm`.
- The whole row is one link. Hover: arrow moves 4px, title underline appears. Reduced motion: no movement.
- Spacing: `--space-8` above the section, `--space-4` row padding.

## Topic chips (end of article/project)
- Label `TOPICS`, then each topic as a text link in mono (`--accent-text`), pointing to `/writing?topic=<slug>` for posts and `/projects?topic=<slug>` for projects. Not boxed.

## TopicFilter component (used by 06 and 07)
- Props: list of topics with published counts, active slug, base path.
- Shows only topics with at least one published item. Order: by topic `type`, then alphabetical.
- Presentation: a single mono row, `ALL · ASTROPHYSICS 3 · INSTRUMENTATION 1`. Active item uses `--accent-text` with a 1px underline; others `--text-muted`.
- State lives in the URL (`?topic=<slug>`, single value). Links, so it works without JavaScript.
- Counts are real. If only one topic exists, still show the row for consistency.
- Keyboard: normal link order; visible focus ring; touch targets ≥ 44px tall.
- On small screens the row scrolls horizontally inside its own container.

## Connected projects on posts, connected posts on projects
- Handled by the same Related block; the type label tells the reader what they are about to open. The project detail page's "connected posts" (existing spec) are this block.

## Out of scope
New collections, topic landing pages, graph views, "growth stage" badges, comments, recommendations by ML.

## Acceptance
- [ ] A post that lists a project as related shows that project; the project shows the post back without the author linking both ways.
- [ ] A post with no explicit links falls back to same-topic items with visible provenance.
- [ ] Drafts never appear; the item itself never appears; no duplicates.
- [ ] Zero results renders nothing.
- [ ] The label `RELATED` appears once per block.
- [ ] TopicFilter works without JavaScript and reflects the URL.
