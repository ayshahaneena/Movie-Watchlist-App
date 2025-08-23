import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { FaSearch, FaBookmark, FaStar, FaClock, FaUser, FaGlobe } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [watchlist, setWatchlist] = useState([]);

  const searchMovies = useCallback(async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/movies/search?query=${encodeURIComponent(searchQuery)}&page=${page}`);
      setMovies(res.data.movies);
      setTotalResults(res.data.totalResults);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      setError(error.response?.data?.message || 'Error searching movies');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWatchlist = useCallback(async () => {
    try {
      const res = await api.get('/api/watchlist');
      setWatchlist(res.data.map(item => item.movie._id));
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchMovies(query, 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    searchMovies(query, newPage);
  };

  const addToWatchlist = async (movieId) => {
    try {
      await api.post('/api/watchlist', { movieId });
      setWatchlist([...watchlist, movieId]);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.delete(`/api/watchlist/by-movie/${movieId}`);
      setWatchlist(watchlist.filter(id => id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.includes(movieId);
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="card mb-4">
        <div className="card-header">
          <h2 style={{ margin: 0, color: '#667eea' }}>
            <FaSearch style={{ marginRight: '10px' }} />
            Search Movies
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSearch} className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
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

      {movies.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>
              Search Results ({totalResults} movies found)
            </h3>
          </div>
          
          <div className="card-body">
            <div className="d-flex flex-wrap gap-5" style={{ justifyContent: 'center', maxWidth: '1200px', margin: '0 auto' }}>
              {movies.map((movie) => (
                <div key={movie._id} className="card" style={{ width: '280px', minHeight: '480px' }}>
                  <div style={{ height: '320px', overflow: 'hidden' }}>
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
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
                  </div>
                  
                  <div className="card-body" style={{ padding: '1.25rem' }}>
                    <h5 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
                      {movie.title} ({movie.year})
                    </h5>
                    
                    {movie.rating && (
                      <p style={{ marginBottom: '8px', color: '#ffc107' }}>
                        <FaStar style={{ marginRight: '5px' }} />
                        {movie.rating}/10
                      </p>
                    )}
                    
                    {movie.runtime && (
                      <p style={{ marginBottom: '8px', color: '#6c757d', fontSize: '0.9rem' }}>
                        <FaClock style={{ marginRight: '5px' }} />
                        {movie.runtime}
                      </p>
                    )}
                    
                    {movie.director && (
                      <p style={{ marginBottom: '8px', color: '#6c757d', fontSize: '0.9rem' }}>
                        <FaUser style={{ marginRight: '5px' }} />
                        {movie.director}
                      </p>
                    )}
                    
                    {movie.genre && (
                      <p style={{ marginBottom: '8px', color: '#6c757d', fontSize: '0.9rem' }}>
                        <FaGlobe style={{ marginRight: '5px' }} />
                        {movie.genre}
                      </p>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        onClick={() => isInWatchlist(movie._id) 
                          ? removeFromWatchlist(movie._id)
                          : addToWatchlist(movie._id)
                        }
                        className={`btn ${isInWatchlist(movie._id) ? 'btn-danger' : 'btn-success'}`}
                        style={{ fontSize: '0.9rem' }}
                      >
                        <FaBookmark style={{ marginRight: '5px' }} />
                        {isInWatchlist(movie._id) ? 'Remove' : 'Add to Watchlist'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="btn btn-secondary"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <span style={{ padding: '10px 15px', background: '#f8f9fa', borderRadius: '5px' }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="btn btn-secondary"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && movies.length === 0 && query && (
        <div className="card">
          <div className="card-body text-center">
            <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
              No movies found for "{query}". Try a different search term.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
