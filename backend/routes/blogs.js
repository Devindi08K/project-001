const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, '../uploads');
    if (file.fieldname === 'image') {
      uploadPath = path.join(uploadPath, 'images');
    } else if (file.fieldname === 'document') {
      uploadPath = path.join(uploadPath, 'documents');
    }
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'));
    }
  } else if (file.fieldname === 'document') {
    // Accept only PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Not a PDF! Please upload only PDF documents.'));
    }
  } else {
    cb(new Error('Unexpected field'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
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

// Read all
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle array fields properly (categories, tags)
const processArrayFields = (req, res, next) => {
  // Convert single item to array for consistency
  if (req.body.categories && !Array.isArray(req.body.categories)) {
    req.body.categories = [req.body.categories];
  }
  
  if (req.body.tags && !Array.isArray(req.body.tags)) {
    req.body.tags = [req.body.tags];
  }
  
  // Convert string 'true'/'false' to boolean for published field
  if (req.body.published !== undefined) {
    req.body.published = req.body.published === 'true' || req.body.published === true;
  }
  
  next();
};

// Create
router.post('/', 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  handleError,
  processArrayFields,
  async (req, res) => {
    try {
      const blogData = { ...req.body };
      
      // Add image path if uploaded
      if (req.files && req.files.image && req.files.image.length > 0) {
        const relativePath = '/uploads/images/' + path.basename(req.files.image[0].path);
        blogData.image = relativePath;
      }
      
      // Add document path if uploaded
      if (req.files && req.files.document && req.files.document.length > 0) {
        const relativePath = '/uploads/documents/' + path.basename(req.files.document[0].path);
        blogData.document = relativePath;
      }
      
      const blog = new Blog(blogData);
      await blog.save();
      res.status(201).json(blog);
    } catch (err) {
      console.error('Error creating blog:', err);
      res.status(400).json({ error: err.message });
    }
  }
);

// Update
router.put('/:id', 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  handleError,
  processArrayFields,
  async (req, res) => {
    try {
      const blogData = { ...req.body, updatedAt: Date.now() };
      
      // Get the existing blog to handle file updates properly
      const existingBlog = await Blog.findById(req.params.id);
      if (!existingBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      // Handle image update
      if (req.files && req.files.image && req.files.image.length > 0) {
        // Add new image path
        const relativePath = '/uploads/images/' + path.basename(req.files.image[0].path);
        blogData.image = relativePath;
        
        // Delete old image if it exists and is different
        if (existingBlog.image && existingBlog.image !== relativePath) {
          const oldPath = path.join(__dirname, '..', existingBlog.image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      } else if (req.body.keepExistingImage === 'true') {
        // Keep existing image
        blogData.image = existingBlog.image;
      } else if (!req.body.keepExistingImage) {
        // Remove image if not explicitly keeping it
        blogData.image = undefined;
        
        // Delete old image if it exists
        if (existingBlog.image) {
          const oldPath = path.join(__dirname, '..', existingBlog.image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }
      
      // Handle document update
      if (req.files && req.files.document && req.files.document.length > 0) {
        // Add new document path
        const relativePath = '/uploads/documents/' + path.basename(req.files.document[0].path);
        blogData.document = relativePath;
        
        // Delete old document if it exists and is different
        if (existingBlog.document && existingBlog.document !== relativePath) {
          const oldPath = path.join(__dirname, '..', existingBlog.document);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      } else if (req.body.keepExistingDocument === 'true') {
        // Keep existing document
        blogData.document = existingBlog.document;
      } else if (!req.body.keepExistingDocument) {
        // Remove document if not explicitly keeping it
        blogData.document = undefined;
        
        // Delete old document if it exists
        if (existingBlog.document) {
          const oldPath = path.join(__dirname, '..', existingBlog.document);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }
      
      const blog = await Blog.findByIdAndUpdate(req.params.id, blogData, { new: true });
      res.json(blog);
    } catch (err) {
      console.error('Error updating blog:', err);
      res.status(400).json({ error: err.message });
    }
  }
);

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Delete associated files
    if (blog.image) {
      const imagePath = path.join(__dirname, '..', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (blog.document) {
      const documentPath = path.join(__dirname, '..', blog.document);
      if (fs.existsSync(documentPath)) {
        fs.unlinkSync(documentPath);
      }
    }
    
    // Delete the blog
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;