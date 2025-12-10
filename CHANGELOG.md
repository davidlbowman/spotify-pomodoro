# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-12-10

### Added

- Session statistics dashboard with metrics (pomodoros, focus time, streaks, overtime)
- SQLite database for session persistence (Drizzle ORM)
- Timer presets: Classic (25/5), Long (50/10), Short (15/3)
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

[0.2.0]: https://github.com/davidlbowman/spotify-pomodoro/releases/tag/v0.2.0
[0.1.0]: https://github.com/davidlbowman/spotify-pomodoro/releases/tag/v0.1.0
[0.0.2]: https://github.com/davidlbowman/spotify-pomodoro/releases/tag/v0.0.2
[0.0.1]: https://github.com/davidlbowman/spotify-pomodoro/releases/tag/v0.0.1
