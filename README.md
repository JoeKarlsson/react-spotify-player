# React Spotify Player - Modern Educational Example

A modern React application demonstrating Spotify Web API integration using Vite. This example shows how to:

- Authenticate with Spotify using OAuth 2.0
- Fetch currently playing track information
- Display track details and playback status
- Update information in real-time

## Features

- **Modern build tool** - Uses Vite for fast development and building
- **Minimal dependencies** - Only React and Vite
- **Educational focus** - Clean, readable code following React best practices
- **Real-time updates** - Polls Spotify API every 5 seconds
- **Modern React patterns** - Uses functional components and hooks

## Setup

1. **Create a Spotify App**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add `http://localhost:3000/redirect` to Redirect URIs

2. **Configure the app**:
   - Open `src/config/spotify.js`
   - Replace the client ID with your Spotify app's Client ID (already configured!)

3. **Install dependencies and run**:
   ```bash
   npm install
   npm run dev
   ```

4. **Open your browser**:
   - Vite will automatically open `http://localhost:3000`
   - Click "Login to Spotify"
   - Authorize the app
   - Start playing music in Spotify!

## How it Works

### Authentication Flow

1. User clicks "Login to Spotify"
2. Redirects to Spotify's authorization endpoint
3. User authorizes the app
4. Spotify redirects back with access token in URL fragment
5. App extracts token and stores it

### API Integration

- Uses Spotify Web API `/me/player` endpoint
- Fetches currently playing track information
- Updates UI with track name, artist, album art, and progress
- Polls every 5 seconds for real-time updates

### Key Learning Points

- **OAuth 2.0 Implicit Grant Flow** - Client-side authentication
- **Fetch API** - Modern JavaScript for HTTP requests
- **React Hooks** - useState, useEffect, useCallback for state management
- **Error Handling** - Proper try/catch and user feedback
- **Real-time Updates** - Polling pattern for live data

## File Structure

```
├── index.html              # Main HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── src/
│   ├── main.jsx           # Entry point that renders the app
│   ├── App.jsx            # Main App component with authentication logic
│   ├── index.css          # Global styles
│   ├── components/
│   │   └── Player.jsx     # Player component for displaying track info
│   ├── config/
│   │   └── spotify.js     # Spotify API configuration
│   └── utils/
│       └── hash.js         # URL hash parsing utility
└── README.md              # This file
```

## Dependencies

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **@vitejs/plugin-react** - React support for Vite

That's it! No complex build configuration needed.

## Educational Value

This minimal example teaches:

- Spotify Web API authentication
- React functional components and hooks
- Modern JavaScript (async/await, fetch)
- OAuth 2.0 flow implementation
- Real-time data polling
- Error handling patterns

Perfect for understanding how to integrate external APIs with React applications!

## Code Organization

Each file has a specific purpose following modern React best practices:

- **`src/config/spotify.js`** - Contains all Spotify API configuration (endpoints, client ID, scopes)
- **`src/utils/hash.js`** - Utility function to parse OAuth tokens from URL fragments
- **`src/components/Player.jsx`** - React component that displays track information and progress
- **`src/App.jsx`** - Main component handling authentication, API calls, and state management
- **`src/main.jsx`** - Entry point that renders the React app
- **`index.html`** - HTML template for the application

This structure follows modern React conventions:
- Components in separate files with `.jsx` extension
- Configuration separated from components
- Utilities in dedicated folders
- Clear separation of concerns
