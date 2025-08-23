const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ message: 'OMDb API key not configured' });

    const searchResponse = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(query)}&page=${page}&apikey=${apiKey}`);
    if (searchResponse.data.Response === 'False') {
      return res.json({ movies: [], totalResults: 0, currentPage: parseInt(page) });
    }

    const { Search: movies, totalResults } = searchResponse.data;
    const detailedMovies = await Promise.all(
      movies.map(async (movie) => {
        try {
          let existingMovie = await Movie.findOne({ imdbID: movie.imdbID });
          if (!existingMovie) {
            const detailResponse = await axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
            const md = detailResponse.data;
            if (md.Response === 'True') {
              existingMovie = new Movie({
                imdbID: md.imdbID,
                title: md.Title,
                year: md.Year,
                poster: md.Poster !== 'N/A' ? md.Poster : null,
                plot: md.Plot,
                director: md.Director,
                actors: md.Actors,
                genre: md.Genre,
                rating: md.imdbRating,
                runtime: md.Runtime,
                language: md.Language,
                country: md.Country
              });
              await existingMovie.save();
            }
          }
          return existingMovie;
        } catch (e) {
          console.error(`Error fetching movie details for ${movie.imdbID}:`, e);
          return null;
        }
      })
    );

    const validMovies = detailedMovies.filter(Boolean);
    res.json({ movies: validMovies, totalResults: parseInt(totalResults), currentPage: parseInt(page) });
  } catch (error) {
    console.error('Movie search error:', error);
    res.status(500).json({ message: 'Error searching movies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


