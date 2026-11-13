import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App.jsx'

// Mock the dependencies
vi.mock('../config/spotify.js', () => ({
  authEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  clientId: 'test-client-id',
  redirectUri: 'http://127.0.0.1:3001',
  scopes: ['user-read-currently-playing']
}))

vi.mock('../components/Player.jsx', () => ({
  default: () => <div data-testid="player">Mocked Player</div>
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.location.search = ''
    window.location.href = 'http://127.0.0.1:3001'
    
    // Mock fetch globally
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({
        item: {
          album: { images: [{ url: 'test.jpg' }] },
          name: 'Test Song',
          artists: [{ name: 'Test Artist' }],
          duration_ms: 180000
        },
        is_playing: true,
        progress_ms: 60000
      }))
    })
  })

  describe('Initial Render', () => {
    it('should render login button when no token is present', () => {
      render(<App />)
      expect(screen.getByText('Login to Spotify')).toBeInTheDocument()
      expect(screen.getByText('🎵 React Spotify Player')).toBeInTheDocument()
    })

    it('should not render player when no token is present', () => {
      render(<App />)
      expect(screen.queryByTestId('player')).not.toBeInTheDocument()
    })
  })

  describe('Login', () => {
    it('should send the user to Spotify with a PKCE code challenge', async () => {
      render(<App />)

      fireEvent.click(screen.getByText('Login to Spotify'))

      await waitFor(() => expect(window.location.href).toContain('https://accounts.spotify.com/authorize'))
      const params = new URL(window.location.href).searchParams
      expect(params.get('client_id')).toBe('test-client-id')
      expect(params.get('redirect_uri')).toBe('http://127.0.0.1:3001')
      expect(params.get('scope')).toBe('user-read-currently-playing')
      expect(params.get('response_type')).toBe('code')
      expect(params.get('code_challenge_method')).toBe('S256')
      expect(params.get('code_challenge')).toMatch(/^[A-Za-z0-9_-]{43}$/)
    })
  })

  describe('Spotify redirect', () => {
    it('should trade ?code= for a token and show the player', async () => {
      window.location.search = '?code=the-code'
      window.history.replaceState = vi.fn()
      global.fetch = vi.fn((url) => Promise.resolve(url.includes('/api/token')
        ? { ok: true, json: () => Promise.resolve({ access_token: 'tok123' }) }
        : { ok: true, text: () => Promise.resolve(JSON.stringify({ item: { album: { images: [{ url: '' }] }, name: 'Song', artists: [{ name: 'A' }], duration_ms: 1 }, is_playing: true, progress_ms: 0 })) }))

      render(<App />)

      expect(await screen.findByTestId('player')).toBeInTheDocument()
      expect(fetch.mock.calls[0][0]).toBe('https://accounts.spotify.com/api/token')
      expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer tok123')
      expect(localStorage.setItem).toHaveBeenCalledWith('spotify_access_token', 'tok123')
      expect(window.history.replaceState).toHaveBeenCalled()
    })
  })
})
