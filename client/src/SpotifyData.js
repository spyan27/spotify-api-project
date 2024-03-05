import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

const SpotifyData = () => {
  const [artistData, setArtistData] = useState(null);
  const [artistName, setArtistName] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-spotify-data?artistName=${artistName}`);
      setArtistData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [artistName]);

  const handleSearch = () => {
    fetchData();
  };

  if (!artistData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h1>{artistData.name}</h1>
      <p style={{ color: 'blue' }}> Followers: {artistData.followers}</p>

      <div>
        <label htmlFor="artistSearch">Enter Artist Name:</label>
        <input
          type="text"
          id="artistSearch"
          placeholder="Search for an artist..."
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h2>Top Tracks:</h2>
      <ul>
        {artistData.topTracks.map((track, index) => (
          <li key={index}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyData;