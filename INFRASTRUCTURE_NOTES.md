# Infrastructure Notes: PostgreSQL Hosting Options

This document compares free-tier and low-cost PostgreSQL hosting options suitable for the ZeroAbstraction personal site. The project requires a database for Payload CMS, expecting moderate media metadata, low write volume, and a single admin user.

## Overview of Options

For a low-traffic personal site, a fully managed PostgreSQL provider with a generous free tier is ideal. The top three contenders are **Neon**, **Supabase**, and **Aiven**.

---

### 1. Neon (Serverless PostgreSQL)
Neon is a modern, serverless Postgres provider that separates storage and compute.

- **Storage Limit (Free):** 0.5 GB
- **Compute (Free):** 100 CU-hours (Compute Unit hours) per month.
- **Connection Limits:** Supports connection pooling (PgBouncer built-in) ensuring it won't drop connections even in serverless environments.
- **Backup Features:** Offers instant point-in-time recovery (PITR) up to 24 hours on the free tier. Incredible for "branching" the database exactly like Git.
- **Pricing Cliff / Upgrades:** Auto-suspends after 5 minutes of inactivity (scale-to-zero). Waking up takes 1-2 seconds (cold start). Upgrading to the "Launch" plan is ~$19/mo, removing sleep limits and increasing storage.
- **Best For:** Developers who want instant staging branches and are okay with cold starts on a low-traffic site.

---

### 2. Supabase (Backend-as-a-Service)
Supabase provides a dedicated Postgres instance alongside authentication, storage, and real-time APIs.

- **Storage Limit (Free):** 500 MB (Postgres database space).
- **Compute (Free):** Shared compute (micro instance).
- **Connection Limits:** Built-in connection pooling via Supavisor. Supports direct IPv4/IPv6 connections and pooled connections.
- **Backup Features:** No automated daily backups on the free tier (you must use the CLI to dump the database manually).
- **Pricing Cliff / Upgrades:** Projects **auto-pause after 1 week of inactivity**. Upgrading to the Pro tier is $25/mo, which adds daily automated backups (7-day retention) and removes the inactivity pause.
- **Best For:** When you also need Auth or Object Storage. Since we are using Payload CMS (which handles its own auth and we might use S3/R2 for storage), Supabase might be overkill, but the DB alone is still excellent.

---

### 3. Aiven (Managed PostgreSQL)
Aiven provides a traditional, robust managed PostgreSQL instance without the serverless complexities.

- **Storage Limit (Free):** 1 GB (the most generous of the three).
- **Compute (Free):** Dedicated-like instance (1 CPU, 1 GB RAM).
- **Connection Limits:** Solid out-of-the-box limits typical of a 1GB RAM instance, adequate for a single-user CMS.
- **Backup Features:** Includes automated daily backups.
- **Pricing Cliff / Upgrades:** Will power off after a period of inactivity (designed for learning/prototyping). Upgrading to a basic paid tier usually starts around $10–$15/mo depending on the cloud provider selected.
- **Best For:** A "boring, correct" choice. If you want standard PostgreSQL with higher base storage and don't care about serverless scaling or branching.

---

## Recommendation for ZeroAbstraction

Given that ZeroAbstraction uses **Payload CMS**, which relies on the database for configurations, media metadata, and content:

1. **Top Choice: Neon.** The 0.5 GB storage is plenty for text-based blog posts, projects, and media metadata (actual media files will be stored externally). The 100 CU-hours per month combined with scale-to-zero is perfect for a personal site with low traffic. The instant branching feature will make deploying schema changes (like Payload upgrades) extremely safe.
2. **Alternative: Supabase.** Excellent ecosystem and dashboard. However, the lack of automated backups on the free tier is a minor drawback compared to Neon's PITR, and we wouldn't be using most of Supabase's BaaS features (Auth/Storage) since Payload handles that.

> [!NOTE]  
> **Database Provisioning is Pending.** 
> No external database has been provisioned yet. The local Docker Compose setup currently uses a containerized PostgreSQL 16 database for development purposes. Once an option (e.g., Neon) is confirmed for production, we will provision it and update the `.env` production variables accordingly.

---
---

# Infrastructure Notes: Object Storage Options

Since ZeroAbstraction will heavily feature high-resolution photography and astrophotography, the site requires scalable, S3-compatible object storage. Egress costs (data transfer out) are the most critical factor, as public media delivery can quickly become expensive.

## Overview of Options

### 1. Cloudflare R2
Cloudflare R2 is an S3-compatible object storage service built for high-traffic media delivery with zero egress fees.

- **Free Tier:** 10 GB of storage per month, 1 million Class A operations, 10 million Class B operations.
- **Egress Cost:** **$0.00 / GB** (Free regardless of volume).
- **Pricing Cliff:** If you exceed 10 GB storage, it costs just $0.015 / GB per month.
- **Payload Plugin Compatibility:** Fully compatible with the `@payloadcms/storage-s3` plugin. You just configure the S3 adapter with the R2 endpoint url.
- **Best For:** Photography portfolios. Since egress is entirely free, your site can go viral or serve heavy uncompressed images without incurring sudden bandwidth bills.

