import React, { useState, useEffect } from 'react';
import './Spinner.css';
import './App.css'; // we'll define styling here
import Navbar from './components/Navbar';


const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', username: '', role: 'consumer' });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState('consumer');
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  useEffect(() => {
    if (user) fetchVideos();
  }, [user, viewMode]);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else setUser(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoadingVideos(true);
      const res = await fetch(`${API_URL}/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (user.role === 'creator' && viewMode === 'creator') {
          setVideos(data.filter(video => video.creator._id === user._id));
        } else {
          setVideos(data);
        }
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setMessage('Login successful');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful! Please login.');
        setIsLogin(true);
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setVideos([]);
  };

  return (
    <div className="app-wrapper">
      <Navbar user={user} logout={logout} />
      <div className="app-card">
        {loadingUser ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : !token ? (
          <div>
            <h2>{isLogin ? 'Login' : 'Signup'}</h2>
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="form">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              {!isLogin && (
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="consumer">Consumer</option>
                  <option value="creator">Creator</option>
                </select>
              )}
              <button type="submit" className="btn">{isLogin ? 'Login' : 'Signup'}</button>
            </form>
            <p className="error">{message}</p>
            <p>
              {isLogin ? (
                <>Don't have an account? <button onClick={() => setIsLogin(false)} className="link-btn">Signup</button></>
              ) : (
                <>Already have an account? <button onClick={() => setIsLogin(true)} className="link-btn">Login</button></>
              )}
            </p>
          </div>
        ) : (
          <div>
            <h3>Welcome, {user?.username || 'User'} ({user?.role})</h3>
            <button onClick={logout} className="btn logout-btn">Logout</button>

            {user.role === 'creator' && (
              <div style={{ margin: '10px 0' }}>
                <strong>View Mode: </strong>
                <button
                  onClick={() => setViewMode(viewMode === 'creator' ? 'consumer' : 'creator')}
                  className="btn small-btn"
                >
                  Switch to {viewMode === 'creator' ? 'Consumer' : 'Creator'} Mode
                </button>
              </div>
            )}

            <h4>Videos</h4>
            {loadingVideos ? (
              <div className="spinner-container"><div className="spinner" /></div>
            ) : videos.length === 0 ? (
              <p>No videos found or you may not have permission.</p>
            ) : (
              <ul className="video-list">
                {videos.map((video) => (
                  <li key={video._id} className="video-item">
                    <strong>{video.title}</strong> by {video.creator.username}
                    <video width="100%" controls>
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </li>
                ))}
              </ul>
            )}

            {user?.role === 'creator' && viewMode === 'creator' && (
              <div className="upload-form">
                <h4>Upload Video</h4>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    try {
                      const res = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setVideos(prev => [...prev, data.video]);
                      } else {
                        alert(data.message || 'Upload failed');
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Upload error');
                    }
                    e.target.reset();
                  }}
                  className="form"
                >
                  <input type="text" name="title" placeholder="Video title" required />
                  <input type="file" name="video" accept="video/mp4" required />
                  <button type="submit" className="btn">Upload</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
