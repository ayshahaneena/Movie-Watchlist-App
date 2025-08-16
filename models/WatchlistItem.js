const mongoose = require('mongoose');

const watchlistItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  watched: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  watchedAt: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  reviewedAt: {
    type: Date
  }
});

// Ensure user can only have one instance of a movie in their watchlist
watchlistItemSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema);
