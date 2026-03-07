# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./
COPY turbo.json ./
COPY tsconfig.base.json ./

# Copy workspaces
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install all deps (workspaces)
RUN npm install --legacy-peer-deps

# Build the web app
RUN npm run build --workspace=apps/web

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# SPA fallback: all routes → index.html
RUN echo 'server { \
  listen 8080; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
