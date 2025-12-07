# Spotify Pomodoro

A lofi-styled pomodoro timer with Spotify integration. Focus on your work while your favorite playlists play in the background.

## Features

- Configurable focus and break durations (click the minutes to edit)
- Timer counts up after completion (overtime mode) - you decide when to take a break
- Spotify integration with playlist selection
- Auto-shuffle and repeat for continuous music
- Light/dark theme toggle
- Keyboard-first controls
- Audio notification when timer ends

## Local Development Setup

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A Spotify Developer account

### 1. Clone and Install

```bash
git clone https://github.com/davidlbowman/spotify-pomodoro.git
cd spotify-pomodoro
bun install
```

### 2. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in the details:
   - **App name:** Spotify Pomodoro (or whatever you prefer)
   - **App description:** Pomodoro timer with Spotify
   - **Redirect URI:** `http://localhost:4321/callback`
   - **APIs used:** Check "Web API"
4. Click "Save"
5. In your app's settings, copy the **Client ID**

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:4321/callback
```

Replace `your_client_id_here` with the Client ID from step 2.

### 4. Start the Development Server

```bash
bun run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### 5. Connect Spotify

1. Click the "spotify" button
2. Authorize the app with your Spotify account
3. Select a playlist and start focusing!

## Keyboard Controls

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Start/pause timer |
| `R` | Reset timer (when paused or in overtime) |
| `S` | Switch phase (when in overtime) |

## Tech Stack

- **Runtime:** Bun
- **Framework:** Astro with React
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Effect-TS
- **Linting:** Biome

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Check for linting issues |
| `bun run lint:fix` | Auto-fix linting issues |
| `bun run typecheck` | Run TypeScript type checking |

## Troubleshooting

### "Invalid redirect URI"

Make sure the redirect URI in your Spotify app settings exactly matches `PUBLIC_SPOTIFY_REDIRECT_URI` in your `.env` file, including the protocol (`http://` vs `https://`).

### "No active device"

Spotify requires an active device to control playback. Open Spotify on your computer or phone before selecting a playlist.

### Timer notification not playing

Browser autoplay policies may block audio. Interact with the page (click anywhere) before the timer ends to enable audio.

## Questions or Issues?

- [Report a bug](https://github.com/davidlbowman/spotify-pomodoro/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/davidlbowman/spotify-pomodoro/issues/new?template=feature_request.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT
