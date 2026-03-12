FROM node:20-alpine AS base

# Install dependencies for FFmpeg
RUN apk add --no-cache ffmpeg

FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/backend/package.json apps/backend/package.json* ./

# Install dependencies
RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .

# Generate Prisma client
RUN cd apps/backend && npx prisma generate

# Build backend
RUN cd apps/backend && npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Copy built files
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/package.json ./apps/backend/

# Set ownership
RUN chown -R nodeuser:nodejs /app

USER nodeuser

WORKDIR /app/apps/backend

EXPOSE 4000

CMD ["node", "dist/index.js"]
