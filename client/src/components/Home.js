import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFilm, FaSearch, FaBookmark, FaStar } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body">
          <div style={{ fontSize: '4rem', color: '#667eea', marginBottom: '1rem' }}>
            <FaFilm />
          </div>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>
            Welcome to Movie Watchlist
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            Discover, track, and organize your favorite movies. Search through thousands of films, 
            create your personal watchlist, and never lose track of what you want to watch.
          </p>
          
          <div className="d-flex justify-content-center gap-3 mb-4">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }}>
                <FaSearch />
              </div>
              <h3>Search Movies</h3>
              <p>Find movies using the powerful OMDb API</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }}>
                <FaBookmark />
              </div>
              <h3>Save to Watchlist</h3>
              <p>Keep track of movies you want to watch</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }}>
                <FaStar />
              </div>
              <h3>Mark as Watched</h3>
              <p>Track your viewing progress</p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="d-flex justify-content-center gap-3">
              <Link to="/search" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
                <FaSearch style={{ marginRight: '8px' }} />
                Start Searching
              </Link>
              <Link to="/watchlist" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
                <FaBookmark style={{ marginRight: '8px' }} />
                View Watchlist
              </Link>
            </div>
          ) : (
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Features</h2>
        <div className="d-flex justify-content-center gap-4 flex-wrap" style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '10px', 
            minWidth: '250px',
            flex: '1 1 250px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4>Secure Authentication</h4>
            <p>JWT-based secure user accounts</p>
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '10px', 
            minWidth: '250px',
            flex: '1 1 250px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4>OMDb Integration</h4>
            <p>Access to comprehensive movie database</p>
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '10px', 
            minWidth: '250px',
            flex: '1 1 250px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4>Personal Watchlist</h4>
            <p>Organize your movie collection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
