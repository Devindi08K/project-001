import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  
  // These are just fallbacks in case there's no data from the API yet
  const accommodationTypes = [
    'All',
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

  // Filter accommodations by type
  const filteredAccommodations = selectedType === 'All' 
    ? accommodations 
    : accommodations.filter(acc => acc.type === selectedType);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading accommodations: {error}
    </div>
  );

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-6">Accommodations</h1>
        <p className="mb-8">
          Find your perfect stay in Sri Lanka with our diverse range of accommodation options.
          From luxury beachfront villas to authentic homestays with local families, we offer
          accommodations to suit every preference, group size, and budget.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Filter By Type</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {accommodationTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full ${
                selectedType === type
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Available Accommodations</h2>
        {filteredAccommodations.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No accommodations found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccommodations.filter(acc => acc.available).map((accommodation, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {accommodation.imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={accommodation.imageUrl}
                      alt={accommodation.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Sri+Lanka+Accommodation';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">{accommodation.name}</span>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{accommodation.name}</h3>
                    {accommodation.pricePerNight && (
                      <span className="bg-secondary/20 px-2 py-1 rounded text-sm font-medium">
                        ${accommodation.pricePerNight}/night
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3 text-sm">
                    <span className="font-medium">Location:</span> {accommodation.location}
                  </p>
                  
                  {accommodation.type && (
                    <p className="text-gray-600 mb-3 text-sm">
                      <span className="font-medium">Type:</span> {accommodation.type}
                    </p>
                  )}
                  
                  {accommodation.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{accommodation.description}</p>
                  )}
                  
                  {accommodation.amenities && accommodation.amenities.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Amenities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {accommodation.amenities.slice(0, 4).map((amenity, idx) => (
                          <span key={idx} className="bg-secondary/20 text-xs px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                        {accommodation.amenities.length > 4 && (
                          <span className="bg-secondary/20 text-xs px-2 py-1 rounded">
                            +{accommodation.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button className="btn btn-secondary mt-2 w-full">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary/10 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Why Book With Us?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <h3 className="font-semibold mb-2">Verified Properties</h3>
            <p>All accommodations are personally vetted for quality and safety</p>
          </div>
          <div className="text-center p-4">
            <h3 className="font-semibold mb-2">Best Rates</h3>
            <p>We negotiate the best prices for our customers</p>
          </div>
          <div className="text-center p-4">
            <h3 className="font-semibold mb-2">Local Support</h3>
            <p>24/7 assistance available during your stay</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Find Your Perfect Stay</h2>
        <p className="mb-4">
          Can't find what you're looking for? Contact us and we'll help you find the perfect accommodation.
        </p>
        <button className="btn btn-primary">Contact Us</button>
      </section>
    </div>
  );
}

export default Accommodations;