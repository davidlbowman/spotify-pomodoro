# Spotify Pomodoro

A pomodoro timer app that integrates with your Spotify account to play music during focus sessions.

## Features

- Configurable focus and break durations
- Audio notification when timer ends
- Timer continues counting up after completion (no forced breaks)
- Spotify integration for playlist selection and playback control
- Session counter

## Prerequisites

- [Bun](https://bun.sh) runtime
- A Spotify Developer account

## Setup

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:4321/callback` to your Redirect URIs
4. Note your Client ID

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Spotify credentials:

```
PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:4321/callback
```

### 3. Install and Run

```bash
bun install
bun run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Commands

| Command             | Action                                      |
| :------------------ | :------------------------------------------ |
| `bun install`       | Install dependencies                        |
| `bun run dev`       | Start local dev server at `localhost:4321`  |
| `bun run build`     | Build production site to `./dist/`          |
| `bun run preview`   | Preview production build locally            |
| `bun run lint`      | Check for linting issues                    |
| `bun run lint:fix`  | Fix linting issues                          |
| `bun run typecheck` | Run TypeScript type checking                |

## Tech Stack

- [Astro](https://astro.build) - Web framework
- [React](https://react.dev) - UI components
- [Effect](https://effect.website) - Typed functional programming
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Biome](https://biomejs.dev) - Linting and formatting

## Usage

1. Click "Connect with Spotify" to authenticate
2. Set your desired focus and break durations
3. Select a playlist to play during your session
4. Click "Start" to begin your pomodoro
5. When the timer ends, you'll hear a notification sound
6. The timer will continue counting up - take your break when ready
7. Click "Switch to Break" when you're ready for your break
