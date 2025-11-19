const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Motorbike Rider', 'Tuk Tuk Rider', 'Car Rider', 'Mini Coach & Bus Rider']
  },
  description: String,
  experience: { type: Number, default: 1 }, // Years of experience
  languages: [String],
  available: { type: Boolean, default: true },
  specialties: [String], // e.g., "Mountain routes", "City tours", etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rider', riderSchema);