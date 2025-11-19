const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guide', guideSchema);