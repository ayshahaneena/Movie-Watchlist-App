const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  imdbID: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  poster: {
    type: String
  },
  plot: {
    type: String
  },
  director: {
    type: String
  },
  actors: {
    type: String
  },
  genre: {
    type: String
  },
  rating: {
    type: String
  },
  runtime: {
    type: String
  },
  language: {
    type: String
  },
  country: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);

