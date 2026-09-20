# Production Deployment & Post-Deployment Verification

This document details the production deployment architecture, environment variable configuration, post-deployment verification procedures, and emergency Git rollback strategies for ZeroAbstraction.

---

## 1. Deployment Architecture Overview

ZeroAbstraction is architected to run as a containerized Next.js + Payload CMS application hosted on **Coolify** (a self-hosted PaaS on a VPS) or any Docker-compatible infrastructure.

| Layer | Technology / Service | Configuration Detail |
| :--- | :--- | :--- |
| **Application Runtime** | Next.js 15 (App Router) + Payload 3.x | Multi-stage Docker build utilizing `output: 'standalone'` in `next.config.mjs`. |
| **Database** | PostgreSQL 16 (Neon / Managed Postgres) | Connected via `DATABASE_URL`; version-controlled migrations via `npm run payload:migrate`. |
| **Object Storage** | Cloudflare R2 | S3-compatible bucket via `@payloadcms/storage-s3` plugin with zero egress fees. |
| **Reverse Proxy & SSL** | Coolify (Traefik / Caddy) | Automated SSL certificate issuance and ingress routing on port 80/443. |

---

## 2. Production Environment Variables

In production (Coolify dashboard), environment variables are injected at runtime without committing secrets to version control:

```env
# Node / Server Configuration
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# PostgreSQL Connection String
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require

# Payload Cryptographic Secret
PAYLOAD_SECRET=generate-a-strong-32-character-secret-via-openssl

# Object Storage (Cloudflare R2)
S3_ENABLED=true
S3_ENDPOINT=https://<cloudflare-account-id>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=<your-r2-access-key-id>
S3_SECRET_ACCESS_KEY=<your-r2-secret-access-key>
S3_BUCKET=zeroabstraction-media
S3_REGION=auto
S3_FORCE_PATH_STYLE=false
```

> [!NOTE]
> `NEXT_PUBLIC_` variables must be available during the Docker build stage if statically baked by Next.js. Coolify automatically provides environment variables during image building (`--build-arg`).

---

## 3. Deployment Procedure

### Step 1: Pre-Deployment Migration Check
Before releasing new code that depends on database changes, execute any pending schema migrations against the production database:
```bash
npm run payload:migrate
```
*Tip: On Coolify, you can run this command via the container terminal or add it as a pre-deploy hook.*

### Step 2: Trigger the Build & Deployment
Push changes to the production Git branch (e.g., `main`):
```bash
git push origin main
```
Coolify automatically detects the push, pulls the repository, executes the multi-stage Docker build using `Dockerfile`, and starts the container.

---

## 4. Post-Deployment Verification Checklist ("Verify After Every Deployment")

Per the core operational rule: **Every production release must be verified immediately after deployment across both public routes and administrative access.**

Run this verification checklist against the deployed domain:

### A. Administrative Access & Auth
- [ ] **Admin Login Page**: Navigate to `https://yourdomain.com/admin` and verify the login screen renders with HTTP 200.
- [ ] **Authentication**: Log in with administrator credentials.
- [ ] **Dashboard Integrity**: Confirm collections (`Posts`, `Projects`, `Topics`, `Media`, `Journey`) and globals (`CurrentState`, `Profile`, `SiteSettings`) load without React or API errors.
- [ ] **Media Upload Verification**: Upload a test image or inspect existing media in the Media collection to ensure presigned URLs resolve cleanly against Cloudflare R2.

### B. Public Frontend Pages
- [ ] **Homepage (`/`)**: Verify HTTP 200, hero display typography, "Right Now" section, featured projects, recent posts, and about preview.
- [ ] **Writing Archive (`/writing`)**: Verify all published articles appear with correct title, reading time, and formatted publish dates.
- [ ] **Writing Single (`/writing/[slug]`)**: Open an individual article and confirm full Lexical rich-text content, tags, and formatting render properly.
- [ ] **Projects Archive (`/projects`)**: Verify project cards display with cover imagery, tech tags, and summaries.
- [ ] **Projects Single (`/projects/[slug]`)**: Verify individual project details and related posts render correctly.
- [ ] **404 Handling**: Navigate to a non-existent route (`/non-existent-page`) and verify the styled 404 error page returns HTTP 404 status.

---

## 5. Git Rollback Strategy (Practice Rollback)

In the event of a critical failure after deploying a new release to production, you can rapidly roll back using Git. This ensures that the codebase reverts to the last known stable state and triggers a fresh, stable deployment.

### Steps to Roll Back via Git:

1. **Identify the Last Stable Commit**:
   Check your git log to find the commit hash of the last working release.
   ```bash
   git log --oneline
   ```
2. **Execute the Revert**:
   If the failure was the immediately preceding commit (e.g. `HEAD`), revert it directly:
   ```bash
   git revert HEAD --no-edit
   ```
   *Note: Using `git revert` is safer than `git reset --hard` because it preserves the repository's history and doesn't rewrite pushed commits, ensuring teammates and deployment pipelines don't face conflicts.*
3. **Push to Production**:
   Push the new revert commit to trigger a deployment:
   ```bash
   git push origin main
   ```
4. **Database Migrations Check**:
   If the bad release included a database migration that ran, rolling back the code does **not** roll back the database schema automatically. 
   - **Compatible schema changes** (e.g. adding a nullable column) will not break the older code.
   - **Incompatible schema changes** (e.g. dropping a table) require you to manually run the migration `down` step before pushing the revert. Run `npm run payload:migrate` down steps via the server terminal if necessary.

### Rollback Validation Result
- **Action**: Made a trivial text change to the homepage, committed, and built successfully.
- **Rollback**: Ran `git revert HEAD --no-edit` and verified the build succeeds again, restoring the prior state perfectly.
- **Result**: PASSED.
