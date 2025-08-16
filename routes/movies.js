const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/movies/search
// @desc    Search movies via OMDb API
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'OMDb API key not configured' });
    }

    // Search for movies
    const searchResponse = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(query)}&page=${page}&apikey=${apiKey}`);
    
    if (searchResponse.data.Response === 'False') {
      return res.json({ 
        movies: [], 
        totalResults: 0, 
        currentPage: parseInt(page) 
      });
    }

    const { Search: movies, totalResults } = searchResponse.data;
    
    // Get detailed information for each movie
    const detailedMovies = await Promise.all(
      movies.map(async (movie) => {
        try {
          // Check if movie already exists in our database
          let existingMovie = await Movie.findOne({ imdbID: movie.imdbID });
          
          if (!existingMovie) {
            // Fetch detailed movie info
            const detailResponse = await axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
            const movieDetail = detailResponse.data;
            
            if (movieDetail.Response === 'True') {
              // Create new movie in database
              existingMovie = new Movie({
                imdbID: movieDetail.imdbID,
                title: movieDetail.Title,
                year: movieDetail.Year,
                poster: movieDetail.Poster !== 'N/A' ? movieDetail.Poster : null,
                plot: movieDetail.Plot,
                director: movieDetail.Director,
                actors: movieDetail.Actors,
                genre: movieDetail.Genre,
                rating: movieDetail.imdbRating,
                runtime: movieDetail.Runtime,
                language: movieDetail.Language,
                country: movieDetail.Country
              });
              
              await existingMovie.save();
            }
          }
          
          return existingMovie;
        } catch (error) {
          console.error(`Error fetching movie details for ${movie.imdbID}:`, error);
          return null;
        }
      })
    );

    // Filter out null values and return results
    const validMovies = detailedMovies.filter(movie => movie !== null);
    
    res.json({
      movies: validMovies,
      totalResults: parseInt(totalResults),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Movie search error:', error);
    res.status(500).json({ message: 'Error searching movies' });
  }
});

// @route   GET /api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

