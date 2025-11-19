const express = require('express');
const Rider = require('../models/Rider');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const rider = new Rider(req.body);
    await rider.save();
    res.status(201).json(rider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const riders = await Rider.find();
    res.json(riders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: 'Rider not found' });
    res.json(rider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const rider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rider) return res.status(404).json({ message: 'Rider not found' });
    res.json(rider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const rider = await Rider.findByIdAndDelete(req.params.id);
    if (!rider) return res.status(404).json({ message: 'Rider not found' });
    res.json({ message: 'Rider deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;