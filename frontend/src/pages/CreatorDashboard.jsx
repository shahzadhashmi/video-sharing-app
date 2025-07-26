// frontend/src/pages/CreatorDashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';

function CreatorDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'creator') {
      navigate('/');
      return;
    }
    fetchVideos();
  }, [user, navigate]);

  const fetchVideos = async () => {
    // Replace with real API call
    const dummyVideos = [
      { id: 1, title: 'My First Video', genre: 'Education', ageRating: 'PG' },
      { id: 2, title: 'Another Cool Video', genre: 'Comedy', ageRating: 'PG-13' },
    ];
    setVideos(dummyVideos);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpload = () => {
    // Placeholder for upload action
    alert('Upload functionality coming soon!');
  };

  return (
    <div>
      <h1>Welcome, {user.username} (Creator)</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Your Uploaded Videos</h2>
      <ul>
        {videos.length === 0 ? (
          <li>No videos uploaded yet.</li>
        ) : (
          videos.map(video => (
            <li key={video.id}>
              <strong>{video.title}</strong> — Genre: {video.genre} — Age Rating: {video.ageRating}
            </li>
          ))
        )}
      </ul>

      <button onClick={handleUpload}>Upload New Video</button>
    </div>
  );
}

export default CreatorDashboard;
