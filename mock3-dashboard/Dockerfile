# Stage 1: Build
FROM node:22-alpine AS builder

RUN npm install -g pnpm@11.11.0

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.node.json ./
COPY index.html vite.config.ts components.json ./
COPY src ./src
COPY public ./public

ARG VITE_API_URL=http://localhost:8080
ARG VITE_CLERK_PUBLISHABLE_KEY=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN pnpm run build

# Stage 2: Serve
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
