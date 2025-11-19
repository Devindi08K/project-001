import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function InvestmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    price: '',
    roi: '',
    status: 'Available',
    featured: false,
    imageUrl: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/investments/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setFormData({
            title: data.title,
            category: data.category,
            location: data.location || '',
            description: data.description || '',
            price: data.price || '',
            roi: data.roi || '',
            status: data.status || 'Available',
            featured: data.featured || false,
            imageUrl: data.imageUrl || ''
          });
          
          if (data.imageUrl) {
            setExistingImage(data.imageUrl);
          }
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching investment:', err);
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
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any URL that might have been set
      setFormData(prev => ({
        ...prev,
        imageUrl: ''
      }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    setExistingImage('');
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const processedData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined
      };
      
      // If an image file is selected, upload it first
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        
        console.log("Uploading image file...");
        
        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: imageFormData
        });
        
        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(`Upload failed: ${uploadRes.status} - ${errorText}`);
        }
        
        const uploadData = await uploadRes.json();
        console.log("Image upload response:", uploadData);
        
        // Use the URL from the server response
        processedData.imageUrl = uploadData.imageUrl;
      } else if (formData.imageUrl) {
        // Just keep the URL provided by the user
        console.log("Using provided image URL:", formData.imageUrl);
        processedData.imageUrl = formData.imageUrl;
      }
      
      console.log("Final data to submit:", processedData);
      
      const url = isEditMode ? `/api/investments/${id}` : '/api/investments';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed: ${res.status} - ${errorText}`);
      }
      
      // Redirect to the investments list after successful submission
      navigate('/admin/investments');
    } catch (err) {
      console.error('Error saving investment:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const investmentCategories = [
    'Land',
    'Beach Front Property',
    'Villas',
    'Colonial Villas',
    'Agriculture Farms',
    'Jungle Land',
    'River Front Land',
    'Hotels',
    'Boutique Villas',
    'Cafe & Restaurant',
    'Exotic Products'
  ];

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Investment Opportunity' : 'Add New Investment Opportunity'}
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
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {investmentCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="roi" className="block text-gray-700 font-medium mb-2">
              ROI (Return on Investment)
            </label>
            <input
              type="text"
              id="roi"
              name="roi"
              value={formData.roi}
              onChange={handleChange}
              placeholder="e.g. 15% annually"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Available">Available</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-gray-700">
              Featured Investment
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Image
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="imageFile"
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
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/investments')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (isEditMode ? 'Update Investment' : 'Add Investment')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InvestmentForm;