# Spotify Pomodoro

A Spotify-integrated pomodoro timer app.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Astro with React
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linting/Formatting**: Biome

## Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Check linting
- `bun run lint:fix` - Fix linting issues
- `bun run typecheck` - Run type checking

## Project Structure

- `src/pages/` - Astro pages
- `src/components/ui/` - shadcn/ui components
- `src/styles/` - Global CSS with Tailwind
- `src/lib/` - Utility functions

## Notes

- Use `@/` path alias for imports from `src/`
- React components need `client:load` directive in Astro for interactivity
- Biome is configured to skip Tailwind CSS files (global.css)
