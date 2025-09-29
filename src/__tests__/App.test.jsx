import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

// Mock the dependencies
vi.mock('../config/spotify.js', () => ({
  authEndpoint: 'https://accounts.spotify.com/authorize',
  clientId: 'test-client-id',
  redirectUri: 'http://localhost:3001',
  scopes: ['user-read-currently-playing']
}))

vi.mock('../components/Player.jsx', () => ({
  default: () => <div data-testid="player">Mocked Player</div>
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.location.hash = ''
    
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

  describe('Login URL Generation', () => {
    it('should generate correct login URL', () => {
      render(<App />)
      
      const loginLink = screen.getByText('Login to Spotify')
      expect(loginLink).toHaveAttribute('href')
      
      const href = loginLink.getAttribute('href')
      expect(href).toContain('https://accounts.spotify.com/authorize')
      expect(href).toContain('client_id=test-client-id')
      expect(href).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3001')
      expect(href).toContain('scope=user-read-currently-playing')
      expect(href).toContain('response_type=token')
    })
  })
})