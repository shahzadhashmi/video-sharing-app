import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';  // Adjust if needed
import { useNavigate } from 'react-router-dom';

function ConsumerDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'consumer') {
      navigate('/');
      return;
    }
    fetchVideos();
  }, [user, navigate]);

  const fetchVideos = async () => {
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/videos', {
        headers: {
          'Authorization': `Bearer ${user.token}`,  // Make sure token is stored in user object on login
        }
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to fetch videos');
        return;
      }

      const data = await res.json();
      setVideos(data);
    } catch (err) {
      setError('Server error while fetching videos');
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user?.username} (Consumer)</h1>

      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {filteredVideos.length === 0 && <li>No videos found.</li>}
        {filteredVideos.map(video => (
          <li key={video._id} style={{ marginBottom: '10px' }}>
            <strong>{video.title}</strong> — Genre: {video.genre} — Age Rating: {video.ageRating} <br />
            Creator: {video.creator?.username || 'Unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConsumerDashboard;
