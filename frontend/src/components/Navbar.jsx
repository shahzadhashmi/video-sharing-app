import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">MyApp</div>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Videos</a>
      </div>
      <div className="navbar-right">
        <button onClick={onLogout} className="btn logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
