import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Destinations() {
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

  // Group destinations by region
  const regionGroups = destinations.reduce((groups, destination) => {
    const { region } = destination;
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(destination);
    return groups;
  }, {});

  // Generate stars for popularity rating
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300 inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading destinations: {error}
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Explore Sri Lanka's Destinations</h1>
      
      <p className="mb-6">
        Sri Lanka offers a diverse range of destinations, from ancient cities and misty mountains
        to pristine beaches and wildlife reserves. Discover the perfect places for your journey.
      </p>
      
      {Object.entries(regionGroups).map(([region, places]) => (
        <section key={region} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-primary">{region}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {places.map((destination, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {destination.imageUrl ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-destination.jpg';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">{destination.name}</span>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="mb-2">
                    {renderRatingStars(destination.popularityRating || 3)}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-1 text-primary">{destination.name}</h3>
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">{destination.description}</p>
                  
                  {destination.activities && destination.activities.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-xs text-gray-700 mb-1">Activities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {destination.activities.slice(0, 3).map((activity, idx) => (
                          <span key={idx} className="bg-secondary/20 text-xs px-2 py-0.5 rounded">
                            {activity}
                          </span>
                        ))}
                        {destination.activities.length > 3 && (
                          <span className="text-xs text-gray-500">+{destination.activities.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{destination.location}</span>
                    <Link 
                      to={`/destinations/${destination._id}`} 
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* If there are no destinations yet */}
      {Object.keys(regionGroups).length === 0 && !loading && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No destinations have been added yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

export default Destinations;