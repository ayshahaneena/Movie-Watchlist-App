import React, { useState, useEffect } from 'react';
import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ''
});
import { FaBookmark, FaEye, FaEyeSlash, FaTrash, FaStar, FaClock, FaUser, FaGlobe } from 'react-icons/fa';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, watched: 0, unwatched: 0 });
  const [filter, setFilter] = useState('all'); // 'all', 'watched', 'unwatched'
  // Feedback state variables removed - feature is hidden
  // const [feedbackEditingId, setFeedbackEditingId] = useState(null);
  // const [feedbackRating, setFeedbackRating] = useState(5);
  // const [feedbackReview, setFeedbackReview] = useState('');
  // const [feedbackSaving, setFeedbackSaving] = useState(false);
  // const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    loadWatchlist();
    loadStats();
  }, []);

  const loadWatchlist = async () => {
    try {
      const res = await api.get('/api/watchlist');
      setWatchlist(res.data);
    } catch (error) {
      setError('Error loading watchlist');
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/api/watchlist/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const toggleWatched = async (itemId, currentWatched) => {
    try {
      const res = await api.put(`/api/watchlist/${itemId}`, {
        watched: !currentWatched
      });
      
      // Update local state
      setWatchlist(watchlist.map(item => 
        item._id === itemId ? { ...item, watched: !currentWatched } : item
      ));
      
      // Reload stats
      loadStats();
    } catch (error) {
      console.error('Error updating watched status:', error);
    }
  };

  const removeFromWatchlist = async (itemId) => {
    try {
      await api.delete(`/api/watchlist/${itemId}`);
      setWatchlist(watchlist.filter(item => item._id !== itemId));
      loadStats();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  // openFeedbackEditor, cancelFeedbackEditor, saveFeedback functions removed - feature is hidden

  const filteredWatchlist = watchlist.filter(item => {
    if (filter === 'watched') return item.watched;
    if (filter === 'unwatched') return !item.watched;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: '2rem 0', textAlign: 'center' }}>
        <div className="card">
          <div className="card-body">
            <p>Loading your watchlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="card mb-4">
        <div className="card-header">
          <h2 style={{ margin: 0, color: '#667eea' }}>
            <FaBookmark style={{ marginRight: '10px' }} />
            My Watchlist
          </h2>
        </div>
        
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-3">
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', minWidth: '100px' }}>
                <h4 style={{ margin: 0, color: '#667eea' }}>{stats.total}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>Total</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', minWidth: '100px' }}>
                <h4 style={{ margin: 0, color: '#28a745' }}>{stats.watched}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>Watched</p>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', minWidth: '100px' }}>
                <h4 style={{ margin: 0, color: '#ffc107' }}>{stats.unwatched}</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>To Watch</p>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unwatched')}
                className={`btn ${filter === 'unwatched' ? 'btn-primary' : 'btn-secondary'}`}
              >
                To Watch
              </button>
              <button
                onClick={() => setFilter('watched')}
                className={`btn ${filter === 'watched' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Watched
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card mb-4">
          <div className="card-body">
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '15px',
              borderRadius: '5px',
              border: '1px solid #f5c6cb'
            }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {filteredWatchlist.length === 0 ? (
        <div className="card">
          <div className="card-body text-center">
            <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
              {filter === 'all' 
                ? 'Your watchlist is empty. Start adding movies from the search page!'
                : filter === 'watched'
                ? 'You haven\'t marked any movies as watched yet.'
                : 'You don\'t have any movies in your "to watch" list.'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-5" style={{ justifyContent: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          {filteredWatchlist.map((item) => (
            <div key={item._id} className="card" style={{ width: '280px', minHeight: '480px' }}>
              <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                {item.movie.poster ? (
                  <img
                    src={item.movie.poster}
                    alt={item.movie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c757d'
                  }}>
                    No Poster Available
                  </div>
                )}
                
                {/* Watched overlay */}
                {item.watched && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#28a745',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    <FaEye style={{ marginRight: '5px' }} />
                    Watched
                  </div>
                )}
              </div>
              
              <div className="card-body" style={{ padding: '1.25rem' }}>
                <h5 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
                  {item.movie.title} ({item.movie.year})
                </h5>
                
                {item.movie.rating && (
                  <p style={{ marginBottom: '8px', color: '#ffc107' }}>
                    <FaStar style={{ marginRight: '5px' }} />
                    {item.movie.rating}/10
                  </p>
                )}
                
                {item.movie.runtime && (
                  <p style={{ marginBottom: '8px', color: '#6c757d', fontSize: '0.9rem' }}>
                    <FaClock style={{ marginRight: '5px' }} />
                    {item.movie.runtime}
                  </p>
                )}
                
                {item.movie.director && (
                  <p style={{ marginBottom: '8px', color: '#6c757d', fontSize: '0.9rem' }}>
                    <FaUser style={{ marginRight: '5px' }} />
                    {item.movie.director}
                  </p>
                )}
                
                {item.movie.genre && (
                  <p style={{ marginBottom: '8px', color: '#6c757d', fontSize: '0.9rem' }}>
                    <FaGlobe style={{ marginRight: '5px' }} />
                    {item.movie.genre}
                  </p>
                )}
                
                {/* Feedback display - HIDDEN */}
                {/* {item.watched && (item.rating || item.review) && (
                  <div style={{ marginBottom: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
                    {item.rating && (
                      <p style={{ marginBottom: '6px', color: '#333' }}>
                        <FaStar style={{ marginRight: '6px', color: '#ffc107' }} />
                        {item.rating}/5
                      </p>
                    )}
                    {item.review && (
                      <p style={{ margin: 0, color: '#555', whiteSpace: 'pre-wrap' }}>
                        {item.review}
                      </p>
                    )}
                  </div>
                )} */}
                
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => toggleWatched(item._id, item.watched)}
                    className={`btn ${item.watched ? 'btn-warning' : 'btn-success'}`}
                    style={{ fontSize: '0.9rem', minWidth: '120px' }}
                  >
                    {item.watched ? (
                      <>
                        <FaEyeSlash style={{ marginRight: '5px' }} />
                        Mark Unwatched
                      </>
                    ) : (
                      <>
                        <FaEye style={{ marginRight: '5px' }} />
                        Mark Watched
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => removeFromWatchlist(item._id)}
                    className="btn btn-danger"
                    style={{ fontSize: '0.9rem', minWidth: '100px' }}
                  >
                    <FaTrash style={{ marginRight: '5px' }} />
                    Remove
                  </button>
                </div>

                {/* Feedback editor - HIDDEN */}
                {/* {feedbackEditingId === item._id && (
                  <div style={{ marginTop: '12px', background: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                    <div className="d-flex gap-2 align-items-center" style={{ marginBottom: '8px' }}>
                      <label htmlFor={`rating-${item._id}`} style={{ marginRight: '6px' }}>Rating:</label>
                      <select
                        id={`rating-${item._id}`}
                        className="form-control"
                        style={{ width: '100px' }}
                        value={feedbackRating}
                        onChange={(e) => setFeedbackRating(Number(e.target.value))}
                      >
                        <option value={5}>5</option>
                        <option value={4}>4</option>
                        <option value={3}>3</option>
                        <option value={2}>2</option>
                        <option value={1}>1</option>
                      </select>
                      <span style={{ color: '#ffc107' }}><FaStar style={{ marginLeft: '6px' }} /></span>
                    </div>
                    <textarea
                      className="form-control"
                      rows={3}
                      maxLength={1000}
                      placeholder="Share your thoughts about this movie..."
                      value={feedbackReview}
                      onChange={(e) => setFeedbackReview(e.target.value)}
                      style={{ marginBottom: '8px' }}
                    />
                    {feedbackError && (
                      <div style={{ color: '#721c24', background: '#f8d7da', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
                        {feedbackError}
                      </div>
                    )}
                    <div className="d-flex gap-2">
                      <button onClick={saveFeedback} className="btn btn-success" disabled={feedbackSaving}>
                        {feedbackSaving ? 'Saving...' : 'Save Feedback'}
                      </button>
                      <button onClick={cancelFeedbackEditor} className="btn btn-secondary">Cancel</button>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;