# Cloudflare R2 Object Storage Integration & Setup Guide

**Architecture Target:** Cloudflare R2 (S3-Compatible Object Storage)  
**Applicability:** Astrophotography plates, raw FITS stacks, spectra plots, and editorial media.

---

## 1. Why Cloudflare R2 for ZeroAbstraction?

- **Zero Egress Fees ($0.00 forever):** High-resolution astrophotography and scientific diagrams incur zero bandwidth egress fees regardless of traffic spikes or image sizes.
- **S3 API Compatibility:** Native compatibility with `@payloadcms/storage-s3`.
- **Generous Free Allowance (Sept 2026):**
  - 10 GB / month storage
  - 1,000,000 Class A operations (write/list) / month
  - 10,000,000 Class B operations (read) / month
  - Additional storage: $0.015 / GB-month

---

## 2. Required Environment Variables

To enable Cloudflare R2 in production, configure the following environment variables in your deployment environment (`.env.production` or Railway/Coolify environment settings):

```env
# Enable S3/R2 storage adapter
S3_ENABLED=true

# R2 Bucket Name (created in Cloudflare dashboard)
S3_BUCKET=zeroabstraction-media

# Cloudflare R2 API Tokens (Manage R2 API Tokens -> Create API Token with Object Read & Write permission)
S3_ACCESS_KEY_ID=your_cloudflare_r2_access_key_id
S3_SECRET_ACCESS_KEY=your_cloudflare_r2_secret_access_key

# R2 uses 'auto' region
S3_REGION=auto

# S3 Endpoint format: https://<account_id>.r2.cloudflarestorage.com
S3_ENDPOINT=https://<your_cloudflare_account_id>.r2.cloudflarestorage.com

# Optional: Custom Public CDN Domain (e.g. media.zeroabstraction.com)
# When set, media URLs resolve through Cloudflare edge caching
NEXT_PUBLIC_MEDIA_URL=https://media.zeroabstraction.com
```

---

## 3. Payload CMS Configuration Reference

Payload integrates `@payloadcms/storage-s3` in [`src/payload.config.ts`](../../src/payload.config.ts):

```typescript
if (process.env.S3_ENABLED === 'true') {
  plugins.push(
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true,
      },
    })
  )
}
```

---

## 4. Bucket CORS & Public Access Configuration

If serving media directly or uploading via signed URLs:

1. **In Cloudflare Dashboard:** Navigate to **R2** → Select bucket (`zeroabstraction-media`) → **Settings**.
2. **Public Access:** Connect a custom domain (e.g. `media.zeroabstraction.com`) or enable the `r2.dev` subdomain for development/staging.
3. **CORS Policy:**
```json
[
  {
    "AllowedOrigins": [
      "https://zeroabstraction.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 5. Verification & Testing

1. Set `S3_ENABLED=true` and corresponding credentials in your production `.env`.
2. Visit `/admin/collections/media`.
3. Click **Upload Plate** and upload an astrophotography sample.
4. Verify the plate appears in the asset grid and the image is fetched from the R2 endpoint or custom CDN domain.
