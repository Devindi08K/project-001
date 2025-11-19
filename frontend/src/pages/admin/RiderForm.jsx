import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RiderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    experience: 1,
    languages: '',
    specialties: '',
    available: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/riders/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setFormData({
            name: data.name,
            type: data.type,
            description: data.description || '',
            experience: data.experience || 1,
            languages: data.languages ? data.languages.join(', ') : 'English',
            specialties: data.specialties ? data.specialties.join(', ') : '',
            available: data.available !== undefined ? data.available : true
          });
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching rider:', err);
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
      const processedData = {
        ...formData,
        experience: Number(formData.experience),
        languages: formData.languages ? formData.languages.split(',').map(item => item.trim()) : ['English'],
        specialties: formData.specialties ? formData.specialties.split(',').map(item => item.trim()) : []
      };
      
      const url = isEditMode ? `/api/riders/${id}` : '/api/riders';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });
      
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      
      // Redirect to the riders list after successful submission
      navigate('/admin/riders');
    } catch (err) {
      console.error('Error saving rider:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  const riderTypes = [
    'Motorbike Rider',
    'Tuk Tuk Rider', 
    'Car Rider', 
    'Mini Coach & Bus Rider'
  ];

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Rider' : 'Add New Rider'}
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
              placeholder="e.g. Kumara Perera"
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
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a type</option>
              {riderTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">
              Experience (years)
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. 5"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="languages" className="block text-gray-700 font-medium mb-2">
              Languages (comma-separated)
            </label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. English, Sinhala, Tamil"
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
          <label htmlFor="specialties" className="block text-gray-700 font-medium mb-2">
            Specialties (comma-separated)
          </label>
          <input
            type="text"
            id="specialties"
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            placeholder="e.g. Mountain routes, City tours, Wildlife excursions"
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
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Provide details about the rider's experience, background, etc."
          ></textarea>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/riders')}
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
            {submitting ? 'Saving...' : (isEditMode ? 'Update Rider' : 'Add Rider')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RiderForm;