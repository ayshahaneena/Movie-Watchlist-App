import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFilm, FaSearch, FaBookmark, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" style={{ textDecoration: 'none', color: '#667eea' }}>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
              <FaFilm style={{ marginRight: '10px' }} />
              Movie Watchlist
            </h1>
          </Link>
          
          <div className="d-flex gap-3" style={{ alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link to="/search" className="btn btn-primary">
                  <FaSearch style={{ marginRight: '8px' }} />
                  Search Movies
                </Link>
                <Link to="/watchlist" className="btn btn-secondary">
                  <FaBookmark style={{ marginRight: '8px' }} />
                  My Watchlist
                </Link>
                <div className="d-flex align-items-center gap-3" style={{ marginLeft: '2rem' }}>
                  <span style={{ color: '#667eea', fontWeight: '500' }}>
                    <FaUser style={{ marginRight: '5px' }} />
                    {user?.username}
                  </span>
                  <button onClick={handleLogout} className="btn btn-danger">
                    <FaSignOutAlt style={{ marginRight: '8px' }} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
