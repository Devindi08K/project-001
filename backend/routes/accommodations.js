const express = require('express');
const Accommodation = require('../models/Accommodation');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const accommodation = new Accommodation(req.body);
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.json(accommodations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });
    res.json(accommodation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });
    res.json(accommodation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    if (!accommodation) return res.status(404).json({ message: 'Accommodation not found' });
    res.json({ message: 'Accommodation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;