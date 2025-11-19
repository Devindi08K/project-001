const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mernapp';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

mongoose.connect(MONGO_URI, { dbName: 'project001' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const blogRoutes = require('./routes/blogs');
const vehicleRoutes = require('./routes/vehicles');
const accommodationRoutes = require('./routes/accommodations');
const destinationRoutes = require('./routes/destinations');
const authRoutes = require('./routes/auth');
const itineraryRoutes = require('./routes/itineraries');
const investmentRoutes = require('./routes/investments');
const uploadRoutes = require('./routes/uploads');
const riderRoutes = require('./routes/riders'); // Add this to your imports
const guideRoutes = require('./routes/guides'); // Add this import

// Auth middleware
const { auth, adminOnly } = require('./middleware/auth');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/riders', riderRoutes); // Then register the route
app.use('/api/guides', guideRoutes); // Then register the route

// Basic route
app.get('/api', (req, res) => {
  res.send('API is running');
});

// Protected admin route example
app.get('/api/admin', auth, adminOnly, (req, res) => {
  res.json({ message: 'Admin access granted', user: req.user });
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const documentsDir = path.join(uploadsDir, 'documents');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.startsWith('image/') ? 'images' : 'documents';
    const dir = path.join(uploadsDir, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add this after the static files middleware configuration

// Debug log for image requests
app.use('/uploads/images', (req, res, next) => {
  console.log(`Image requested: ${req.url}`);
  next();
});

// Add this middleware for serving uploaded documents with proper headers
app.use('/uploads/documents', (req, res, next) => {
  // Set proper headers for PDF files
  if (req.path.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment'); // This forces download
  }
  next();
}, express.static(path.join(__dirname, 'uploads/documents')));

// Stats route for dashboard
app.get('/api/stats', async (req, res) => {
  try {
    // Use Promise.all to run all queries in parallel
    const [
      destinations,
      vehicles,
      accommodations,
      blogs,
      itineraries,
      investments,
      riders,
      guides
    ] = await Promise.all([
      mongoose.model('Destination').countDocuments(),
      mongoose.model('Vehicle').countDocuments(),
      mongoose.model('Accommodation').countDocuments(),
      mongoose.model('Blog').countDocuments(),
      mongoose.model('Itinerary').countDocuments(),
      mongoose.model('Investment').countDocuments(),
      mongoose.model('Rider').countDocuments(),
      mongoose.model('Guide').countDocuments()
    ]);

    res.json({
      destinations,
      vehicles,
      accommodations,
      blogs,
      itineraries,
      investments,
      riders,
      guides
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Only listen if not running on Vercel (Vercel handles the port automatically)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;