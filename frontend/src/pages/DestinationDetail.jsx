import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaArrowLeft, FaStar, FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/destinations/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setDestination(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching destination:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Generate stars for popularity rating
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="w-5 h-5 text-yellow-400 inline-block" />);
      } else {
        stars.push(<FaRegStar key={i} className="w-5 h-5 text-gray-300 inline-block" />);
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
      Error loading destination: {error}
    </div>
  );

  if (!destination) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-700">Destination not found</h2>
      <p className="mt-4 text-gray-500">The destination you're looking for might have been removed or doesn't exist.</p>
      <Link to="/destinations" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-teal-700">
        Back to Destinations
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Admin edit button */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link 
            to={`/admin/destinations/edit/${destination._id}`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Edit Destination
          </Link>
        </div>
      )}

      {/* Back to destinations */}
      <div className="mb-6">
        <Link to="/destinations" className="text-primary hover:underline flex items-center">
          <FaArrowLeft className="mr-1" />
          Back to Destinations
        </Link>
      </div>

      <motion.article 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header with image */}
        {destination.imageUrl ? (
          <div className="relative max-h-96 overflow-hidden">
            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="w-full object-contain mx-auto max-h-96"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-destination.jpg';
              }}
            />
          </div>
        ) : null}

        <div className="p-6">
          {/* Rating and region */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="mr-2">
                {renderRatingStars(destination.popularityRating || 3)}
              </div>
              <span className="text-gray-600">
                {destination.popularityRating}/5 popularity
              </span>
            </div>
            <span className="bg-secondary/20 px-3 py-1 rounded-full text-sm font-medium">
              {destination.region}
            </span>
          </div>

          {/* Title and location */}
          <h1 className="text-3xl font-bold mb-2 text-primary">{destination.name}</h1>
          <p className="text-gray-600 mb-6">{destination.location}</p>

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <p>{destination.description || "No description available."}</p>
          </div>

          {/* Activities */}
          {destination.activities && destination.activities.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Things to Do</h2>
              <div className="flex flex-wrap gap-2">
                {destination.activities.map((activity, idx) => (
                  <span key={idx} className="bg-secondary/20 px-3 py-1 rounded-full">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Call to action */}
          <div className="flex justify-center mt-8">
            <button className="btn btn-primary">Plan Your Visit</button>
          </div>
        </div>
      </motion.article>

      {/* Related destinations section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Nearby Destinations</h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/destinations">Sigiriya Rock Fortress</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Ancient rock fortress with stunning views...</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/destinations">Kandy Temple of the Tooth</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Sacred Buddhist temple in the cultural capital...</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/destinations">Dambulla Cave Temple</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Ancient rock temple with Buddhist statues and paintings...</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DestinationDetail;