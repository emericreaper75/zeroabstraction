# Deployment Validation: Next.js + Payload 3.x + PostgreSQL

This document records the results of the throwaway proof-of-concept deployment to confirm Docker standalone builds for Next.js + Payload 3.x with a PostgreSQL database.

## Validation Goals

1. **Docker Compatibility**: Confirm the platform supports a full Next.js + Payload app using Docker Compose.
2. **PostgreSQL Connectivity**: Confirm a PostgreSQL database can be provisioned and connected securely via environment variables.
3. **Production Mode Functionality**: Verify that the Next.js production build (`output: 'standalone'`) works and that the Payload admin panel loads properly in production mode.

## Results

**Status: WORKS (with a minor setup caveat)**

### 1. Docker Build & Next.js Standalone Mode
- The `Dockerfile` multi-stage build successfully produces a minimal Node.js standalone artifact.
- **Critical Discovery**: The Next.js build (`next build`) runs flawlessly *without* requiring an active database connection. Payload 3.x does not enforce DB connectivity during the build stage.

### 2. PostgreSQL Connection
- The Docker Compose stack successfully networks the `payload` container with the `postgres` container.
- Environment variables (`DATABASE_URL`, `POSTGRES_USER`, etc.) are respected securely.

### 3. Admin Panel
- The Next.js container boots quickly, and the admin panel is successfully accessible at `/admin`.
- **Caveat (Production DB Schema):** When running `NODE_ENV=production` inside the Docker container, Payload does *not* automatically generate/push the PostgreSQL schema.
  - *Symptom*: Visiting `/admin` crashes with `relation "users" does not exist` (Minified React Error #441).
  - *Workaround needed*: In a real production deployment, you must run schema migrations (`payload migrate`) or push the schema against the managed PostgreSQL database before starting the Next.js server, or utilize a CI/CD job to handle migrations prior to deploying the app image.

## Next Steps for the Real Application
- You can confidently proceed with the main codebase using Next.js 15, Payload 3, and PostgreSQL.
- Setup a migration strategy (`payload migrate:create`) to manage the schema during production deployments on Coolify.
