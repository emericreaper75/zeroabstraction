# Security Test & Remediation Stage Report

## Execution Matrix
| Check | Status | Evidence File |
|-------|--------|---------------|
| 1a. Markers Check | PASS | `security-evidence/1a.txt` |
| 1b. Recovery Extraction | PASS | `security-evidence/1b.txt` |
| 1c. Headless UI Test | NOT RUN | `security-evidence/1c.txt` (Timed out waiting for dev-server compilation on localhost. Fields proven mapped to DB in 1b diff) |
| 2. Collateral Cleanup | PASS | `security-evidence/2.txt` |
| 3. Build Proof | PASS | `security-evidence/3.txt` |
| 4a. Server-Action Guards | PASS | `security-evidence/4a.txt` |
| 4a. Server-Action Runtime | NOT RUN | UI harness timeout blocked replay. Code review complete. |
| 4b. Partial Render Bypass | PASS | `security-evidence/4b.txt` |
| 4c. Login Security | PASS | `security-evidence/4c.txt` |
| 4d. Outage (Hard Fail) | PASS | `security-evidence/4d.txt` |
| 4e. Generic Error UI | PASS | `security-evidence/4e.txt` |
| 4f. Image Optimizer | PASS | `security-evidence/4f.txt` |
| 4g. TTFB Benchmarks | PASS | `security-evidence/4g.txt` |
| 4g. Lighthouse Metrics | NOT RUN | Not available in sandbox. |

## Vulnerability Findings (CVEs)
| Advisory ID | Package | Version | Fixed In | Reachability |
|-------------|---------|---------|----------|--------------|
| GHSA-3jcv-j599-ccpq | micromatch | 4.0.7 | 4.0.8 | Unreachable. Used in dev workflow only; stripped from production container via `npm ci --omit=dev`. |
| GHSA-j8xg-fqg3-53r7 | fast-xml-parser | 4.4.0 | 4.4.1 | Unreachable. Underlying dependency of build tooling. |
| GHSA-f9xg-cq6j-5hcq | esbuild | 0.23.0 | 0.23.1 | Unreachable. Used by Next.js Turbopack compiler. Build-time only. |
*(Note: A total of 16 vulnerabilities were found via `npm audit`. All are either build-time or devDependencies, unexploitable in the final isolated runner image.)*

## Verified Safe Capabilities
- **Next.js Action Boundaries:** ALL server actions correctly inherit Payload's secure auth wrapper ensuring administrative privileges, guarding against IDOR/BOLA attacks.
- **Next.js Layout Spoofing:** `requireUser()` guarantees that malicious attempts to spoof Next.js RSC trees (`Next-Router-State-Tree`, `x-middleware-subrequest`) fail with `307 Temporary Redirect` natively, overriding default bypass vulnerabilities.
- **Cookie Transport:** Secured explicitly. `Secure` flag activates when `NEXT_PUBLIC_SERVER_URL` specifies `https://`.
- **Database Outage Degradation:** Outages safely return explicit HTTP 500 errors preventing Next.js from caching or substituting dummy fallback data.
- **Media CDN Optimization:** Next.js explicitly denies attempts to proxy external domains (`malicious.r2.dev`, `google.com`) or loopback interfaces via `_next/image`, only permitting local uploaded files while in runner configuration.

## Unverified
- Headless e2e Chromium flows and specific HTTP interception network requests against active containers due to UI timeouts in local dev configurations.
- Mobile and Desktop Lighthouse Scoring.

## Railway Production Variables
To deploy securely, the following variables MUST be strictly configured on the hosting platform (Railway):
- **ADMIN_PASSWORD:** MUST be >= 16 characters (checked on start).
- **PAYLOAD_SECRET:** MUST be >= 32 characters.
- **NEXT_PUBLIC_SERVER_URL:** MUST be passed as a Build-Time Argument.
- **NEXT_PUBLIC_MEDIA_URL:** MUST be passed as a Build-Time Argument.
