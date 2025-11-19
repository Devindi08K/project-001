import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function InvestmentsAdmin() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/investments')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setInvestments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching investments:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deleteInvestment = async (id) => {
    if (window.confirm('Are you sure you want to delete this investment opportunity?')) {
      try {
        const res = await fetch(`/api/investments/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        
        // Remove the deleted investment from state
        setInvestments(investments.filter(inv => inv._id !== id));
      } catch (err) {
        console.error('Error deleting investment:', err);
        alert('Failed to delete investment: ' + err.message);
      }
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const res = await fetch(`/api/investments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      });
      
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      
      // Update the featured status in the state
      setInvestments(investments.map(inv => 
        inv._id === id ? { ...inv, featured: !inv.featured } : inv
      ));
    } catch (err) {
      console.error('Error updating featured status:', err);
      alert('Failed to update featured status: ' + err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Under Offer':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Investment Opportunities</h1>
        <Link to="/admin/investments/new" className="btn btn-primary">
          Add New Investment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No investment opportunities found. Add your first investment!
                </td>
              </tr>
            ) : (
              investments.map(investment => (
                <tr key={investment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{investment.title}</div>
                    <div className="text-xs text-gray-500">{investment.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {investment.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${investment.price?.toLocaleString() || 'Contact for price'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(investment.status)}`}>
                      {investment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(investment._id, investment.featured)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {investment.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/investments/edit/${investment._id}`} className="text-primary hover:text-primary-dark mr-4">
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteInvestment(investment._id)} 
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

export default InvestmentsAdmin;