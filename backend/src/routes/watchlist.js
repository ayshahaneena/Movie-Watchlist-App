const express = require('express');
const WatchlistItem = require('../models/WatchlistItem');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const items = await WatchlistItem.find({ user: req.user._id }).populate('movie').sort({ addedAt: -1 });
    res.json(items);
  } catch (e) {
    console.error('Get watchlist error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID is required' });
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    const existing = await WatchlistItem.findOne({ user: req.user._id, movie: movieId });
    if (existing) return res.status(400).json({ message: 'Movie is already in your watchlist' });
    const item = new WatchlistItem({ user: req.user._id, movie: movieId, watched: false });
    await item.save();
    await item.populate('movie');
    res.json(item);
  } catch (e) {
    console.error('Add to watchlist error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { watched } = req.body;
    const { id } = req.params;
    if (typeof watched !== 'boolean') return res.status(400).json({ message: 'Watched status is required' });
    const item = await WatchlistItem.findOne({ _id: id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Watchlist item not found' });
    item.watched = watched;
    item.watchedAt = watched ? new Date() : undefined;
    await item.save();
    await item.populate('movie');
    res.json(item);
  } catch (e) {
    console.error('Update watchlist error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await WatchlistItem.findOneAndDelete({ _id: id, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Watchlist item not found' });
    res.json({ message: 'Movie removed from watchlist' });
  } catch (e) {
    console.error('Remove from watchlist error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/by-movie/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const item = await WatchlistItem.findOneAndDelete({ movie: movieId, user: req.user._id });
    if (!item) return res.status(404).json({ message: 'Watchlist item not found' });
    res.json({ message: 'Movie removed from watchlist' });
  } catch (e) {
    console.error('Remove by movie from watchlist error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const total = await WatchlistItem.countDocuments({ user: req.user._id });
    const watched = await WatchlistItem.countDocuments({ user: req.user._id, watched: true });
    res.json({ total, watched, unwatched: total - watched });
  } catch (e) {
    console.error('Get watchlist stats error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


