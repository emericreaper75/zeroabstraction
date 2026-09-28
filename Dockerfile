FROM node:22.23.2-slim AS base

WORKDIR /app

# Dependencies stage (installs all dependencies for build and development)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Development stage (target for docker compose local development)
FROM deps AS development
COPY . .
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "npm run payload:migrate && npm run generate:types && npm run dev:app"]

# Builder stage (compiles production Next.js assets)
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ARGs exposed as ENV to bake into the Next.js production build
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_MEDIA_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL
ENV NODE_ENV=production
ENV PAYLOAD_SECRET=dummy-build-secret-value-never-used-in-production-1234567890
ENV NEXT_BUILD=true

RUN npm run build

# Production runner stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install curl for container healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application and static assets from builder (with correct permissions)
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/src ./src
COPY --from=builder --chown=node:node /app/next.config.mjs ./next.config.mjs
COPY --from=builder --chown=node:node /app/tsconfig.json ./tsconfig.json

# Switch to non-root user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["sh", "-c", "npm run payload:migrate && npm run start:app"]
