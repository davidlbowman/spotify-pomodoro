# Contributing to Spotify Pomodoro

Thank you for your interest in contributing! This guide covers the development environment setup, code conventions, and PR process.

## Development Environment

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A text editor with TypeScript support
- A Spotify Developer account (optional, for music integration)

### Setup

```bash
# Clone and install
git clone https://github.com/davidlbowman/spotify-pomodoro.git
cd spotify-pomodoro
bun install

# Initialize database
bun run db:migrate

# Run tests
bun run test

# Start development server
bun run dev
```

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run lint, typecheck, and tests
4. Submit a PR

```bash
# Ensure code quality before committing
bun run lint:fix && bun run typecheck && bun run test
```

### Docker Development

You can also develop using Docker:

```bash
# Start dev server with hot reload
docker compose -f docker-compose.dev.yml up

# Rebuild after dependency changes
docker compose -f docker-compose.dev.yml up --build
```

The dev container mounts your local files, so changes reflect immediately.

## Code Style

### Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
bun run lint        # Check for issues
bun run lint:fix    # Auto-fix issues
```

### Comments

**Use JSDoc only.** No inline comments (`// ...`) or block comments (`/* ... */`).

```typescript
/**
 * Fetches user playlists from Spotify.
 *
 * @since 0.0.1
 * @category Services
 */
const fetchPlaylists = Effect.gen(function* () {
  const client = yield* SpotifyClient;
  return yield* client.getPlaylists;
});
```

Required JSDoc tags:
- `@module` at file level (top of each file)
- `@since` version tag on all exports
- `@category` to group related items (Services, Errors, Schemas, Hooks)

### TypeScript

- Enable strict mode
- Prefer `const` over `let`
- Use `readonly` for immutable properties
- Avoid `any` - use `unknown` with type guards

## Effect-TS Patterns

This project uses [Effect-TS](https://effect.website/) for functional programming patterns.

### Services

All services use `Effect.Service` with the following conventions:

```typescript
import { Effect } from "effect";

/**
 * Example service with dependency injection.
 *
 * @since 0.0.1
 * @category Services
 */
export class MyService extends Effect.Service<MyService>()("MyService", {
  accessors: true,
  effect: Effect.gen(function* () {
    const config = yield* AppConfig;

    const doSomething = Effect.gen(function* () {
      return config.value;
    });

    return { doSomething };
  }),
  dependencies: [AppConfig.Default],
}) {}
```

Key points:
- Always include `accessors: true` (except config services using `sync`)
- Include JSDoc with `@since` and `@category` tags
- Declare dependencies explicitly in the `dependencies` array

### Error Types

Use `Schema.TaggedError` for type-safe error handling:

```typescript
import { Schema } from "effect";

/**
 * Error when Spotify API request fails.
 * @since 0.0.1
 * @category Errors
 */
export class SpotifyApiError extends Schema.TaggedError<SpotifyApiError>()(
  "SpotifyApiError",
  {
    message: Schema.String,
    statusCode: Schema.optionalWith(Schema.Number, { as: "Option" }),
  },
) {}
```

### Layer Composition

Compose services using Layers:

```typescript
const FullLayer = Layer.mergeAll(ServiceA.Default, ServiceB.Default).pipe(
  Layer.provide(ConfigLayer),
  Layer.provide(HttpClient.layer),
);
```

## Testing

This project uses [Vitest](https://vitest.dev/) with [@effect/vitest](https://effect.website/docs/guides/testing) for testing Effect services.

### Running Tests

```bash
bun run test        # Run once
bun run test:watch  # Watch mode
```

### Writing Tests

```typescript
import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";

describe("MyService", () => {
  it.effect("does something", () =>
    Effect.gen(function* () {
      const result = yield* MyService.doSomething;
      expect(result).toBe("done");
    }).pipe(Effect.provide(MyService.Default)),
  );
});
```

## Database Changes

The project uses SQLite with Drizzle ORM. When making schema changes:

1. Modify schema in `src/db/schema.ts`
2. Generate migration: `bun run db:generate`
3. Review the SQL in `src/db/migrations/`
4. Apply migration: `bun run db:migrate`
5. Include the migration file in your PR

Useful commands:

- `bun run db:studio` - Open database GUI
- `bun run db:clean` - Clear all data

## Project Structure

```
spotify-pomodoro/
├── src/
│   ├── pages/              # Astro pages and API routes
│   │   └── api/            # REST API endpoints
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # React hooks
│   ├── effect/
│   │   ├── services/       # Effect services
│   │   ├── schema/         # Effect Schema definitions
│   │   └── errors/         # Tagged error types
│   ├── db/                 # Database schema and migrations
│   ├── lib/                # Utility functions
│   └── styles/             # Global CSS
├── test/                   # Test files
├── scripts/                # Utility scripts
└── public/                 # Static assets
```

## Pull Request Process

1. **Branch naming**: Use descriptive names like `feat/volume-control` or `fix/timer-reset`

2. **Commit messages**: Use conventional commit format:
   - `feat: add volume control slider`
   - `fix: handle timer overflow`
   - `refactor: extract timer logic`
   - `docs: update README`

3. **PR checklist**:
   - [ ] Code passes `bun run lint`
   - [ ] Code passes `bun run typecheck`
   - [ ] Code passes `bun run test`
   - [ ] JSDoc comments for public APIs
   - [ ] No inline/block comments (JSDoc only)
   - [ ] Database migrations included (if schema changed)

4. **Review process**: PRs require one approval before merging

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes to UI or behavior
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Questions?

Open an issue or discussion on GitHub.
