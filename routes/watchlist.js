const express = require('express');
const WatchlistItem = require('../models/WatchlistItem');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const watchlistItems = await WatchlistItem.find({ user: req.user._id })
      .populate('movie')
      .sort({ addedAt: -1 });

    res.json(watchlistItems);
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/watchlist
// @desc    Add movie to watchlist
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if movie is already in watchlist
    const existingItem = await WatchlistItem.findOne({
      user: req.user._id,
      movie: movieId
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Movie is already in your watchlist' });
    }

    // Add to watchlist
    const watchlistItem = new WatchlistItem({
      user: req.user._id,
      movie: movieId,
      watched: false
    });

    await watchlistItem.save();

    // Populate movie details
    await watchlistItem.populate('movie');

    res.json(watchlistItem);
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/watchlist/:id
// @desc    Update watchlist item (mark as watched/unwatched)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { watched } = req.body;
    const { id } = req.params;

    if (typeof watched !== 'boolean') {
      return res.status(400).json({ message: 'Watched status is required' });
    }

    const watchlistItem = await WatchlistItem.findOne({
      _id: id,
      user: req.user._id
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    watchlistItem.watched = watched;
    if (watched) {
      watchlistItem.watchedAt = new Date();
    } else {
      watchlistItem.watchedAt = undefined;
    }

    await watchlistItem.save();
    await watchlistItem.populate('movie');

    res.json(watchlistItem);
  } catch (error) {
    console.error('Update watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/watchlist/:id/feedback
// @desc    Add or update feedback (rating/review) for a watched movie
// @access  Private
router.put('/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id } = req.params;

    const watchlistItem = await WatchlistItem.findOne({
      _id: id,
      user: req.user._id
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    if (!watchlistItem.watched) {
      return res.status(400).json({ message: 'You can only leave feedback for watched movies' });
    }

    if (rating !== undefined) {
      const numRating = Number(rating);
      if (!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
      }
      watchlistItem.rating = numRating;
    }

    if (review !== undefined) {
      const sanitized = String(review).trim();
      if (sanitized.length > 1000) {
        return res.status(400).json({ message: 'Review is too long (max 1000 characters)' });
      }
      watchlistItem.review = sanitized || undefined;
    }

    watchlistItem.reviewedAt = new Date();

    await watchlistItem.save();
    await watchlistItem.populate('movie');

    res.json(watchlistItem);
  } catch (error) {
    console.error('Feedback update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/watchlist/:id
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const watchlistItem = await WatchlistItem.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/watchlist/by-movie/:movieId
// @desc    Remove movie from watchlist by movie ID
// @access  Private
router.delete('/by-movie/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;

    const watchlistItem = await WatchlistItem.findOneAndDelete({
      movie: movieId,
      user: req.user._id
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    res.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Remove by movie from watchlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/watchlist/stats
// @desc    Get user's watchlist statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const totalItems = await WatchlistItem.countDocuments({ user: req.user._id });
    const watchedItems = await WatchlistItem.countDocuments({ 
      user: req.user._id, 
      watched: true 
    });
    const unwatchedItems = totalItems - watchedItems;

    res.json({
      total: totalItems,
      watched: watchedItems,
      unwatched: unwatchedItems
    });
  } catch (error) {
    console.error('Get watchlist stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
