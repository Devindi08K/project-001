const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String
});

const itinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  days: { type: Number, required: true },
  description: String,
  highlights: [String],
  price: Number,
  featured: { type: Boolean, default: false },
  dayByDay: [daySchema],
  inclusions: [String],
  exclusions: [String],
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);