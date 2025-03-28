# Spotify Pomodoro Timer

A minimalist Pomodoro timer application that integrates with Spotify to play music during focus sessions.

## Overview

This application provides a simple Pomodoro timer that plays music from a Spotify playlist during 20-minute focus sessions, then pauses and alerts the user when it's time for a break. The user can then manually start the next session when ready.

## Features

- Spotify integration for music playback
- 20-minute countdown timer
- Automatic music pause and notification at the end of a session
- Simple, distraction-free UI with a backdrop image
- No backend required - fully client-side implementation

## Technical Stack

- **Frontend Framework**: React with Vite
- **UI Components**: Shadcn UI
- **Authentication**: Spotify Implicit Grant Flow
- **Hosting**: Static hosting on VPS or local environment

## Deployment

The application can be built and deployed as a static site:

```bash
# Build the application
npm run build

# Deploy to your hosting environment
# (specific commands depend on your hosting solution)
```

## Limitations

- Spotify access tokens expire after 1 hour, requiring re-authentication
- User must have an active Spotify device (web player or desktop app) for playback to work
- No persistent storage of session history or statistics

## Future Enhancements

- Add a backend for token refresh to avoid re-authentication
- Implement customizable work/break durations
- Add session tracking and statistics
- Create specialized playlists based on work duration

## Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Spotify Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Shadcn UI Documentation](https://ui.shadcn.com/)