import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'consumer') {
        navigate('/consumer-dashboard');
      } else if (user.role === 'creator') {
        navigate('/creator-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Welcome to VideoShare</h1>
      {!user ? (
        <>
          <p>Please <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link> to continue.</p>
        </>
      ) : (
        <p>Redirecting to your dashboard...</p>
      )}
    </div>
  );
}

export default Home;
