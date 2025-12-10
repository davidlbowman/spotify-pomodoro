# Spotify Pomodoro

A self-hosted pomodoro timer with Spotify integration and a lofi aesthetic. Focus on your work while your favorite playlists play in the background.

## Features

- Timer presets: Short (15/3), Classic (25/5), Long (50/10)
- Overtime mode - timer counts up after completion, you decide when to switch
- Session statistics - track your focus time, streaks, and overtime
- Spotify integration with playlist selection
- Light/dark theme toggle
- Keyboard-first controls

## Quick Start with Docker

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the details:
   - **App name:** Spotify Pomodoro
   - **Redirect URI:** `http://YOUR_SERVER_IP:4321/callback`
   - **APIs used:** Check "Web API"
4. Copy the **Client ID** from your app's settings

### 2. Configure Environment

Create a `.env` file:

```bash
PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
PUBLIC_SPOTIFY_REDIRECT_URI=http://YOUR_SERVER_IP:4321/callback
```

### 3. Run with Docker Compose

```bash
docker compose up -d
```

Open `http://YOUR_SERVER_IP:4321` in your browser.

### Updating

```bash
docker compose pull
docker compose up -d
```

Your session data persists in the `pomodoro_data` volume.

## Deploy on Coolify

1. Create a new service from this repository
2. Set environment variables in Coolify's UI:
   - `PUBLIC_SPOTIFY_CLIENT_ID`
   - `PUBLIC_SPOTIFY_REDIRECT_URI` (use your Coolify domain: `https://pomodoro.yourdomain.com/callback`)
3. Update your Spotify app's redirect URI to match
4. Deploy

## Keyboard Controls

| Key               | Action                                       |
| ----------------- | -------------------------------------------- |
| `Space` / `Enter` | Start timer                                  |
| `E`               | End current session early (during countdown) |
| `S`               | Skip to next phase (during overtime)         |
| `R`               | Reset timer (when stopped)                   |

## Local Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup.

```bash
# Without Docker
bun install
bun run db:migrate
bun run dev

# With Docker
docker compose -f docker-compose.dev.yml up
```

## Data Persistence

Session data is stored in SQLite. When using Docker, data persists in the `pomodoro_data` volume.

To reset your data:

```bash
# Docker
docker compose down -v
docker compose up -d

# Local
bun run db:clean
```

## Tech Stack

- **Runtime:** Bun
- **Framework:** Astro with React (SSR)
- **Database:** SQLite with Drizzle ORM
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Effect-TS

## Troubleshooting

### "Invalid redirect URI"

Ensure the redirect URI in your Spotify app settings exactly matches `PUBLIC_SPOTIFY_REDIRECT_URI` in your environment.

### "No active device"

Spotify requires an active device to control playback. Open Spotify on your computer or phone before selecting a playlist.

### Container health check failing

Check logs with `docker compose logs`. Ensure port 4321 is not in use by another service.

## License

MIT
