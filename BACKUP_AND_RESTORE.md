# Backup and Restore Procedures

This document outlines the backup and restore strategies for the Zero Abstraction project, utilizing Coolify for hosting the PostgreSQL database and Cloudflare R2 for media storage.

## 1. PostgreSQL Database Backups

Since the PostgreSQL database is hosted on a VPS managed by **Coolify**, we leverage Coolify's built-in scheduled backup functionality.

### Backup Configuration (Coolify)

1. **Configure Storage Destination**:
   - In your Coolify dashboard, navigate to the **Destinations -> S3 Storage** section.
   - Add a new S3 destination dedicated to backups (e.g., a separate Cloudflare R2 bucket, AWS S3, or Backblaze B2).
   - Enter the endpoint, access key, secret key, and bucket name.
2. **Enable Database Backups**:
   - Go to your PostgreSQL resource in the Coolify project.
   - Navigate to the **Backups** tab.
   - Select the S3 storage destination you created.
   - Set a Cron schedule for automated backups. For this project's scale, a daily backup is recommended: `0 2 * * *` (Runs at 02:00 AM every day).
   - Coolify will automatically create compressed `.sql.gz` dumps and push them to the designated bucket.

## 2. PostgreSQL Restore Process

If you need to restore the database from a backup (e.g., after catastrophic failure or data corruption), follow these steps:

### Step 1: Retrieve the Backup
- Download the appropriate `.sql.gz` backup file from your S3 backup bucket.
- Upload this file to your VPS (e.g., using `scp` or `rsync`).

### Step 2: Connect to the Server
- SSH into the VPS hosting the Coolify instance.

### Step 3: Restore the Database
Assuming your backup is a gzipped SQL file (`backup.sql.gz`), you can pipe it directly into the PostgreSQL Docker container managed by Coolify.

1. Find the container ID or name of your PostgreSQL database:
   ```bash
   docker ps | grep postgres
   ```
2. Run the restore command (replace `<container_name>`, `<db_user>`, and `<db_name>` with your actual values):
   ```bash
   gunzip -c backup.sql.gz | docker exec -i <container_name> psql -U <db_user> -d <db_name>
   ```
   *Note: If you need to wipe the existing database first, you may need to drop and recreate it, or use the `clean` option if it was generated with `pg_dump -c`.*

## 3. Media Backups (Cloudflare R2)

All media uploaded via Payload CMS is stored in **Cloudflare R2**.

### Durability vs. Backup
Cloudflare R2 provides 99.999999999% (11 9's) of annual durability, which protects against hardware failure on Cloudflare's end. However, high durability does **not** protect against:
- Accidental deletion via the Payload Admin panel.
- Malicious deletion or overwrites.
- Application bugs altering files.

### Recommended Media Protection Strategy

1. **Enable Object Versioning (Primary Protection)**:
   - In the Cloudflare dashboard, go to your R2 bucket settings.
   - Enable **Object Versioning**.
   - This ensures that if a file is deleted or overwritten, the previous version is retained and can be restored via the Cloudflare dashboard or API.

2. **Offsite Sync (Secondary Protection)**:
   - While versioning protects against accidental deletes, it's best practice to have a copy outside the primary provider.
   - Use `rclone` (a command-line cloud storage sync tool) to periodically mirror the R2 bucket to a local NAS or an alternative cheap storage provider like Backblaze B2.
   - Example `rclone` cron job (run weekly on a local machine or a small VPS):
     ```bash
     rclone sync r2:zeroabstraction-media b2:zeroabstraction-media-backup
     ```
