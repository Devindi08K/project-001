import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RidersAdmin() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/riders')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setRiders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching riders:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteRider = async (id) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      try {
        const res = await fetch(`/api/riders/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        // Remove the deleted rider from state
        setRiders(riders.filter(rider => rider._id !== id));
      } catch (err) {
        console.error('Error deleting rider:', err);
        alert('Failed to delete rider: ' + err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Riders</h1>
        <Link to="/admin/riders/new" className="btn btn-primary">
          Add New Rider
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Languages</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {riders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No riders found. Add your first rider!
                </td>
              </tr>
            ) : (
              riders.map(rider => (
                <tr key={rider._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{rider.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rider.experience} {rider.experience === 1 ? 'year' : 'years'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rider.languages?.join(', ') || 'English'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rider.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rider.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/riders/edit/${rider._id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteRider(rider._id)} 
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

export default RidersAdmin;