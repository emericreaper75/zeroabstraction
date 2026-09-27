# ZeroAbstraction

A personal universe and digital garden exploring theoretical physics, electrical and computer engineering (ECE), and astrophysics. Built with Next.js 16 (App Router + Turbopack), Payload CMS 3.x, and PostgreSQL.

---

## Architecture Overview

- **Web Substrate:** Next.js 16 App Router (React Server Components, Turbopack, View Transitions)
- **Headless Content Core:** Payload CMS 3.x with PostgreSQL (Drizzle ORM)
- **Object Storage:** Cloudflare R2 ($0 egress fees) via S3-compatible API
- **Observatory Admin:** Custom-built observatory dashboard at `/admin` with real-time telemetry, server actions, and media asset management
- **Container Target:** Docker Compose for local development; Coolify on Hetzner CX22 / Railway for production

---

## Prerequisites

- **Docker & Docker Compose**: v2.20+ (The only required tool to run the entire stack locally)
- **Git**

*(Node.js v20+ is optional for host-level linting/typechecking; all runtime services, database, migrations, and development servers run inside Docker).*

---

## Local Setup Instructions

> [!IMPORTANT]
> **Docker is the Standard Local Workflow**:
> Running Next.js, Payload, and PostgreSQL in Docker ensures:
> - **Consolidated Port:** The public site, custom admin dashboard, and Payload REST API are all served on port `3000`.
> - **Consistent Environment:** Identical PostgreSQL 16 Alpine and Node.js versions.
> - **Zero Host Clutter:** No host-level database installation or configuration required.
> - **Automatic Migrations:** Database migrations execute automatically when the container boots.

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

### 3. Start the Stack
Run the following command to build the app image, start PostgreSQL, run pending migrations automatically, and launch Next.js:
```bash
docker compose up --build
```
*(Add `-d` to run in daemon mode: `docker compose up --build -d`)*

### 4. Access the Application
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Observatory Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Payload REST API**: [http://localhost:3000/api](http://localhost:3000/api)

---

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Architecture & Design System](docs/architecture.md)
- [Production Deployment Guide](docs/deployment.md)
- [Cloudflare R2 Storage Guide](docs/operations/R2_SETUP.md)
- [Content Authoring & Editorial Guide](docs/content-guide.md)
- [Security & Quality Audit Report](docs/audit/AUDIT_REPORT.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## Scripts & Operations

| Command | Description |
| :--- | :--- |
| `docker compose up --build` | Starts database and web application in live development mode |
| `docker compose down` | Stops containers and preserves database volume |
| `docker compose down -v` | Destroys containers and wipes local database volume |
| `docker exec -it zeroabstraction-app-1 npm run build` | Runs full Next.js production build and type checking |
| `docker exec -it zeroabstraction-app-1 npm run payload:migrate` | Runs pending database migrations |
| `docker compose exec postgres pg_dump -U postgres zeroabstraction > backup.sql` | Takes a live PostgreSQL snapshot |
