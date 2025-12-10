# Spotify Pomodoro

A lofi-styled pomodoro timer with Spotify integration and session tracking. Focus on your work while your favorite playlists play in the background.

## Features

- 25-minute focus / 5-minute break pomodoro timer
- Overtime mode - timer counts up after completion, you decide when to switch
- Session statistics - track your focus time, streaks, and overtime
- Spotify integration with playlist selection
- Auto-shuffle and repeat for continuous music
- Light/dark theme toggle
- Keyboard-first controls
- Audio notification when timer ends

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A Spotify Developer account (for music integration)

### 1. Clone and Install

```bash
git clone https://github.com/davidlbowman/spotify-pomodoro.git
cd spotify-pomodoro
bun install
```

### 2. Initialize the Database

```bash
bun run db:migrate
```

This creates the SQLite database at `data/pomodoro.db` for storing your session history.

### 3. Create a Spotify App (Optional)

Skip this step if you don't need Spotify integration.

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the details:
   - **App name:** Spotify Pomodoro
   - **Redirect URI:** `https://127.0.0.1:2500/callback`
   - **APIs used:** Check "Web API"
4. Copy the **Client ID** from your app's settings

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
PUBLIC_SPOTIFY_REDIRECT_URI=https://127.0.0.1:2500/callback
```

### 5. Start the Development Server

```bash
bun run dev
```

Open [https://localhost:2500](https://localhost:2500) in your browser.

## Keyboard Controls

| Key               | Action                                       |
| ----------------- | -------------------------------------------- |
| `Space` / `Enter` | Start timer                                  |
| `E`               | End current session early (during countdown) |
| `S`               | Skip to next phase (during overtime)         |
| `R`               | Reset timer (when stopped)                   |

## Available Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `bun run dev`        | Start development server     |
| `bun run build`      | Build for production         |
| `bun run test`       | Run tests                    |
| `bun run lint`       | Check for linting issues     |
| `bun run typecheck`  | Run TypeScript type checking |
| `bun run db:migrate` | Apply database migrations    |
| `bun run db:clean`   | Clear all session data       |
| `bun run db:studio`  | Open database GUI            |

## Data Persistence

Session data is stored locally in `data/pomodoro.db` (SQLite). This directory is gitignored.

**Important:** The database is local to your machine. If you delete the `data/` folder or clone fresh, you'll start with an empty database. Future versions will support Docker for easier data persistence across updates.

To reset your data:

```bash
bun run db:clean
```

## Tech Stack

- **Runtime:** Bun
- **Framework:** Astro with React (SSR)
- **Database:** SQLite with Drizzle ORM
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Effect-TS
- **Testing:** Vitest with @effect/vitest
- **Linting:** Biome

## Troubleshooting

### "Invalid redirect URI"

Make sure the redirect URI in your Spotify app settings exactly matches `PUBLIC_SPOTIFY_REDIRECT_URI` in your `.env` file.

### "No active device"

Spotify requires an active device to control playback. Open Spotify on your computer or phone before selecting a playlist.

### Timer notification not playing

Browser autoplay policies may block audio. Interact with the page before the timer ends to enable audio.

### Database errors

If you see database errors, try:

```bash
rm -rf data/
bun run db:migrate
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT
