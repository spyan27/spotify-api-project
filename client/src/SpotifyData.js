import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpotifyData = () => {
  const [artistData, setArtistData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-spotify-data');
        setArtistData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!artistData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{artistData.name}</h1>
      <p>Followers: {artistData.followers}</p>

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