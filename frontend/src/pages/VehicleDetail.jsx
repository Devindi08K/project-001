import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/vehicles/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setVehicle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vehicle:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading vehicle: {error}
    </div>
  );

  if (!vehicle) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-700">Vehicle not found</h2>
      <p className="mt-4 text-gray-500">The vehicle you're looking for might have been removed or doesn't exist.</p>
      <Link to="/vehicles" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-teal-700">
        Back to Vehicles
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Admin edit button */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link 
            to={`/admin/vehicles/edit/${vehicle._id}`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Edit Vehicle
          </Link>
        </div>
      )}

      {/* Back to vehicles */}
      <div className="mb-6">
        <Link to="/vehicles" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Vehicles
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with image */}
        {vehicle.imageUrl ? (
          <div className="h-72 overflow-hidden">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x400?text=Vehicle';
              }}
            />
          </div>
        ) : null}

        <div className="p-6">
          {/* Price and availability */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            {vehicle.pricePerDay && (
              <span className="bg-secondary/20 px-4 py-2 rounded-full text-lg font-medium">
                ${vehicle.pricePerDay}/day
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {vehicle.available ? 'Available for Booking' : 'Currently Unavailable'}
            </span>
          </div>

          {/* Title and type */}
          <h1 className="text-3xl font-bold mb-2 text-primary">{vehicle.name}</h1>
          <div className="flex items-center mb-6">
            <span className="text-gray-600 mr-4">{vehicle.type}</span>
            {vehicle.capacity && (
              <span className="text-gray-600">
                Capacity: {vehicle.capacity} {vehicle.capacity === 1 ? 'person' : 'people'}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <p>{vehicle.description || "No description available."}</p>
          </div>
          
          {/* Features */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Vehicle Features</h2>
            <ul className="grid grid-cols-2 gap-2">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Air conditioning
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Mineral water
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                First aid kit
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Charging ports
              </li>
            </ul>
          </div>
          
          {/* Call to action */}
          <div className="flex justify-center mt-8">
            <button className="btn btn-primary">Book This Vehicle</button>
          </div>
        </div>
      </article>

      {/* Similar vehicles section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/vehicles">Toyota Corolla</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Comfortable sedan for up to 4 people</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/vehicles">Honda Civic</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Reliable and fuel-efficient sedan</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/vehicles">Nissan X-Trail</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">SUV with space for luggage and comfort</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetail;