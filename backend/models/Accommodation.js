const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String },
  description: String,
  pricePerNight: Number,
  amenities: [String],
  available: { type: Boolean, default: true },
  imageUrl: String,
  images: [String], // Keep this for potential future multi-image support
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Accommodation', accommodationSchema);