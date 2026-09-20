# ZeroAbstraction

A personal universe and digital garden exploring theoretical physics, electrical and computer engineering (ECE), and astrophysics. Built with Next.js 15 (App Router), Payload CMS 3.x, and PostgreSQL.

---

## Prerequisites

- **Docker & Docker Compose**: v2.20+ (The only required tool to run the entire stack locally)
- **Git**

*(Node.js v20+ is optional if you wish to run host-level linting/typechecking; all runtime services, database, migrations, and development servers run inside Docker).*

---

## Local Setup Instructions

> [!IMPORTANT]
> **Docker is the Only Supported Local Workflow**:
> Running Next.js, Payload, or PostgreSQL directly on the host machine is deprecated and unsupported. Using Docker ensures:
> - **Single Consolidated Port**: The public site and Payload REST API are served on port `3000`, eliminating stray processes or split ports.
> - **Consistent Environment**: Containerized PostgreSQL and Node.js environments match across all developer machines.
> - **Zero Host Clutter**: No need to install, configure, or start a local PostgreSQL service on your host machine.
> - **Automatic Migrations**: Database migrations execute automatically when the container boots.
>
> Running `npm run dev` from the host will automatically trigger `docker compose up --build`.

Bring up the entire stack with a single command:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/zeroabstraction.git
cd zeroabstraction
```

### 2. Configure Environment Variables
Copy the example environment file to `.env`:
```bash
cp .env.example .env
```
Default local `.env` configuration:
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/zeroabstraction
PAYLOAD_SECRET=this-is-a-placeholder-secret-for-development
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ADMIN_EMAIL=admin@localhost.dev
ADMIN_PASSWORD=change-me-in-local-env

# Storage: Local disk storage used for development
S3_ENABLED=false
```
> [!IMPORTANT]
> Never commit `.env` or any production secrets to Git.

### 3. Start the Stack (Single Command)
Run the following command to build the app image, start the PostgreSQL container, wait for healthiness, execute pending migrations automatically, and launch Next.js in live-reload development mode:
```bash
docker compose up --build
```
*(Or simply run `npm run dev` from the repository root, which executes this command. Add `-d` to run in background mode: `docker compose up --build -d`)*

### 4. Access the Application (Single Port)
Only the consolidated application port (`3000`) is exposed to the host:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Payload REST API**: [http://localhost:3000/api](http://localhost:3000/api)
- Payload's built-in `/admin` panel is **not mounted**. A custom admin UI will consume Payload as a headless API.
- The single admin user is seeded on first boot from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 5. Stopping and Teardown
- **Stop containers (preserves database content in volume)**:
  ```bash
  docker compose down
  ```
- **Reset database and start completely fresh**:
  ```bash
  docker compose down -v
  ```

### 6. Optional: Host Database Access for GUI Clients
By default, the database is kept private to the Docker bridge network to avoid host port collisions. If you wish to connect to PostgreSQL from a host GUI client (TablePlus, DBeaver, etc.):
1. Uncomment `ports: - '5434:5432'` in `docker-compose.yml`.
2. Connect using `postgresql://postgres:postgres@localhost:5434/zeroabstraction`.

### 7. Backend verification
```bash
docker compose exec app npm run test:backend
```

---

## Testing & Verification

Run automated test suites and local collection integrity checks inside Docker:
```bash
# Verify Payload collections, relations, draft/publish flows, and teardown
docker compose exec app npm run test:backend

# Validate clean production build and TypeScript compilation
docker compose exec app npm run build
```
For detailed checklists and past test runs, see [TESTING_LOG.md](TESTING_LOG.md).

---

## Database Migrations Workflow

Auto-sync is disabled (`push: false`) to ensure deterministic schema evolution:
1. **Generate a migration**:
   ```bash
   docker compose exec app npm run payload:migrate:create -- --file <migration_name>
   ```
2. **Apply migrations**:
   Migrations run automatically on container startup. To apply manually at any time:
   ```bash
   docker compose exec app npm run payload:migrate
   ```

---

## Architecture & Operations Documentation

Comprehensive documentation for architecture, deployment, infrastructure, and disaster recovery:

- [ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md): Architectural decision record (ADR) explaining why Next.js + Payload + PostgreSQL was chosen, alternative evaluations, and design boundaries.
- [DEPLOYMENT_VALIDATION.md](DEPLOYMENT_VALIDATION.md): Production deployment guide (Coolify/Docker standalone), environment variable setup, verification checklist, and Git rollback procedures.
- [INFRASTRUCTURE_NOTES.md](INFRASTRUCTURE_NOTES.md): Hosting, database (Neon/Supabase/Aiven), and object storage (Cloudflare R2/B2) comparison, secrets management, and actual free-tier usage tracking.
- [BACKUP_AND_RESTORE.md](BACKUP_AND_RESTORE.md): Database and media backup and recovery runbooks for both local development and production.
- [TESTING_LOG.md](TESTING_LOG.md): Comprehensive testing checklists covering auth, collections, relations, media storage, and public page rendering.
# zeroabstraction
