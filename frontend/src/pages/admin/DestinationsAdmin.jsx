import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DestinationsAdmin() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setDestinations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching destinations:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteDestination = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const res = await fetch(`/api/destinations/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        // Remove the deleted destination from state
        setDestinations(destinations.filter(dest => dest._id !== id));
      } catch (err) {
        console.error('Error deleting destination:', err);
        alert('Failed to delete destination: ' + err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Destinations</h1>
        <Link to="/admin/destinations/new" className="btn btn-primary">
          Add New Destination
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No destinations found. Add your first destination!
                </td>
              </tr>
            ) : (
              destinations.map(dest => (
                <tr key={dest._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dest.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{dest.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dest.region || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/destinations/edit/${dest._id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteDestination(dest._id)} 
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

export default DestinationsAdmin;