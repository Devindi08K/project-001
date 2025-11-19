import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AccommodationsAdmin() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/accommodations')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setAccommodations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching accommodations:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteAccommodation = async (id) => {
    if (window.confirm('Are you sure you want to delete this accommodation?')) {
      try {
        const res = await fetch(`/api/accommodations/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        // Remove the deleted accommodation from state
        setAccommodations(accommodations.filter(accom => accom._id !== id));
      } catch (err) {
        console.error('Error deleting accommodation:', err);
        alert('Failed to delete accommodation: ' + err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Accommodations</h1>
        <Link to="/admin/accommodations/new" className="btn btn-primary">
          Add New Accommodation
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Night (USD)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accommodations.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No accommodations found. Add your first accommodation!
                </td>
              </tr>
            ) : (
              accommodations.map(accom => (
                <tr key={accom._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {accom.imageUrl && (
                        <div className="flex-shrink-0 h-10 w-10 mr-3">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={accom.imageUrl} 
                            alt="" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/40?text=NA';
                            }}
                          />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{accom.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{accom.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{accom.type || 'Not specified'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${accom.pricePerNight || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      accom.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {accom.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/accommodations/edit/${accom._id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteAccommodation(accom._id)} 
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

export default AccommodationsAdmin;