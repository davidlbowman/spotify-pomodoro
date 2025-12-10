# Stage 1: Build with Node (better-sqlite3 needs node-gyp)
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install bun for the build process
RUN npm install -g bun

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# Stage 2: Production with Bun
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create data directory for SQLite
RUN mkdir -p /app/data

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENV HOST=0.0.0.0
ENV PORT=2500

EXPOSE 2500

VOLUME ["/app/data"]

CMD ["bun", "run", "./dist/server/entry.mjs"]
