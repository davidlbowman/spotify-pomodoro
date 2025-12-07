# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.0.1]: https://github.com/davidlbowman/spotify-pomodoro/releases/tag/v0.0.1
