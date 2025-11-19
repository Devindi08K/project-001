import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    categories: '',
    tags: '',
    published: true
  });
  
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [existingDocument, setExistingDocument] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // References to file inputs for resetting them
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const categoryOptions = [
    'Culture',
    'Adventure',
    'Food',
    'Wildlife',
    'Beach',
    'Hiking',
    'History',
    'Wellness',
    'Photography'
  ];

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/blogs/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setFormData({
            title: data.title,
            content: data.content,
            author: data.author || '',
            categories: data.categories ? data.categories.join(', ') : '',
            tags: data.tags ? data.tags.join(', ') : '',
            published: data.published !== undefined ? data.published : true
          });
          
          if (data.image) {
            setExistingImage(data.image);
          }
          
          if (data.document) {
            setExistingDocument(data.document);
            const documentName = data.document.split('/').pop();
            setDocumentName(documentName);
          }
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching blog:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocument(file);
      setDocumentName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('published', formData.published);
      
      // Process categories and tags into arrays
      if (formData.categories) {
        const categoriesArray = formData.categories.split(',').map(item => item.trim());
        // NOTE: Changed to match backend expectation - don't stringify the array
        categoriesArray.forEach(category => {
          formDataToSend.append('categories', category);
        });
      }
      
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(item => item.trim());
        // NOTE: Changed to match backend expectation - don't stringify the array
        tagsArray.forEach(tag => {
          formDataToSend.append('tags', tag);
        });
      }
      
      // Add files if selected
      if (image) {
        formDataToSend.append('image', image);
      } else if (isEditMode && existingImage) {
        // This tells the server to keep the existing image
        formDataToSend.append('keepExistingImage', 'true');
      }
      
      if (document) {
        formDataToSend.append('document', document);
      } else if (isEditMode && existingDocument) {
        // This tells the server to keep the existing document
        formDataToSend.append('keepExistingDocument', 'true');
      }
      
      const url = isEditMode ? `/api/blogs/${id}` : '/api/blogs';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Status: ${res.status}`);
      }
      
      // Redirect to the blogs list after successful submission
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    setExistingImage('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeDocument = () => {
    setDocument(null);
    setDocumentName('');
    setExistingDocument('');
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const handlePDFDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      window.open(url, '_blank');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-700 font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="categories" className="block text-gray-700 font-medium mb-2">
              Categories
            </label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="e.g. Culture, Adventure, Food"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-gray-500 mt-1">Separate categories with commas</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. travel, advice, tips"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Featured Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-teal-700"
              />
              {(imagePreview || existingImage) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="h-40 object-contain" />
              </div>
            )}
            {!imagePreview && existingImage && (
              <div className="mt-2">
                <img src={existingImage} alt="Current" className="h-40 object-contain" />
                <p className="text-sm text-gray-500">Current image</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              PDF Document
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleDocumentChange}
                ref={documentInputRef}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-teal-700"
              />
              {(document || existingDocument) && (
                <button
                  type="button"
                  onClick={removeDocument}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            {documentName && !existingDocument && (
              <div className="mt-2 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{documentName}</span>
              </div>
            )}
            {existingDocument && !document && (
              <div className="mt-2">
                <button 
                  onClick={() => handlePDFDownload(existingDocument, 'current-document.pdf')}
                  className="flex items-center space-x-2 text-primary hover:underline bg-white px-3 py-2 rounded border border-primary hover:bg-primary hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span>Download current PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-gray-700">
            Published
          </label>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (isEditMode ? 'Update Blog Post' : 'Create Blog Post')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;