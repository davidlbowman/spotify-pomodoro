# Contributing to Spotify Pomodoro

Thank you for your interest in contributing! This guide covers the development environment setup, code conventions, and PR process.

## Development Environment

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A text editor with TypeScript support
- A Spotify Developer account (for testing)

### Setup

```bash
# Clone and install
git clone https://github.com/davidlbowman/spotify-pomodoro.git
cd spotify-pomodoro
bun install

# Run type checking
bun run typecheck

# Start development server
bun run dev
```

### Development Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Run lint and typecheck
4. Submit a PR

```bash
# Ensure code quality before committing
bun run lint:fix && bun run typecheck
```

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
// Good
/**
 * Fetches user playlists from Spotify.
 * @since 0.0.1
 * @category Services
 */
const fetchPlaylists = Effect.gen(function* () {
  // ...
});

// Bad
// Fetch playlists from Spotify
const fetchPlaylists = Effect.gen(function* () {
  /* implementation */ // inline comment
});
```

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
 * Description of the service.
 * @since 0.0.1
 * @category Services
 */
export class MyService extends Effect.Service<MyService>()("MyService", {
  accessors: true,
  effect: Effect.gen(function* () {
    // Dependency injection
    const config = yield* SpotifyConfig;

    // Define methods
    const doSomething = Effect.gen(function* () {
      // Implementation
    });

    return { doSomething };
  }),
  dependencies: [SpotifyConfig.Default],
}) {}
```

Key points:
- Always include `accessors: true` (except for config services using `sync`)
- Include JSDoc with `@since` and `@category` tags
- Declare dependencies explicitly

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
  }
) {}
```

### Layer Composition

Compose services using Layers:

```typescript
const FullLayer = Layer.mergeAll(
  ServiceA.Default,
  ServiceB.Default,
).pipe(
  Layer.provide(ConfigLayer),
  Layer.provide(HttpClient.layer),
);
```

## Project Structure

```
spotify-pomodoro/
├── src/
│   ├── pages/              # Astro pages
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # React hooks
│   ├── effect/
│   │   ├── services/       # Effect services
│   │   ├── schema/         # Effect Schema definitions
│   │   └── errors/         # Tagged error types
│   ├── lib/                # Utility functions
│   └── styles/             # Global CSS
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
   - [ ] JSDoc comments for public APIs
   - [ ] No inline/block comments (JSDoc only)

4. **Review process**: PRs require one approval before merging

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes to UI or behavior
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Questions?

Open an issue or discussion on GitHub.
