import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [featuredInvestments, setFeaturedInvestments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    setLoading(true);
    fetch('/api/investments')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setInvestments(data);
        setFeaturedInvestments(data.filter(inv => inv.featured));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching investments:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Function to get status badge class
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

  // Filter investments by category
  const filteredInvestments = selectedCategory === 'All' 
    ? investments 
    : investments.filter(inv => inv.category === selectedCategory);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Investment Opportunities in Sri Lanka</h1>
      
      <p className="mb-6">
        Sri Lanka offers a wealth of investment opportunities across various sectors, 
        particularly in tourism and hospitality. With its growing popularity as a travel 
        destination, now is an excellent time to consider investing in this beautiful island nation.
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
          Error loading investments: {error}
        </div>
      ) : (
        <>
          {/* Featured investments */}
          {featuredInvestments.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Featured Investment Opportunities</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredInvestments.map(investment => (
                  <div key={investment._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {investment.imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={investment.imageUrl} 
                          alt={investment.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image: ${investment.imageUrl}`);
                            e.target.onerror = null; // Prevent infinite error loop
                            e.target.style.display = 'none'; // Hide the broken image
                            e.target.parentNode.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
                            const placeholder = document.createElement('span');
                            placeholder.className = 'text-gray-500';
                            placeholder.textContent = investment.title;
                            e.target.parentNode.appendChild(placeholder);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">{investment.title}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(investment.status)}`}>
                          {investment.status}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {investment.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{investment.title}</h3>
                      {investment.location && (
                        <p className="text-gray-600 text-sm mb-3">{investment.location}</p>
                      )}
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-medium">
                          {investment.price ? `$${Number(investment.price).toLocaleString()}` : 'Price on Request'}
                        </div>
                        {investment.roi && (
                          <div className="text-sm bg-secondary/20 px-2 py-1 rounded">
                            ROI: {investment.roi}
                          </div>
                        )}
                      </div>
                      
                      <Link 
                        to={`/investments/${investment._id}`} 
                        className="btn btn-primary w-full block text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Filter by category */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === 'All' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {investmentCategories.map(category => (
                <button 
                  key={category} 
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* All investments */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredInvestments.length === 0 ? (
              <div className="col-span-3 text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No investment opportunities found in this category.</p>
              </div>
            ) : (
              filteredInvestments.map(investment => (
                <div key={investment._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {investment.imageUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={investment.imageUrl} 
                        alt={investment.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image: ${investment.imageUrl}`);
                          e.target.onerror = null; // Prevent infinite error loop
                          e.target.style.display = 'none'; // Hide the broken image
                          e.target.parentNode.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
                          const placeholder = document.createElement('span');
                          placeholder.className = 'text-gray-500';
                          placeholder.textContent = investment.title;
                          e.target.parentNode.appendChild(placeholder);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">{investment.title}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(investment.status)}`}>
                        {investment.status}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {investment.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{investment.title}</h3>
                    {investment.location && (
                      <p className="text-gray-600 text-sm mb-3">{investment.location}</p>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium">
                        {investment.price ? `$${Number(investment.price).toLocaleString()}` : 'Price on Request'}
                      </div>
                      {investment.roi && (
                        <div className="text-sm bg-secondary/20 px-2 py-1 rounded">
                          ROI: {investment.roi}
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/investments/${investment._id}`} 
                      className="btn btn-secondary w-full block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className="bg-primary/10 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why Invest in Sri Lanka?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Strategic location in the Indian Ocean</li>
          <li>Growing tourism sector</li>
          <li>Government incentives for foreign investors</li>
          <li>Relatively low cost of property compared to similar tropical destinations</li>
          <li>Rich cultural heritage and natural beauty attracting global visitors</li>
        </ul>
      </div>

      <div className="text-center">
        <button className="btn btn-primary">Contact Our Investment Advisors</button>
      </div>
    </div>
  );
}

export default Investments;