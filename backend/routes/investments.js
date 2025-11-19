const express = require('express');
const Investment = require('../models/Investment');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const investment = new Investment(req.body);
    await investment.save();
    res.status(201).json(investment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const investments = await Investment.find();
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const investment = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json(investment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const investment = await Investment.findByIdAndDelete(req.params.id);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });
    res.json({ message: 'Investment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;