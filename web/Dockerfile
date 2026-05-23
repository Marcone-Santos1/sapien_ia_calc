# ============================================
# Base Stage
# ============================================

ARG NODE_VERSION=22-alpine
FROM node:${NODE_VERSION} AS base

# Install libc6-compat for Next.js, and openssl for Prisma compatibility on Alpine
RUN apk add --no-cache libc6-compat openssl curl

# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

FROM base AS dependencies

WORKDIR /app

# Copy package-related files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install project dependencies
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable yarn && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
    else echo "No lockfile found." && exit 1; \
    fi

# ============================================
# Stage 2: Build Stage
# ============================================

FROM base AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_MICROSERVICE_URL
ARG NEXT_PUBLIC_SCAPER_API_KEY

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_MICROSERVICE_URL=$NEXT_PUBLIC_MICROSERVICE_URL
ENV NEXT_PUBLIC_SCAPER_API_KEY=$NEXT_PUBLIC_SCAPER_API_KEY

ENV NODE_ENV=production

# Build-time secrets para Prisma/Next.js pre-rendering (apenas na etapa de build, não vai para a imagem final)
ARG DATABASE_URL
ARG DIRECT_URL

ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL

# Variáveis fictícias (dummy) para passar pelo pre-rendering estático de APIs
ENV GEMINI_API_KEY="dummy_key_build"

RUN npx prisma generate
RUN npm run build

# ============================================
# Stage 3: Runner Stage
# ============================================

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Create next user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Leverages output traces for standalone mode
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]