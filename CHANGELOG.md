# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-11

### Added

- Optional authentication for VPS deployments (#15)
- Login page with lofi aesthetic
- Stateless signed cookie authentication (HMAC-SHA256)
- Auth middleware protecting all routes when enabled
- 13 unit tests for Auth service (62 total)
- Docker convenience scripts (`bun run docker:dev`, `docker:down`, `docker:logs`)
- Playback error toast when Spotify device is unavailable
- robots.txt disallowing all crawlers

### Fixed

- Session recording now uses imperative API calls instead of reactive useEffect, eliminating duplicate entries in React StrictMode
- Stats now count completed pomodoros (after break ends) instead of completed focus sessions
- Environment variables now work in both dev (`import.meta.env`) and Docker production (`process.env`)

### Security

- Timing-safe credential comparison prevents timing attacks
- HttpOnly cookies prevent XSS token theft
- Cookie signature verification prevents tampering

### Configuration

New optional environment variables:
- `AUTH_ENABLED` - Enable authentication (default: false)
- `AUTH_PASSWORD` - Login password (username is always "admin")
- `AUTH_SECRET` - Secret for signing cookies

## [1.0.0] - 2025-12-10

### Added

- Timer presets: Short (15/3), Classic (25/5), Long (50/10)
- Docker Compose deployment for self-hosting
- Health check endpoint (`/api/health`) for container monitoring
- Coolify-compatible deployment
- Server-side OAuth PKCE flow for HTTP compatibility on local networks
- Astro sessions for secure PKCE state management
- PR template with CONTRIBUTING.md checklist

### Changed

- README rewritten for Docker-first deployment with local/HTTPS setup options
- Removed custom timer configuration (replaced with presets)
- Improved timer hint text clarity ("end early", "begin" instead of "skip")
- Switched from better-sqlite3 to libsql for cross-runtime compatibility

### Fixed

- DialogContent accessibility warning (added aria-describedby)
- OAuth flow works on HTTP for localhost/127.0.0.1 (Spotify requirement)

### Technical

- Multi-stage Dockerfile with `oven/bun:1-slim` base
- Production and development compose files
- SQLite persistence via Docker volume
- Server-side PKCE using Node crypto (bypasses browser secure context requirement)
- libsql client for Bun runtime compatibility

## [0.2.0] - 2025-12-10

### Added

- Session statistics dashboard with metrics (pomodoros, focus time, streaks, overtime)
- SQLite database for session persistence (Drizzle ORM)
- End early / skip workflow (removed pause functionality)
- REST API endpoints for session recording
- Unit tests with Vitest and @effect/vitest (49 tests)
- Database management scripts (db:migrate, db:clean, db:studio)

### Changed

- Timer flow: press E to end early, S to skip (no more pause)
- Astro now runs in SSR mode with Node adapter
- Help text shows contextual hints based on timer state

### Technical

- SessionRepository service for database operations
- Automatic session recording on phase transitions
- better-sqlite3 for Node.js compatibility

## [0.1.0] - 2025-12-10

### Fixed

- PKCE challenge not found error on initial Spotify authentication (#7)
- Spotify autoplay not working when Spotify app is already open but paused (#8)
- AudioContext autoplay policy warning in browser console

### Changed

- Development server now runs on port 2500
- AudioContext is lazy-initialized on first timer completion instead of on page load

### Dependencies

- Updated lucide-react

## [0.0.2] - 2025-12-07

### Fixed

- Vinyl record now spins immediately on first play (previously required double click)
- CSS `@import` order warning from PostCSS (moved Google Fonts import to top of file)
- README documentation now uses `127.0.0.1` instead of `localhost` for Spotify redirect URI

### Changed

- New lofi-style favicon (vinyl record with tomato/pomodoro center)

## [0.0.1] - 2025-12-07

### Added

- Pomodoro timer with configurable focus and break durations
- Overtime mode - timer counts up after completion so you decide when to take a break
- Spotify OAuth integration (PKCE flow)
- Playlist selection with auto-shuffle and repeat
- Phase badges (FOCUS/BREAK/OVERTIME) above timer display
- Light/dark theme toggle
- Keyboard controls (Space/Enter to start/pause, R to reset, S to switch phase)
- Audio notification when timer ends
- Lofi aesthetic UI design

### Technical

- Built with Astro, React, Tailwind CSS v4, and shadcn/ui
- State management with Effect-TS services
- Spotify Web API integration for playback control
- JSDoc documentation throughout codebase

[1.1.0]: https://github.com/davidlbowman/spotify-pomodoro/compare/1.0.0...1.1.0
[1.0.0]: https://github.com/davidlbowman/spotify-pomodoro/compare/0.2.0...1.0.0
[0.2.0]: https://github.com/davidlbowman/spotify-pomodoro/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/davidlbowman/spotify-pomodoro/compare/0.0.2...0.1.0
[0.0.2]: https://github.com/davidlbowman/spotify-pomodoro/compare/0.0.1...0.0.2
[0.0.1]: https://github.com/davidlbowman/spotify-pomodoro/releases/tag/0.0.1
