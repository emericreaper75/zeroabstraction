# Backup and Restore Procedures

This document outlines the operational backup and disaster recovery runbooks for ZeroAbstraction across local development, managed databases (Neon), containerized databases (Coolify), and object storage (Cloudflare R2 / MinIO).

---

## 1. PostgreSQL Database Backups

ZeroAbstraction supports two database deployment models:
- **Model A: Managed Serverless PostgreSQL (Neon)** — Recommended for production.
- **Model B: Containerized PostgreSQL on VPS (Coolify)** — Alternative self-hosted stack.
- **Model C: Local Containerized PostgreSQL (Docker Compose)** — For local development and testing.

---

### Model A: Managed PostgreSQL (Neon) Backup & Recovery

Neon provides automated continuous Write-Ahead Log (WAL) archiving and Point-in-Time Recovery (PITR).

#### 1. Point-in-Time Recovery (PITR) via Neon Console:
1. Log in to the [Neon Console](https://console.neon.tech).
2. Navigate to your project -> **Branches**.
3. Click **Create Branch**.
4. Select **Branch from past point in time** and specify the exact timestamp before the incident occurred.
5. Update your application's `DATABASE_URL` to point to the recovered branch to resume operations.

#### 2. Manual Snapshot via Neon CLI:
```bash
# Dump the active Neon database to an encrypted local archive
pg_dump "$DATABASE_URL" -Fc -f "zeroabstraction_neon_$(date +%Y%m%d_%H%M%S).dump"

# Restore the snapshot into a fresh database or branch
pg_restore -d "$NEW_DATABASE_URL" --clean --if-exists "zeroabstraction_neon_<timestamp>.dump"
```

---

### Model B: Containerized PostgreSQL on VPS (Coolify)

When using Coolify's containerized PostgreSQL instance, leverage Coolify's built-in automated scheduled backup functionality.

#### 1. Backup Configuration (Coolify Dashboard):
1. Navigate to **Destinations -> S3 Storage** and add a dedicated backup bucket (e.g., Cloudflare R2 or Backblaze B2).
2. Go to the PostgreSQL resource -> **Backups** tab.
3. Select the S3 destination.
4. Set the Cron schedule for automated daily snapshots:
   ```cron
   0 2 * * *
   ```
   *(Runs at 02:00 AM daily; dumps `.sql.gz` archives to S3).*

#### 2. Coolify Restore Runbook:
1. Download the target `.sql.gz` snapshot from your S3 backup destination.
2. Transfer the file to the VPS:
   ```bash
   scp backup.sql.gz user@your-vps-ip:/tmp/backup.sql.gz
   ```
3. SSH into the VPS and locate the PostgreSQL container:
   ```bash
   docker ps | grep postgres
   ```
4. Restore the snapshot into the active database:
   ```bash
   gunzip -c /tmp/backup.sql.gz | docker exec -i <container_name> psql -U <db_user> -d <db_name>
   ```

---

### Model C: Local Development Backup & Restore

For local development using Docker Compose:

#### 1. Create a Local Snapshot:
```bash
# Dump the zeroabstraction database from the running container
docker exec -t zeroabstraction-postgres-1 pg_dump -U postgres zeroabstraction | gzip > "zeroabstraction_local_$(date +%Y%m%d).sql.gz"
```

#### 2. Restore Local Snapshot:
```bash
# Terminate existing connections, drop and recreate clean database if needed
docker exec -i zeroabstraction-postgres-1 psql -U postgres -c "DROP DATABASE IF EXISTS zeroabstraction;"
docker exec -i zeroabstraction-postgres-1 psql -U postgres -c "CREATE DATABASE zeroabstraction;"

# Pipe the gzipped dump back into the container
gunzip -c "zeroabstraction_local_<date>.sql.gz" | docker exec -i zeroabstraction-postgres-1 psql -U postgres -d zeroabstraction
```

---

## 2. Media Backups (Cloudflare R2 & Local MinIO)

All uploaded photographs, astrophotography files, and media attachments reside in object storage.

### Production: Cloudflare R2 Protection

Cloudflare R2 offers 11 9's of durability against hardware loss, but requires precautions against accidental admin deletion, app bugs, or malicious overwrites.

#### 1. Object Versioning (Primary Protection):
1. In the Cloudflare dashboard, select your R2 bucket (`zeroabstraction-media`).
2. Navigate to **Settings -> Object Versioning** and enable it.
3. If an asset is accidentally deleted from the Payload Admin panel, previous versions remain recoverable via the Cloudflare dashboard or API.

#### 2. Offsite Sync via rclone (Disaster Recovery):
Periodically mirror the R2 bucket to an independent backup location (e.g. Backblaze B2 or a local backup drive):
```bash
# Sync R2 bucket to a secondary B2 bucket
rclone sync r2:zeroabstraction-media b2:zeroabstraction-media-backup --fast-list -v
```

---

### Local: MinIO Bucket Backup & Restore

For local testing with the Docker Compose MinIO container (`zeroabstraction-minio-1` on port `9000`):

#### 1. Backup Local Media Bucket:
```bash
# Export all objects from the local zeroabstraction-media bucket to a local folder
docker exec zeroabstraction-createbuckets-1 /usr/bin/mc mirror myminio/zeroabstraction-media /data/backup_media
```

#### 2. Restore Local Media Bucket:
```bash
# Restore files back into the local MinIO bucket
docker exec zeroabstraction-createbuckets-1 /usr/bin/mc mirror /data/backup_media myminio/zeroabstraction-media
```

---

## 3. Disaster Recovery Verification Checklist

To confirm backup viability before a crisis occurs:
- [ ] Verify test database dump restores into an empty database without syntax or constraint errors.
- [ ] Run `npm run payload:migrate` on the restored database to confirm migration state table is intact.
- [ ] Ensure public pages load and render articles from the restored database.
- [ ] Verify sample image in the restored media bucket is accessible via presigned/public URL.
