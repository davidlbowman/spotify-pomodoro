# Spotify Pomodoro

A Spotify-integrated pomodoro timer app with a lofi aesthetic.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Astro with React
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Effect-TS
- **Linting/Formatting**: Biome

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Check linting |
| `bun run lint:fix` | Fix linting issues |
| `bun run typecheck` | Run type checking |

## Project Structure

```
src/
├── pages/              # Astro pages
├── components/         # React components
│   └── ui/             # shadcn/ui components
├── hooks/              # React hooks (useTimer, useSpotify)
├── effect/
│   ├── services/       # Effect services (Timer, SpotifyClient, etc.)
│   ├── schema/         # Effect Schema definitions
│   └── errors/         # Tagged error types
├── lib/                # Utility functions
└── styles/             # Global CSS with Tailwind
```

## Code Conventions

### Comments

**Use JSDoc only.** No inline comments (`//`) or block comments (`/* */`).

```typescript
/**
 * Service description.
 * @since 0.0.1
 * @category Services
 */
export class MyService extends Effect.Service<MyService>()("MyService", {
  // ...
}) {}
```

Required JSDoc tags:
- `@module` at file level
- `@since` version tag on all exports
- `@category` to group related exports (Services, Errors, Schemas, Components, Hooks)

### Effect-TS Services

All services use `Effect.Service` pattern:
- Include `accessors: true` (except config services using `sync`)
- Declare dependencies explicitly in `dependencies` array
- Use `Schema.TaggedError` for error types

### Imports

- Use `@/` path alias for imports from `src/`
- Group imports: effect libs, third-party, local

### Astro/React

- React components need `client:load` directive in Astro for interactivity
- Keep components focused and composable

## Environment Variables

Required for Spotify integration:
- `PUBLIC_SPOTIFY_CLIENT_ID` - Spotify app client ID
- `PUBLIC_SPOTIFY_REDIRECT_URI` - OAuth callback URL

## Notes

- Biome is configured to skip Tailwind CSS files (global.css)
- Timer uses countdown then overtime behavior (counts up after hitting zero)
- Spotify playback requires an active device
