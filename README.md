# React Spotify Player

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Shows what you're playing on Spotify: album art, track, artist and a progress
bar that moves with the song. It's a small React and Vite app I wrote for the
tutorial
[How to Build a Spotify Player with React in 15 Minutes](https://www.joekarlsson.com/blog/how-to-build-a-spotify-player-with-react-in-15-minutes/).

![React Spotify Player: clicking Login with Spotify, approving the app on Spotify's permission screen, then the player showing the song that's playing, with album art, a progress bar and a Logout button](.github/readme/2026-11-recording.gif)

It logs in with Spotify's
[Authorization Code flow with PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow),
which needs no client secret. (It used the Implicit Grant flow until Spotify
removed it in November 2025.)

## Quick start

You need Node.js and an app in the
[Spotify Developer Dashboard](https://developer.spotify.com/dashboard) with
`http://127.0.0.1:3001` as a Redirect URI (Spotify doesn't accept `localhost`).

```bash
git clone https://github.com/JoeKarlsson/react-spotify-player.git
cd react-spotify-player
npm install
npm run dev    # opens http://127.0.0.1:3001
```

Put your app's Client ID in `clientId` in `src/config/spotify.js`. The
`redirectUri` there has to match the one in the dashboard, and Vite's port is
fixed at 127.0.0.1:3001 in `vite.config.js`. Click "Login to Spotify", approve the app and
start playing something in Spotify.

## Development

```bash
npm test             # Vitest in watch mode (npm run test:run for one pass)
npm run build        # production build in dist/
npm run preview      # serve the build
```

| Path | What's in it |
| --- | --- |
| `src/App.jsx` | Login, token handling and polling `/me/player` every 5 seconds |
| `src/components/Player.jsx` | The album art, track info and progress bar |
| `src/config/spotify.js` | Client ID, redirect URI and scopes |
| `src/utils/pkce.js` | PKCE login: the code challenge, and trading the code for a token |

Stuck? See [TROUBLESHOOTING.md](TROUBLESHOOTING.md). For more endpoints to try,
see [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md).

## License

MIT. See [LICENSE](LICENSE).
