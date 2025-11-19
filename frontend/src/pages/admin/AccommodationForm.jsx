import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AccommodationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    pricePerNight: '',
    amenities: '',
    available: true,
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
      fetch(`/api/accommodations/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setFormData({
            name: data.name,
            location: data.location,
            description: data.description || '',
            pricePerNight: data.pricePerNight || '',
            amenities: data.amenities ? data.amenities.join(', ') : '',
            available: data.available !== undefined ? data.available : true,
            imageUrl: data.imageUrl || ''
          });
          
          if (data.imageUrl) {
            setExistingImage(data.imageUrl);
          }
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching accommodation:', err);
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
      // Process form data
      const processedData = {
        ...formData,
        pricePerNight: formData.pricePerNight ? Number(formData.pricePerNight) : undefined,
        amenities: formData.amenities ? formData.amenities.split(',').map(item => item.trim()) : []
      };
      
      // If an image file is selected, upload it first
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        
        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: imageFormData
        });
        
        if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
        
        const uploadData = await uploadRes.json();
        processedData.imageUrl = uploadData.imageUrl;
      } else if (formData.imageUrl) {
        // Keep the provided URL
        processedData.imageUrl = formData.imageUrl;
      }
      
      const url = isEditMode ? `/api/accommodations/${id}` : '/api/accommodations';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });
      
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      
      // Redirect to the accommodations list after successful submission
      navigate('/admin/accommodations');
    } catch (err) {
      console.error('Error saving accommodation:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const accommodationTypes = [
    'Beach Villas',
    'Private Villas',
    'Luxury Apartments',
    'Home Stay with Local Family',
    'Family Apartments',
    'Sharing Apartments with Local Family',
    'Hotel Rooms',
    'Boutique Hotels',
    'Eco Lodges',
    'Resorts'
  ];

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Accommodation' : 'Add New Accommodation'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Beachfront Villa in Mirissa"
            />
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Mirissa, Southern Province"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a type</option>
              {accommodationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="pricePerNight" className="block text-gray-700 font-medium mb-2">
              Price Per Night (USD)
            </label>
            <input
              type="number"
              id="pricePerNight"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 150"
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-gray-700">
              Available for Booking
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Image
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="imageUrl" className="block text-gray-700 text-sm mb-2">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="imageFile" className="block text-gray-700 text-sm mb-2">
                Or Upload Image
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
            </div>
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
          <label htmlFor="amenities" className="block text-gray-700 font-medium mb-2">
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g. WiFi, Pool, Air Conditioning, Kitchen, Ocean View"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
            placeholder="Provide a detailed description of the accommodation..."
          ></textarea>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/accommodations')}
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
            {submitting ? 'Saving...' : (isEditMode ? 'Update Accommodation' : 'Add Accommodation')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AccommodationForm;