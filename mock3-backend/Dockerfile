# Stage 1: Build
FROM node:22-alpine AS builder

RUN npm install -g pnpm@11.11.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json drizzle.config.ts ./
COPY src ./src
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine

RUN npm install -g pnpm@11.11.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY drizzle.config.ts ./
COPY src/db/schema.ts ./src/db/schema.ts

EXPOSE 3001

CMD ["node", "dist/app.js"]
