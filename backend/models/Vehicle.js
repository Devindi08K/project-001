const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: String,
  capacity: Number,
  pricePerDay: Number,
  available: { type: Boolean, default: true },
  imageUrl: String,
  images: [String], // Keep for backward compatibility or future multi-image support
  features: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);