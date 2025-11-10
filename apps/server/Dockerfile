FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json ./
COPY packages/api-types ./packages/api-types
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build packages
WORKDIR /app/packages/api-types
RUN pnpm build

# Build server
WORKDIR /app/apps/server
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/node_modules ./node_modules
COPY --from=builder /app/apps/server/package.json ./
COPY --from=builder /app/packages/api-types/dist ./node_modules/@campus-companion/api-types/dist
COPY --from=builder /app/packages/api-types/package.json ./node_modules/@campus-companion/api-types/

# Generate Prisma Client
COPY apps/server/prisma ./prisma
RUN cd /app && npx prisma generate

EXPOSE 3001

CMD ["node", "dist/main.js"]

