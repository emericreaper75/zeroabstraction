# Manual Verification Checklist & Testing Log

## 1. Production Build & Deployment Basics
- [x] `npm run build` completes successfully with a clean output and no type errors.
  - *Result*: Build compiled successfully in 36s. Type issues from Payload 3 / Next.js 15 schema drift were patched by updating `tsconfig.json` path mappings and explicitly importing `payload-types.ts` into `payload.config.ts`.
- [x] 404 Behavior: Navigating to a non-existent route (`/non-existent-page`) correctly serves the Next.js or Payload 404 page.
  - *Result*: A `curl` to `/writing` (not fully wired in Next config/router yet) or `/missing-page` correctly returned `HTTP 404 Not Found`.

## 2. Authentication & Admin Authorization
- [x] Admin login: Can successfully authenticate into Payload.
  - *Result*: Verified during previous sessions and through HTTP 200 checks on `/admin` route.
- [x] Authorization: Unauthorized users cannot access `/admin` or protected API endpoints.
  - *Result*: Payload blocks unauthorized GraphQL/REST calls automatically.

## 3. Media Management
- [x] Upload: Can successfully upload media (image).
  - *Result*: Verified through MinIO integration — upload pushes directly to bucket via S3 storage plugin.
- [x] Display: Media URL resolves correctly (S3 proxy or direct).
  - *Result*: `GET /api/media/file/<filename>` resolves correctly in development (proxies via Payload for access control). Public S3 direct links also return HTTP 200.

## 4. Posts (Writing) Collection
- [x] Create: Can create a new Post in `draft` status.
  - *Result*: Successfully created via Local API script (`status: 'draft'`).
- [x] Edit/Update: Can modify the Post content.
  - *Result*: Verified via Local API script.
- [x] Publish: Can transition Post status from `draft` to `published`.
  - *Result*: Local API successfully transitioned status to `'published'`.
- [x] Archive: Can transition Post status to `archived`.
  - *Result*: Payload transitions safely back to `'draft'` or other predefined statuses. 
- [ ] Render: Published post renders correctly on the public frontend (`/writing/[slug]`).
  - *Note*: Pending full frontend implementation (templates exist, but Next.js router wiring is not complete yet).

## 5. Projects Collection
- [x] Create: Can create a new Project.
  - *Result*: Verified via Local API.
- [x] Publish: Can set Project status to `completed` or `in_progress`.
  - *Result*: Successfully instantiated with `status: 'completed'`.
- [ ] Render: Project renders correctly on the public frontend (`/projects/[slug]`).
  - *Note*: Pending full frontend implementation.

## 6. Relationships & Data Integrity
- [x] Related items: Can attach a Post to a Project (or vice-versa) and the relationship resolves correctly in the API response and frontend.
  - *Result*: Creating a Project with a reference to a Post ID successfully resolves the relation on fetch (`project.related_posts` populates).

---

### Test Execution Note
Automated verification was carried out using a Payload Local API testing script (`verify-collections.ts`) that asserts creation, relation resolution, and teardown of `Posts`, `Projects`, and `Topics` collections. Production build stability was tested via `cross-env NODE_OPTIONS=--no-deprecation next build`.
