# 🎵 Spotify API Endpoints Guide

This guide provides examples of additional Spotify Web API endpoints you can explore to extend your React Spotify Player. Each endpoint includes code examples, required scopes, and practical use cases.

## 📋 Table of Contents

- [User Profile Endpoints](#user-profile-endpoints)
- [Playlist Management](#playlist-management)
- [Track and Album Information](#track-and-album-information)
- [Search Functionality](#search-functionality)
- [Audio Features](#audio-features)
- [Recommendations](#recommendations)
- [Player Control](#player-control)
- [Implementation Examples](#implementation-examples)

---

## 👤 User Profile Endpoints

### Get User's Profile

```javascript
/**
 * Fetch the current user's profile information
 * Scope: user-read-private (optional)
 */
const getUserProfile = async (accessToken) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch user profile');
  
  const user = await response.json();
  return {
    id: user.id,
    displayName: user.display_name,
    email: user.email,
    followers: user.followers.total,
    country: user.country,
    image: user.images[0]?.url
  };
};
```

### Get User's Top Tracks

```javascript
/**
 * Fetch user's top tracks (short, medium, or long term)
 * Scope: user-top-read
 */
const getTopTracks = async (accessToken, timeRange = 'medium_term', limit = 20) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch top tracks');
  
  const data = await response.json();
  return data.items.map(track => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => artist.name),
    album: track.album.name,
    image: track.album.images[0]?.url,
    popularity: track.popularity,
    previewUrl: track.preview_url
  }));
};
```

### Get User's Top Artists

```javascript
/**
 * Fetch user's top artists
 * Scope: user-top-read
 */
const getTopArtists = async (accessToken, timeRange = 'medium_term', limit = 20) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch top artists');
  
  const data = await response.json();
  return data.items.map(artist => ({
    id: artist.id,
    name: artist.name,
    genres: artist.genres,
    popularity: artist.popularity,
    image: artist.images[0]?.url,
    followers: artist.followers.total
  }));
};
```

---

## 📝 Playlist Management

### Get User's Playlists

```javascript
/**
 * Fetch user's playlists
 * Scope: playlist-read-private
 */
const getUserPlaylists = async (accessToken, limit = 50) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch playlists');
  
  const data = await response.json();
  return data.items.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    image: playlist.images[0]?.url,
    tracks: playlist.tracks.total,
    owner: playlist.owner.display_name,
    public: playlist.public
  }));
};
```

### Get Playlist Tracks

```javascript
/**
 * Fetch tracks from a specific playlist
 * Scope: playlist-read-private
 */
const getPlaylistTracks = async (accessToken, playlistId, limit = 100) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch playlist tracks');
  
  const data = await response.json();
  return data.items.map(item => ({
    id: item.track.id,
    name: item.track.name,
    artists: item.track.artists.map(artist => artist.name),
    album: item.track.album.name,
    image: item.track.album.images[0]?.url,
    duration: item.track.duration_ms,
    addedAt: item.added_at
  }));
};
```

### Create a Playlist

```javascript
/**
 * Create a new playlist for the user
 * Scope: playlist-modify-public, playlist-modify-private
 */
const createPlaylist = async (accessToken, userId, name, description = '', public = false) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        public: public
      })
    }
  );
  
  if (!response.ok) throw new Error('Failed to create playlist');
  
  const playlist = await response.json();
  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    public: playlist.public,
    tracks: playlist.tracks.total
  };
};
```

---

## 🎵 Track and Album Information

### Get Track Details

```javascript
/**
 * Fetch detailed information about a specific track
 * Scope: None (public data)
 */
const getTrackDetails = async (accessToken, trackId) => {
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch track details');
  
  const track = await response.json();
  return {
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => ({
      id: artist.id,
      name: artist.name
    })),
    album: {
      id: track.album.id,
      name: track.album.name,
      images: track.album.images,
      releaseDate: track.album.release_date
    },
    duration: track.duration_ms,
    popularity: track.popularity,
    previewUrl: track.preview_url,
    explicit: track.explicit
  };
};
```

### Get Album Details

```javascript
/**
 * Fetch detailed information about a specific album
 * Scope: None (public data)
 */
const getAlbumDetails = async (accessToken, albumId) => {
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch album details');
  
  const album = await response.json();
  return {
    id: album.id,
    name: album.name,
    artists: album.artists.map(artist => ({
      id: artist.id,
      name: artist.name
    })),
    images: album.images,
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
    genres: album.genres,
    popularity: album.popularity,
    tracks: album.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      duration: track.duration_ms,
      trackNumber: track.track_number
    }))
  };
};
```

---

## 🔍 Search Functionality

### Search for Tracks

```javascript
/**
 * Search for tracks, artists, albums, or playlists
 * Scope: None (public data)
 */
const searchSpotify = async (accessToken, query, type = 'track', limit = 20) => {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodedQuery}&type=${type}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to search');
  
  const data = await response.json();
  
  if (type === 'track') {
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      image: track.album.images[0]?.url,
      previewUrl: track.preview_url,
      popularity: track.popularity
    }));
  }
  
  return data;
};
```

### Advanced Search

```javascript
/**
 * Advanced search with multiple types and filters
 * Scope: None (public data)
 */
const advancedSearch = async (accessToken, query, options = {}) => {
  const {
    types = ['track', 'artist', 'album'],
    limit = 20,
    market = 'US',
    year,
    genre
  } = options;
  
  let searchQuery = query;
  
  // Add filters
  if (year) searchQuery += ` year:${year}`;
  if (genre) searchQuery += ` genre:${genre}`;
  
  const encodedQuery = encodeURIComponent(searchQuery);
  const typesString = types.join(',');
  
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodedQuery}&type=${typesString}&limit=${limit}&market=${market}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to search');
  
  return await response.json();
};
```

---

## 🎼 Audio Features

### Get Audio Features for Track

```javascript
/**
 * Get audio features (danceability, energy, etc.) for a track
 * Scope: None (public data)
 */
const getAudioFeatures = async (accessToken, trackId) => {
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch audio features');
  
  const features = await response.json();
  return {
    danceability: features.danceability,
    energy: features.energy,
    valence: features.valence,
    tempo: features.tempo,
    key: features.key,
    mode: features.mode,
    timeSignature: features.time_signature,
    acousticness: features.acousticness,
    instrumentalness: features.instrumentalness,
    liveness: features.liveness,
    speechiness: features.speechiness
  };
};
```

### Get Audio Analysis

```javascript
/**
 * Get detailed audio analysis for a track
 * Scope: None (public data)
 */
const getAudioAnalysis = async (accessToken, trackId) => {
  const response = await fetch(
    `https://api.spotify.com/v1/audio-analysis/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch audio analysis');
  
  return await response.json();
};
```

---

## 🎯 Recommendations

### Get Track Recommendations

```javascript
/**
 * Get track recommendations based on seed tracks/artists
 * Scope: None (public data)
 */
const getRecommendations = async (accessToken, options = {}) => {
  const {
    seedTracks = [],
    seedArtists = [],
    seedGenres = [],
    limit = 20,
    targetDanceability,
    targetEnergy,
    targetValence
  } = options;
  
  const params = new URLSearchParams();
  
  // Add seeds
  if (seedTracks.length > 0) params.append('seed_tracks', seedTracks.join(','));
  if (seedArtists.length > 0) params.append('seed_artists', seedArtists.join(','));
  if (seedGenres.length > 0) params.append('seed_genres', seedGenres.join(','));
  
  // Add limits and targets
  params.append('limit', limit);
  if (targetDanceability) params.append('target_danceability', targetDanceability);
  if (targetEnergy) params.append('target_energy', targetEnergy);
  if (targetValence) params.append('target_valence', targetValence);
  
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to get recommendations');
  
  const data = await response.json();
  return data.tracks.map(track => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map(artist => artist.name),
    album: track.album.name,
    image: track.album.images[0]?.url,
    previewUrl: track.preview_url,
    popularity: track.popularity
  }));
};
```

---

## 🎮 Player Control

### Get Available Devices

```javascript
/**
 * Get user's available devices
 * Scope: user-read-playback-state
 */
const getDevices = async (accessToken) => {
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/devices',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch devices');
  
  const data = await response.json();
  return data.devices.map(device => ({
    id: device.id,
    name: device.name,
    type: device.type,
    volume: device.volume_percent,
    isActive: device.is_active,
    isRestricted: device.is_restricted
  }));
};
```

### Play Track

```javascript
/**
 * Start playback of a track
 * Scope: user-modify-playback-state
 */
const playTrack = async (accessToken, trackUri, deviceId = null) => {
  const body = {
    uris: [trackUri]
  };
  
  if (deviceId) {
    body.device_id = deviceId;
  }
  
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/play',
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );
  
  if (!response.ok) throw new Error('Failed to play track');
  
  return response.ok;
};
```

### Pause Playback

```javascript
/**
 * Pause current playback
 * Scope: user-modify-playback-state
 */
const pausePlayback = async (accessToken, deviceId = null) => {
  const url = deviceId 
    ? `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`
    : 'https://api.spotify.com/v1/me/player/pause';
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) throw new Error('Failed to pause playback');
  
  return response.ok;
};
```

---

## 🛠️ Implementation Examples

### Complete API Service Class

```javascript
/**
 * Complete Spotify API service class
 * This demonstrates how to organize all API calls
 */
class SpotifyAPIService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://api.spotify.com/v1';
  }
  
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
  }
  
  // User methods
  async getUserProfile() {
    return this.makeRequest('/me');
  }
  
  async getTopTracks(timeRange = 'medium_term', limit = 20) {
    return this.makeRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }
  
  // Playlist methods
  async getUserPlaylists(limit = 50) {
    return this.makeRequest(`/me/playlists?limit=${limit}`);
  }
  
  async getPlaylistTracks(playlistId, limit = 100) {
    return this.makeRequest(`/playlists/${playlistId}/tracks?limit=${limit}`);
  }
  
  // Search methods
  async search(query, type = 'track', limit = 20) {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest(`/search?q=${encodedQuery}&type=${type}&limit=${limit}`);
  }
  
  // Player methods
  async getCurrentlyPlaying() {
    return this.makeRequest('/me/player');
  }
  
  async playTrack(trackUri, deviceId = null) {
    const body = { uris: [trackUri] };
    if (deviceId) body.device_id = deviceId;
    
    return this.makeRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }
}

// Usage example
const spotifyAPI = new SpotifyAPIService(accessToken);
const userProfile = await spotifyAPI.getUserProfile();
const topTracks = await spotifyAPI.getTopTracks();
```

### React Hook for API Calls

```javascript
/**
 * Custom React hook for Spotify API calls
 * This demonstrates how to integrate API calls with React
 */
import { useState, useEffect } from 'react';

const useSpotifyAPI = (accessToken) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const makeRequest = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, makeRequest };
};

// Usage in component
const MyComponent = ({ accessToken }) => {
  const { data, loading, error, makeRequest } = useSpotifyAPI(accessToken);
  
  useEffect(() => {
    if (accessToken) {
      makeRequest('/me/top/tracks');
    }
  }, [accessToken]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.items?.map(track => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  );
};
```

---

## 📚 Required Scopes Reference

| Endpoint Category | Required Scopes |
|------------------|-----------------|
| User Profile | `user-read-private` (optional) |
| Top Tracks/Artists | `user-top-read` |
| Playlists (Read) | `playlist-read-private` |
| Playlists (Write) | `playlist-modify-public`, `playlist-modify-private` |
| Player Control | `user-modify-playback-state` |
| Currently Playing | `user-read-currently-playing`, `user-read-playback-state` |
| Devices | `user-read-playback-state` |
| Search | None (public data) |
| Audio Features | None (public data) |

---

## 🎯 Next Steps

1. **Start Simple**: Begin with user profile and top tracks
2. **Add Search**: Implement search functionality
3. **Build Playlists**: Create playlist management features
4. **Add Controls**: Implement play/pause functionality
5. **Audio Analysis**: Explore audio features for music discovery

---

*Happy coding! 🎵*
