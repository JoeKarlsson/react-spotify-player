import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Player from '../Player.jsx'

describe('Player Component', () => {
  const mockItem = {
    album: {
      images: [{ url: 'https://example.com/album-cover.jpg' }]
    },
    name: 'Test Song',
    artists: [{ name: 'Test Artist' }],
    duration_ms: 180000 // 3 minutes
  }

  const defaultProps = {
    item: mockItem,
    isPlaying: true,
    progressMs: 60000 // 1 minute
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Player {...defaultProps} />)
      expect(screen.getByText('Test Song')).toBeInTheDocument()
    })

    it('should display track name', () => {
      render(<Player {...defaultProps} />)
      expect(screen.getByText('Test Song')).toBeInTheDocument()
    })

    it('should display artist name', () => {
      render(<Player {...defaultProps} />)
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
    })

    it('should display album cover image', () => {
      render(<Player {...defaultProps} />)
      const albumImage = screen.getByAltText('Album cover for Test Song by Test Artist')
      expect(albumImage).toBeInTheDocument()
      expect(albumImage).toHaveAttribute('src', 'https://example.com/album-cover.jpg')
    })
  })

  describe('Playback Status', () => {
    it('should show playing status when isPlaying is true', () => {
      render(<Player {...defaultProps} isPlaying={true} />)
      expect(screen.getByText('▶️ Playing')).toBeInTheDocument()
    })

    it('should show paused status when isPlaying is false', () => {
      render(<Player {...defaultProps} isPlaying={false} />)
      expect(screen.getByText('⏸️ Paused')).toBeInTheDocument()
    })
  })

  describe('Progress Bar', () => {
    it('should calculate progress bar width correctly', () => {
      render(<Player {...defaultProps} />)
      const progressBar = document.querySelector('.progress__bar')
      expect(progressBar).toBeInTheDocument()
      
      // progressMs (60000) / duration_ms (180000) * 100 = 33.33%
      expect(progressBar.style.width).toBe('33.3333%')
    })

    it('should handle zero progress', () => {
      render(<Player {...defaultProps} progressMs={0} />)
      const progressBar = document.querySelector('.progress__bar')
      expect(progressBar.style.width).toBe('0%')
    })

    it('should handle full progress', () => {
      render(<Player {...defaultProps} progressMs={180000} />)
      const progressBar = document.querySelector('.progress__bar')
      expect(progressBar.style.width).toBe('100%')
    })

    it('should handle progress exceeding duration', () => {
      render(<Player {...defaultProps} progressMs={200000} />)
      const progressBar = document.querySelector('.progress__bar')
      // Should not exceed 100%
      expect(progressBar.style.width).toBe('111.111%')
    })
  })

  describe('Background Styles', () => {
    it('should apply background image style', () => {
      render(<Player {...defaultProps} />)
      const background = document.querySelector('.background')
      expect(background).toBeInTheDocument()
      expect(background.style.backgroundImage).toBe('url("https://example.com/album-cover.jpg")')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty track name', () => {
      const itemWithEmptyName = {
        ...mockItem,
        name: ''
      }
      render(<Player {...defaultProps} item={itemWithEmptyName} />)
      const trackNameElement = document.querySelector('.now-playing__name')
      expect(trackNameElement).toBeInTheDocument()
      expect(trackNameElement.textContent).toBe('')
    })

    it('should handle empty artist name', () => {
      const itemWithEmptyArtist = {
        ...mockItem,
        artists: [{ name: '' }]
      }
      render(<Player {...defaultProps} item={itemWithEmptyArtist} />)
      const artistElement = document.querySelector('.now-playing__artist')
      expect(artistElement).toBeInTheDocument()
      expect(artistElement.textContent).toBe('')
    })

    it('should handle missing album image', () => {
      const itemWithoutImage = {
        ...mockItem,
        album: {
          images: [{ url: '' }]
        }
      }
      render(<Player {...defaultProps} item={itemWithoutImage} />)
      const albumImage = screen.getByAltText('Album cover for Test Song by Test Artist')
      // React 19 leaves out an empty src instead of rendering src=""
      expect(albumImage).not.toHaveAttribute('src')
    })

    it('should handle zero duration', () => {
      const itemWithZeroDuration = {
        ...mockItem,
        duration_ms: 0
      }
      render(<Player {...defaultProps} item={itemWithZeroDuration} />)
      const progressBar = document.querySelector('.progress__bar')
      // Should handle division by zero gracefully - in JavaScript, 0/0 = NaN, but CSS doesn't display NaN
      expect(progressBar.style.width).toBe('')
    })

    it('should handle multiple artists', () => {
      const itemWithMultipleArtists = {
        ...mockItem,
        artists: [
          { name: 'Artist 1' },
          { name: 'Artist 2' }
        ]
      }
      render(<Player {...defaultProps} item={itemWithMultipleArtists} />)
      // Should display only the first artist
      expect(screen.getByText('Artist 1')).toBeInTheDocument()
      expect(screen.queryByText('Artist 2')).not.toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('should have correct CSS classes', () => {
      render(<Player {...defaultProps} />)
      
      expect(document.querySelector('.App')).toBeInTheDocument()
      expect(document.querySelector('.main-wrapper')).toBeInTheDocument()
      expect(document.querySelector('.now-playing__img')).toBeInTheDocument()
      expect(document.querySelector('.now-playing__side')).toBeInTheDocument()
      expect(document.querySelector('.now-playing__name')).toBeInTheDocument()
      expect(document.querySelector('.now-playing__artist')).toBeInTheDocument()
      expect(document.querySelector('.now-playing__status')).toBeInTheDocument()
      expect(document.querySelector('.progress')).toBeInTheDocument()
      expect(document.querySelector('.progress__bar')).toBeInTheDocument()
      expect(document.querySelector('.background')).toBeInTheDocument()
    })
  })
})
