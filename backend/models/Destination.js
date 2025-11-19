const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  region: { type: String, required: true },
  description: String,
  activities: [String],
  imageUrl: String,
  popularityRating: { type: Number, min: 1, max: 5, default: 3 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', destinationSchema);