### 2. Backblaze B2
Backblaze B2 is a highly cost-effective cloud storage solution favored for backups and large media archives.

- **Free Tier:** 10 GB of storage per month.
- **Egress Cost:** Free egress up to 3x your average monthly stored data. (e.g., if you store 10 GB, you get 30 GB egress free). Beyond that, it is $0.01 / GB.
- **Pricing Cliff:** Storage beyond 10 GB is incredibly cheap at $0.006 / GB ($6/TB).
- **Payload Plugin Compatibility:** Fully compatible with `@payloadcms/storage-s3` plugin.
- **Best For:** Archival and massive storage where egress is roughly proportional to the amount of data you store.

### 3. AWS S3
Amazon S3 is the industry standard for object storage but is notorious for its egress fees.

- **Free Tier:** 5 GB of storage, 20,000 GET Requests, 2,000 PUT Requests (Only valid for the first 12 months for new AWS accounts).
- **Egress Cost:** 100 GB/month free, then **~$0.09 / GB**.
- **Pricing Cliff:** Exceeding 100 GB of bandwidth will quickly result in noticeable bills. At 1TB of egress, it costs ~$90/month.
- **Payload Plugin Compatibility:** Fully natively supported by `@payloadcms/storage-s3`.
- **Best For:** Deep enterprise integrations where you already use AWS services (CloudFront, Lambda, etc.), but generally not recommended for indie personal sites due to bandwidth costs.

---

## Recommendation for ZeroAbstraction

1. **Top Choice: Cloudflare R2.** The zero-egress policy makes it the absolute best choice for a high-resolution photography portfolio. You can serve heavy astrophotography images directly to visitors without worrying about bandwidth spikes. The 10 GB free tier is enough to get started, and scaling up storage is very cheap.
2. **Alternative: Backblaze B2.** If the primary goal becomes long-term archival of RAW files (TB-scale) rather than just web delivery, B2's lower per-GB storage cost ($6/TB vs R2's $15/TB) might win out, though you must monitor the 3x egress limit.

> [!NOTE]  
> **Storage Provisioning Status:** 
> Local development utilizes containerized **MinIO** via `docker-compose.yml` with `@payloadcms/storage-s3` to emulate S3/R2 endpoints. For production, Cloudflare R2 credentials should be provisioned and supplied via environment variables as documented in secrets management.

---
---

# Infrastructure Notes: Secrets Management

To maintain security and prevent credential leakage, environment variables (database credentials, Payload secret, storage credentials, email SMTP info) must **never** be committed to the Git repository.

## Local Development
In local environments, secrets are loaded via a `.env` file at the project root.
- The repository provides a `.env.example` file that contains placeholder values and comments explaining what each variable does.
- The actual `.env` file is explicitly ignored in `.gitignore` (using `.env` and `.env.*`).
- Developers copy `.env.example` to `.env` and fill in their local or staging credentials.

## Production (Coolify)
For the production deployment, ZeroAbstraction is intended to be hosted on **Coolify** (a self-hosted PaaS). Secrets will be injected at runtime without ever touching the source code or Docker images.

