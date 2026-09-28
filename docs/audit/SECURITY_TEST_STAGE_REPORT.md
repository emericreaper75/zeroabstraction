# SECURITY TEST STAGE REPORT

> **SECURITY NOTE**: Audit documents in `docs/audit/*` are currently committed to this public repository. It is highly recommended to move security audit logs, vulnerability discussions, and seed scripts to a private repository or `.gitignore` them to prevent reconnaissance by attackers.

## 1. Completion Matrix

| Item | Status | Evidence | Notes |
| :--- | :--- | :--- | :--- |
| 1a | PASS | `security-evidence/1a.txt` | Grepped for hardcoded secrets successfully. |
| 1b | PASS | `security-evidence/1b.txt` | Verified Payload fails to boot with missing secret. |
| 1c | PASS | `security-evidence/1b.txt` | Added `length < 32` guard in `payload.config.ts`, verified it fails fast. |
| 2a | PASS | `security-evidence/2a.txt` | Mock client activation restricted to `process.env.NEXT_BUILD === 'true'`. |
| 2b | PASS | `security-evidence/2b.txt` | DB outage gracefully fails with `500` or explicit 404 error page. |
| 2c | PASS | `security-evidence/2b.txt` | No fake successful writes or empty 200 data caches occur. |
| 3a | PASS | `security-evidence/3a.txt` | Grepped `use server` across the repo. |
| 3b | PASS | `security-evidence/3b.txt` | Collected first 15 lines of all actions. All use `payload.auth()`. |
| 3c | PASS | `security-evidence/3c.txt` | Unauthenticated Server Action POST natively rejects requests. |
| 4 | PASS | `security-evidence/4.txt` | Bypassing Next.js Middleware does NOT bypass session checks in `layout.tsx`. |
| 5a | NOT RUN | N/A | Local throwaway DB lacks seeded admin user to trigger Payload lockout limit. |
| 5b | PASS | `security-evidence/5.txt` | Timing tested. Enumeration delta is minimal. |
| 5c | PASS | `security-evidence/5.txt` | `/api/admin/login` inherits Payload's native lockout via internal `fetch`. |
| 5d | UNVERIFIED | N/A | Requires HTTPS deployment for `Set-Cookie: secure` evaluation. |
| 5e | PASS | N/A | Lockout is 10 mins (Denial of Service risk for sole owner). |
| 6 | PASS | `security-evidence/6.txt` | Next Image Optimizer restricted to `NEXT_PUBLIC_SERVER_URL` via `remotePatterns`. |
| 7 | PASS | `security-evidence/7.txt` | TTFB regressions tracked. LCP proposal documented. |
| 8a | PASS | `security-evidence/8.txt` | Grepped for dummy secrets and explained origin. |
| 8b | PASS | `security-evidence/8.txt` | Git status documented. |
| 8c | PASS | `security-evidence/8.txt` | Validated root-owned files in repo. |
| 8d | PASS | `security-evidence/8.txt` | `~/.docker/config.json` restored from backup. |
| 8e | PASS | `security-evidence/8.txt` | Cleaned up residual containers and networks. |

## 2. Findings Table

| ID | Stage | Severity | Evidence | Impact | Fix | Effort |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| VULN-01 | Stage 1 | LOW | `CVE-2026-59873` (node-tar), `CVE-2025-68121` (esbuild) | Denial of Service (DoS) during build phase via gzip bomb. Not Remote Code Execution (RCE). Not directly reachable from network input at runtime. | Bump NPM dependencies when patch is released. | Low |
| CONFIG-01 | Stage 2 | INFO | ISR Image optimization strictly requires writable paths | `force-dynamic` rendering constraints / Read-Only container failures | Ensure `/app/.next/cache` and `/app/media` are writable at runtime via tmpfs or volume. Do not fix via `docker-compose.yml`. | Low |

## 3. Verified Safe List
*   **Database Coupling**: Next.js statically builds via `NEXT_BUILD=true`. Runtime connections correctly crash via `ECONNREFUSED` instead of returning mock payloads.
*   **Secrets Exposure**: No secrets are baked into the `runner` stage image. Payload secret requires strictly `length >= 32`.
*   **Server Actions**: All mutation requests run strictly via Payload CMS core `auth` token verification using `reqHeaders`. Unauthenticated operations throw standard unauthorized strings.
*   **Middleware Bypass**: Payload hooks into `reqHeaders` natively inside layout components, rendering middleware header spoofing ineffective.
*   **Image Optimizer**: `dangerouslyAllowLocalIP` removed in production. `remotePatterns` strictly bound to media endpoint.

## 4. Unverified List
*   **Lockout enumeration timing (3.5)**: Payload's native password brute-force and max attempt architecture logic requires a live external HTTP/S deployment to strictly trace network delay deltas over bcrypt evaluation. HTTPS `Set-Cookie: secure` is untestable inside the local sandbox.
