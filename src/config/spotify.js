/**
 * Spotify API Configuration
 * 
 * This file contains all the configuration needed to connect to Spotify's Web API.
 * These values are used for OAuth authentication and API requests.
 * 
 * IMPORTANT: In a production app, you should:
 * 1. Move sensitive values to environment variables
 * 2. Use different client IDs for development/production
 * 3. Implement proper error handling for missing config
 */

// Spotify OAuth authorization endpoint
export const authEndpoint = "https://accounts.spotify.com/authorize";

// Spotify token endpoint (trades the authorization code for an access token)
export const tokenEndpoint = "https://accounts.spotify.com/api/token";

// Your Spotify app's client ID (get this from Spotify Developer Dashboard)
// TODO: Move this to environment variables for security
export const clientId = "84e1f8dc34a647a2834aa94d9d2e45a7";

// Where Spotify redirects after authentication
// This must match the redirect URI in your Spotify app settings.
// Spotify doesn't accept "localhost" redirect URIs; use the loopback IP.
export const redirectUri = "http://127.0.0.1:3001";

// Permissions your app requests from the user
// Each scope grants access to different parts of the Spotify API
export const scopes = [
    "user-top-read",              // Access to user's top artists and tracks
    "user-read-currently-playing", // Access to currently playing track
    "user-read-playback-state",   // Access to playback state (playing/paused)
];
