import React from 'react';

/**
 * Player Component
 * 
 * This component displays the currently playing track information from Spotify.
 * It receives track data as props and renders a beautiful player interface.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.item - Track information from Spotify API
 * @param {boolean} props.isPlaying - Current playback state
 * @param {number} props.progressMs - Current position in the track (milliseconds)
 */
const Player = ({ item, isPlaying, progressMs }) => {
  // Create background style with album artwork
  // This creates a blurred background effect using the album cover
  const backgroundStyles = {
    backgroundImage: `url(${item.album.images[0].url})`,
  };

  // Calculate progress bar width as percentage
  // This creates a visual representation of how much of the song has played
  const progressBarStyles = {
    width: (progressMs * 100) / item.duration_ms + "%",
  };

  return (
    <div className="App">
      <div className="main-wrapper">
        {/* Album artwork display */}
        <div className="now-playing__img">
          <img 
            src={item.album.images[0].url} 
            alt={`Album cover for ${item.name} by ${item.artists[0].name}`}
          />
        </div>
        
        {/* Track information display */}
        <div className="now-playing__side">
          {/* Track name */}
          <div className="now-playing__name">{item.name}</div>
          
          {/* Artist name */}
          <div className="now-playing__artist">
            {item.artists[0].name}
          </div>
          
          {/* Playback status with conditional rendering */}
          <div className="now-playing__status">
            {isPlaying ? "▶️ Playing" : "⏸️ Paused"}
          </div>
          
          {/* Progress bar */}
          <div className="progress">
            <div className="progress__bar" style={progressBarStyles} />
          </div>
        </div>
        
        {/* Background blur effect */}
        <div className="background" style={backgroundStyles} />
      </div>
    </div>
  );
};

export default Player;
