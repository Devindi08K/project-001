const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/images');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // Remove the 'destination-' prefix to make it more generic
    cb(null, uniqueSuffix + ext);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handler middleware
const handleError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    // An unknown error occurred
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message });
  }
  // If no error, continue
  next();
};

// Ensure upload directories exist
const imagesDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Upload image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    console.log("Upload request received");
    
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    console.log("File received:", req.file);
    console.log("File path:", req.file.path);
    console.log("File details:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      destination: req.file.destination
    });
    
    // Generate the URL that will be used to access the image
    const imageUrl = `/uploads/images/${req.file.filename}`;
    console.log("Generated image URL:", imageUrl);
    
    res.status(201).json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (err) {
    console.error('Error processing image upload:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;