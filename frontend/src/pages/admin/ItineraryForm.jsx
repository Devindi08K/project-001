import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItineraryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    days: '',
    highlights: '',
    description: '',
    price: '',
    featured: false
  });
  
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [dayByDay, setDayByDay] = useState([{ day: 1, title: '', description: '' }]);
  const [inclusions, setInclusions] = useState(['']);
  const [exclusions, setExclusions] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch all destinations for the dropdown
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => {
        setDestinations(data);
        
        // If editing, fetch the current itinerary
        if (isEditMode) {
          return fetch(`/api/itineraries/${id}`);
        }
        
        setLoading(false);
        return null;
      })
      .then(res => {
        if (res) return res.json();
        return null;
      })
      .then(data => {
        if (data) {
          setFormData({
            title: data.title,
            days: data.days || '',
            highlights: data.highlights ? data.highlights.join(', ') : '',
            description: data.description || '',
            price: data.price || '',
            featured: data.featured || false
          });
          
          setSelectedDestinations(data.destinations || []);
          
          if (data.dayByDay && data.dayByDay.length > 0) {
            setDayByDay(data.dayByDay);
          }
          
          if (data.inclusions && data.inclusions.length > 0) {
            setInclusions(data.inclusions);
          }
          
          if (data.exclusions && data.exclusions.length > 0) {
            setExclusions(data.exclusions);
          }
          
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDestinationChange = (e) => {
    const destinationId = e.target.value;
    
    // If already selected, remove it
    if (selectedDestinations.includes(destinationId)) {
      setSelectedDestinations(selectedDestinations.filter(id => id !== destinationId));
    } else {
      // Otherwise add it
      setSelectedDestinations([...selectedDestinations, destinationId]);
    }
  };

  // Handle day-by-day changes
  const handleDayChange = (index, field, value) => {
    const updatedDays = [...dayByDay];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setDayByDay(updatedDays);
  };

  const addDay = () => {
    const nextDayNumber = dayByDay.length + 1;
    setDayByDay([...dayByDay, { day: nextDayNumber, title: '', description: '' }]);
  };

  const removeDay = (index) => {
    if (dayByDay.length > 1) {
      const updatedDays = dayByDay.filter((_, i) => i !== index);
      // Renumber days
      updatedDays.forEach((day, i) => {
        day.day = i + 1;
      });
      setDayByDay(updatedDays);
    }
  };

  // Handle inclusions/exclusions
  const handleInclusionChange = (index, value) => {
    const updated = [...inclusions];
    updated[index] = value;
    setInclusions(updated);
  };

  const handleExclusionChange = (index, value) => {
    const updated = [...exclusions];
    updated[index] = value;
    setExclusions(updated);
  };

  const addInclusion = () => {
    setInclusions([...inclusions, '']);
  };

  const removeInclusion = (index) => {
    if (inclusions.length > 1) {
      setInclusions(inclusions.filter((_, i) => i !== index));
    }
  };

  const addExclusion = () => {
    setExclusions([...exclusions, '']);
  };

  const removeExclusion = (index) => {
    if (exclusions.length > 1) {
      setExclusions(exclusions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Process form data
      const processedData = {
        ...formData,
        days: parseInt(formData.days, 10),
        price: formData.price ? parseFloat(formData.price) : undefined,
        highlights: formData.highlights ? formData.highlights.split(',').map(item => item.trim()) : [],
        destinations: selectedDestinations,
        dayByDay: dayByDay.filter(day => day.title.trim() !== '' || day.description.trim() !== ''),
        inclusions: inclusions.filter(item => item.trim() !== ''),
        exclusions: exclusions.filter(item => item.trim() !== '')
      };
      
      const url = isEditMode ? `/api/itineraries/${id}` : '/api/itineraries';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });
      
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      
      // Redirect to the itineraries list after successful submission
      navigate('/admin/itineraries');
    } catch (err) {
      console.error('Error saving itinerary:', err);
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Itinerary' : 'Create New Itinerary'}
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
              placeholder="e.g. Package 1: Cultural Triangle Explorer"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="days" className="block text-gray-700 font-medium mb-2">
              Number of Days
            </label>
            <input
              type="number"
              id="days"
              name="days"
              value={formData.days}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
              Price (USD)
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
              placeholder="e.g. 850"
            />
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
              Featured Itinerary
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="highlights" className="block text-gray-700 font-medium mb-2">
            Highlights (comma-separated)
          </label>
          <input
            type="text"
            id="highlights"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            placeholder="e.g. Sigiriya Rock Fortress, Polonnaruwa Ancient City, Dambulla Cave Temples"
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
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Provide a detailed description of the itinerary..."
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Day by Day Itinerary
          </label>
          
          <div className="space-y-4 mb-4">
            {dayByDay.map((day, index) => (
              <div key={index} className="border p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Day {day.day}</h3>
                  <button 
                    type="button" 
                    onClick={() => removeDay(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => handleDayChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Arrival & Colombo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    value={day.description}
                    onChange={(e) => handleDayChange(index, 'description', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe the activities for this day..."
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            type="button" 
            onClick={addDay}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            + Add Day
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Inclusions
            </label>
            
            <div className="space-y-2 mb-2">
              {inclusions.map((inclusion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => handleInclusionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Accommodation"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeInclusion(index)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addInclusion}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              + Add Inclusion
            </button>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Exclusions
            </label>
            
            <div className="space-y-2 mb-2">
              {exclusions.map((exclusion, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => handleExclusionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. International flights"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeExclusion(index)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addExclusion}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
            >
              + Add Exclusion
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Destinations
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
            {destinations.length === 0 ? (
              <p className="text-gray-500">No destinations available</p>
            ) : (
              destinations.map(destination => (
                <div key={destination._id} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={destination._id}
                      checked={selectedDestinations.includes(destination._id)}
                      onChange={handleDestinationChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2">{destination.name} ({destination.region || 'No region'})</span>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/itineraries')}
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
            {submitting ? 'Saving...' : (isEditMode ? 'Update Itinerary' : 'Create Itinerary')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItineraryForm;