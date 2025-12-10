# Stage 1: Build
FROM oven/bun:1-slim AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# Stage 2: Production
FROM oven/bun:1-slim AS production

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy migration files and config for db:migrate
COPY --from=builder /app/src/db/migrations ./src/db/migrations
COPY --from=builder /app/drizzle.config.ts ./

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Create data directory for SQLite
RUN mkdir -p /app/data

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENV HOST=0.0.0.0
ENV PORT=2500

EXPOSE 2500

VOLUME ["/app/data"]

ENTRYPOINT ["./docker-entrypoint.sh"]
