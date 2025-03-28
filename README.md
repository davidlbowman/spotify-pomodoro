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

## Implementation Plan

### 1. Project Setup

- Initialize a new Vite project with React
- Install and configure Shadcn UI
- Set up basic project structure

### 2. Spotify Integration

- Register a new application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
- Configure the application with the correct redirect URI
- Request the following scopes:
  - `user-read-playback-state`
  - `user-modify-playback-state`
- Implement the Implicit Grant Flow for authentication

### 3. Core Components

#### Authentication Component
- Login button that redirects to Spotify authorization
- Logic to extract and store the access token from the redirect URI

#### Playlist Selector
- Input field or dropdown to specify a Spotify playlist ID
- Option to save preferred playlist to localStorage

#### Timer Component
- Display for the 20-minute countdown
- Start/Pause/Reset buttons
- Visual indication of timer status

#### Playback Controller
- Functions to start playback when timer starts
- Functions to pause playback when timer ends
- Audio notification (beep) when timer ends

### 4. API Integration

Implement the following Spotify API endpoints:

- `PUT /v1/me/player/play` - Start playback of selected playlist
- `PUT /v1/me/player/pause` - Pause playback when timer ends

### 5. User Interface

- Clean, minimal design with focus on the timer
- Backdrop image that creates a productive atmosphere
- Clear visual indication of work/break states
- Responsive design for use on different devices

## Development Workflow

1. Set up the project and implement authentication
2. Build the timer functionality
3. Integrate Spotify playback controls
4. Design and implement the UI
5. Add the notification sound
6. Test and refine the user experience

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

---
Answer from Perplexity: pplx.ai/share