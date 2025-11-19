const express = require('express');
const Guide = require('../models/Guide');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const guide = new Guide(req.body);
    await guide.save();
    res.status(201).json(guide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json(guide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json({ message: 'Guide deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;