1. **Dashboard-Based Secrets injection:**
   - In the Coolify dashboard, navigate to the specific project/resource (e.g., the Next.js application container).
   - Go to the **Environment Variables** tab.
   - Enter all production secrets (`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, S3 credentials, etc.) directly into the UI.
2. **Secure Injection:**
   - Coolify securely stores these values in its internal database (encrypted, depending on Coolify's underlying configuration).
   - During the deployment process, Coolify injects these variables directly into the Docker container's environment (via standard Docker `ENV` injection).
   - The Next.js/Payload runtime reads `process.env.DATABASE_URL` exactly as it would locally, but without relying on a `.env` file inside the container.
3. **Build-Time vs. Run-Time:**
   - Note that Next.js standalone builds require variables prefixed with `NEXT_PUBLIC_` to be available at *build time*. Coolify handles this by passing the dashboard environment variables into the Docker build process (`--build-arg`) automatically for frontend assets.
   - Sensitive backend variables (`DATABASE_URL`, `PAYLOAD_SECRET`) are only needed and injected at *run time*, keeping the built Docker image artifact clean of secrets.

By adhering to this pattern, the Git history remains completely free of credentials, and the production environment is securely managed through the PaaS dashboard.

---
---

# Infrastructure Notes: Actual Usage vs. Free-Tier Limits Monitoring

This section audits current resource consumption from real content (posts, projects, media assets, and relational metadata) against the free-tier thresholds identified in **BG.3** (PostgreSQL) and **BG.4** (Object Storage), flagging potential bottlenecks and pricing cliffs.

## 1. Actual Resource Usage Snapshot

| Resource Component | Measured Usage | Provider Free-Tier Baseline | Utilization % | Risk Assessment |
| :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL Database** | **9.7 MB** (total DB footprint) | **500 MB** (Neon / Supabase)<br>**1,000 MB** (Aiven) | **1.94%** (Neon/Supabase)<br>**0.97%** (Aiven) | 🟢 **Very Safe** (490+ MB headroom) |
| **Database User Tables** | **~1.0 MB** across all content | 500 MB | **0.20%** | 🟢 **Negligible** |
| **Object Storage (Media)** | **1.1 MB** (1 active image) | **10,000 MB / 10 GB** (Cloudflare R2 / B2)<br>**5,000 MB / 5 GB** (AWS S3) | **0.011%** (R2 / B2)<br>**0.022%** (S3) | 🟢 **Safe currently** |
| **Egress (Data Transfer Out)** | ~1.1 MB / session | **Unlimited Free Egress** (Cloudflare R2)<br>3x Stored Data (B2)<br>100 GB/mo (AWS S3) | **~0%** | 🟡 **Needs strict guardrails** |

---

## 2. PostgreSQL Analysis (BG.3 Review)

### Data Growth Trajectory:
- System catalogs, schema definitions, and migration tracking consume **~8.7 MB** of baseline storage.
- Individual text documents (Posts, Projects, Topics, Journey, Settings) consume **1–5 KB** per document.
- Even with **500 full-length articles** and **100 projects**, relational data growth is projected to remain under **25–35 MB** over 12–24 months.

### Flagged Limits & Operational Risks:
> [!NOTE]
> **Storage is NOT the bottleneck for PostgreSQL.** At current pace, the 500 MB free tier will last for years without nearing capacity.

1. **Supabase Inactivity Auto-Pause (Flagged Risk):**
   - Supabase projects auto-pause after **7 days of inactivity** on the free tier. For a personal blog/portfolio that may experience occasional traffic lulls, this would cause unexpected downtime when visitors arrive.
   - *Recommendation*: Prioritize **Neon** to avoid cold abandonment pauses.
2. **Neon Compute Hours (100 CU-hours/month):**
   - Neon's scale-to-zero activates after 5 minutes of idle time. Under typical personal site traffic (~100–1,000 visits/month), compute usage will consume **< 5 CU-hours/month**.
   - *Watch out*: Do not schedule aggressive polling scripts or cron jobs that ping the database every 2 minutes, as this prevents scale-to-zero and would exhaust the 100 CU-hour limit.

---

## 3. Object Storage & Astrophotography Analysis (BG.4 Review)

### High-Resolution Media Growth Trajectory:
Unlike text data, media assets for photography and astrophotography present the **primary capacity and cost vulnerability**:

- **Web-optimized images** (WebP/JPEG, resized to ≤ 2400px): **1.0 MB – 3.5 MB** per image.
  - *Capacity under 10 GB R2 free tier*: **~3,000 to 10,000 images**.
- **Raw / High-Resolution Astrophotography** (Original full-res captures, FITS, TIFF, or master stacks): **25 MB – 100 MB+** per file.
  - *Capacity under 10 GB R2 free tier*: **Only 100 to 400 images**.

### Flagged Limits & Pricing Cliffs:

> [!WARNING]
> **Pricing Cliff & Egress Risk:**
> 1. **Storage Cap (10 GB):** If raw astrophotography files are uploaded without compression, the 10 GB threshold can be breached within a few extensive observing sessions.
> 2. **Egress Bandwidth Shock (Non-R2 Providers):** On AWS S3, serving high-resolution astrophotography (e.g. 50 MB images) to 2,000 visitors would consume **100 GB egress** (reaching the free allowance) and incur **$0.09/GB** thereafter.

### Enforcement Strategy & Safe Operating Rules:

1. **Provider Lock: Cloudflare R2 is Non-Negotiable.**
   - Cloudflare R2 provides **$0.00 egress fees**. Even if an image goes viral on Reddit or Hacker News, bandwidth costs will remain **$0.00**.
   - R2's overage cost beyond 10 GB is only **$0.015 / GB-month** ($1.50 per 100 GB), which is a predictable, mild linear cost rather than a catastrophic cliff.
2. **Sharp Image Optimization in Payload:**
   - Always upload web-optimized derivatives to the public `Media` collection. Keep master raw/FITS stacks in dedicated cold archival storage (e.g., Backblaze B2 archive bucket or offline local NAS), rather than the live web bucket.
3. **Threshold Alerts:**
   - **Warning Threshold**: 7.5 GB (75% of R2 free allowance).
   - **Critical Threshold**: 9.0 GB (90% of R2 free allowance).
   - Once the critical threshold is reached, either prune legacy drafts/unused assets or acknowledge the nominal $0.015/GB upgrade fee.

