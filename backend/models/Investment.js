const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: String,
  description: String,
  price: Number,
  roi: String,
  imageUrl: String,  // This is correctly defined
  status: { 
    type: String, 
    enum: ['Available', 'Under Offer', 'Sold'], 
    default: 'Available' 
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investment', investmentSchema);