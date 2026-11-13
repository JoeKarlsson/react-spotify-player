import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Spotify only accepts loopback redirect URIs, so serve on 127.0.0.1
        // (the login and the redirect must share an origin for the PKCE verifier)
        host: '127.0.0.1',
        port: 3001,
        strictPort: true,
        open: true
    }
})
