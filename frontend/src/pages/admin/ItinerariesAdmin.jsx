import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ItinerariesAdmin() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/itineraries')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setItineraries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching itineraries:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteItinerary = async (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        const res = await fetch(`/api/itineraries/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        // Remove the deleted itinerary from state
        setItineraries(itineraries.filter(itin => itin._id !== id));
      } catch (err) {
        console.error('Error deleting itinerary:', err);
        alert('Failed to delete itinerary: ' + err.message);
      }
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const res = await fetch(`/api/itineraries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      });
      
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      
      // Update the featured status in the state
      setItineraries(itineraries.map(itin => 
        itin._id === id ? { ...itin, featured: !itin.featured } : itin
      ));
    } catch (err) {
      console.error('Error updating featured status:', err);
      alert('Failed to update featured status: ' + err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Itineraries</h1>
        <Link to="/admin/itineraries/new" className="btn btn-primary">
          Add New Itinerary
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itineraries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No itineraries found. Add your first itinerary!
                </td>
              </tr>
            ) : (
              itineraries.map(itinerary => (
                <tr key={itinerary._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{itinerary.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {itinerary.days} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${itinerary.price || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(itinerary._id, itinerary.featured)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        itinerary.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {itinerary.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/itineraries/edit/${itinerary._id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteItinerary(itinerary._id)} 
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItinerariesAdmin;