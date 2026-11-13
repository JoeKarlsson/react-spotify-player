import React, { useState, useEffect, useCallback } from 'react';
import { login, getToken } from '/src/utils/pkce.js';
import Player from '/src/components/Player.jsx';

/**
 * Main App Component
 * 
 * This is the root component that handles:
 * - Spotify OAuth authentication flow
 * - Token persistence using localStorage
 * - Real-time data fetching from Spotify Web API
 * - Error handling and user feedback
 * - State management for the entire application
 */
const App = () => {
  // ===== STATE MANAGEMENT =====
  
  // Authentication token from Spotify OAuth
  const [token, setToken] = useState(null);
  
  // Currently playing track data structure
  // This matches the Spotify Web API response format
  const [item, setItem] = useState({
    album: {
      images: [{ url: "" }],
    },
    name: "",
    artists: [{ name: "" }],
    duration_ms: 0,
  });
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  
  // UI state for user feedback
  const [noData, setNoData] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ===== UTILITY FUNCTIONS =====
  
  /**
   * Handle user logout
   * 
   * This function:
   * 1. Removes the stored token from localStorage
   * 2. Resets all component state to initial values
   * 3. Clears any error messages
   */
  const handleLogout = () => {
    // Remove token from browser storage
    localStorage.removeItem('spotify_access_token');
    
    // Reset all state to initial values
    setToken(null);
    setNoData(false);
    setError(null);
    setIsLoading(false);
    
    // Reset track data to default state
    setItem({
      album: {
        images: [{ url: "" }],
      },
      name: "",
      artists: [{ name: "" }],
      duration_ms: 0,
    });
  };

  /**
   * Handle token expiration
   * 
   * This function is called when the API returns a 401 (Unauthorized) error,
   * indicating that the access token has expired or is invalid.
   */
  const handleTokenExpiration = () => {
    setError("Your session has expired. Please log in again.");
    handleLogout();
  };

  /**
   * Fetch currently playing track from Spotify Web API
   * 
   * @param {string} accessToken - Spotify OAuth access token
   */
  const getCurrentlyPlaying = useCallback(async (accessToken) => {
    // Set loading state and clear any previous errors
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API request to Spotify Web API
      const response = await fetch(
        "https://api.spotify.com/v1/me/player",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // OAuth Bearer token
          },
        }
      );

      // Handle HTTP error responses
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid - trigger logout
          handleTokenExpiration();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse JSON response
      const responseText = await response.text();
      
      // Handle empty response (no music playing)
      if (!responseText || responseText.trim() === '') {
        setNoData(true);
        setError(null); // Clear any previous errors
        return;
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError(`Invalid response from Spotify: ${responseText.substring(0, 100)}...`);
        return;
      }

      // Validate response data
      if (!data) {
        setNoData(true);
        setError("No data received from Spotify. Make sure you're playing music.");
        return;
      }

      // Update component state with API data
      setItem(data.item); // Track information
      setIsPlaying(data.is_playing); // Playback state
      setProgressMs(data.progress_ms); // Current position
      setNoData(false);
      setError(null);
    } catch (error) {
      // Handle network errors and other exceptions
      console.error("Error fetching currently playing:", error);
      setError(`Failed to fetch data: ${error.message}`);
      setNoData(true);
    } finally {
      // Always clear loading state
      setIsLoading(false);
    }
  }, []);

  // ===== EFFECT HOOKS =====
  
  /**
   * Main effect hook for authentication and data polling
   * 
   * This useEffect handles:
   * 1. Token retrieval from localStorage, or trading the ?code= Spotify sends back
   * 2. Initial data fetch
   * 3. Setting up polling for real-time updates
   * 4. Cleanup on component unmount
   */
  useEffect(() => {
    let interval;

    const start = async () => {
      // Step 1: Try to get token from localStorage (persisted from previous session)
      let _token = localStorage.getItem('spotify_access_token');

      // Step 2: After the Spotify redirect, trade ?code= for a new access token
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        // Clear ?code= from the address bar so it isn't used twice
        window.history.replaceState({}, '', '/');
        try {
          _token = await getToken(code);
        } catch (err) {
          setError(`Login failed: ${err.message}`);
          return;
        }
      }

      if (!_token) return;

      // Step 3: Set token in state and save to localStorage
      setToken(_token);
      localStorage.setItem('spotify_access_token', _token);

      // Step 4: Fetch initial data, then poll every 5 seconds
      getCurrentlyPlaying(_token);
      interval = setInterval(() => getCurrentlyPlaying(_token), 5000);
    };
    start();

    // Step 5: Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, [getCurrentlyPlaying]);

  // ===== RENDER =====
  
  /**
   * Render the application UI
   */
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 React Spotify Player</h1>
        
        {/* Conditional rendering: Show login button if user is not authenticated */}
        {!token && (
          <button className="btn" onClick={login}>
            Login to Spotify
          </button>
        )}
        
        {/* Conditional rendering: Show player if authenticated and data is available */}
        {token && !noData && (
          <div>
            <Player
              item={item}
              isPlaying={isPlaying}
              progressMs={progressMs}
            />
            <button 
              className="btn logout-btn" 
              onClick={handleLogout}
              style={{ marginTop: '20px', backgroundColor: '#e74c3c' }}
            >
              Logout
            </button>
          </div>
        )}
        
        {/* Conditional rendering: Show loading state */}
        {isLoading && (
          <div className="loading">
            <div className="skeleton-player">
              <div className="skeleton-img"></div>
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-artist"></div>
                <div className="skeleton-line skeleton-status"></div>
                <div className="skeleton-progress"></div>
              </div>
            </div>
            <p>Loading your music...</p>
          </div>
        )}
        
        {/* Conditional rendering: Show error message */}
        {error && (
          <div className="error" style={{ 
            backgroundColor: 'rgba(231, 76, 60, 0.1)', 
            border: '1px solid #e74c3c', 
            borderRadius: '5px', 
            padding: '10px', 
            margin: '10px 0',
            color: '#e74c3c'
          }}>
            <p>{error}</p>
          </div>
        )}
        
        {/* Conditional rendering: Show message if no data is available */}
        {noData && !error && !isLoading && (
          <div>
            <p>
              You need to be playing a song on Spotify for something to appear here.
            </p>
            <button 
              className="btn logout-btn" 
              onClick={handleLogout}
              style={{ marginTop: '20px', backgroundColor: '#e74c3c' }}
            >
              Logout
            </button>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
