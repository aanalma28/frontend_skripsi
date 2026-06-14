# === SENTINEL Frontend (AI-IPS Dashboard) ===
# Multi-stage build untuk image yang ringan

# --- Stage 1: Build ---
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies (layer cache optimization)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code & build SvelteKit
COPY . .
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:22-alpine

WORKDIR /app

# Copy built output dari adapter-node
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# Install production dependencies saja (jika ada)
RUN npm ci --omit=dev 2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=5173
ENV HOST=0.0.0.0

EXPOSE 5173

# Healthcheck: Pastikan frontend merespons
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:5173/ || exit 1

CMD ["node", "build"]
