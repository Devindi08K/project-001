import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GuideForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    available: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/guides/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setFormData({
            title: data.title,
            description: data.description || '',
            details: data.details || '',
            available: data.available !== undefined ? data.available : true
          });
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching guide:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = isEditMode ? `/api/guides/${id}` : '/api/guides';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      
      // Redirect to the guides list after successful submission
      navigate('/admin/guides');
    } catch (err) {
      console.error('Error saving guide:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Guide Type' : 'Add New Guide Type'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
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
            placeholder="e.g. Area Guides"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Short Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Local experts with deep knowledge of specific regions"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="details" className="block text-gray-700 font-medium mb-2">
            Detailed Description
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="5"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Provide detailed information about this guide type..."
          ></textarea>
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
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/guides')}
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
            {submitting ? 'Saving...' : (isEditMode ? 'Update Guide Type' : 'Add Guide Type')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default GuideForm;