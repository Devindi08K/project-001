import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const [riders, setRiders] = useState([]);
  const [ridersLoading, setRidersLoading] = useState(true);
  const [ridersError, setRidersError] = useState(null);

  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching vehicles:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setRidersLoading(true);
    fetch('/api/riders')
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setRiders(data);
        setRidersLoading(false);
      })
      .catch(err => {
        console.error('Error fetching riders:', err);
        setRidersError(err.message);
        setRidersLoading(false);
      });
  }, []);

  // Get unique vehicle types for filtering
  const vehicleTypes = ['All', ...new Set(vehicles.map(vehicle => vehicle.type))];

  // Group vehicles by type for display
  const groupedVehicles = vehicles.reduce((groups, vehicle) => {
    if (!groups[vehicle.type]) {
      groups[vehicle.type] = [];
    }
    groups[vehicle.type].push(vehicle);
    return groups;
  }, {});

  // Filter vehicles by selected type
  const filteredVehicles = selectedType === 'All' 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.type === selectedType);

  // Group riders by type
  const riderGroups = riders.reduce((groups, rider) => {
    const { type } = rider;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(rider);
    return groups;
  }, {});

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading vehicles: {error}
    </div>
  );

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-6">Vehicles & Transport</h1>
        <p className="mb-8">
          Choose from our wide range of transportation options to explore the beautiful island of Sri Lanka.
          Whether you're looking for adventure on a motorbike, the authentic experience of a tuk-tuk,
          or the comfort of a luxury vehicle, we have options to suit every preference.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Filter By Type</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {vehicleTypes.map((type, index) => (
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
        <h2 className="text-2xl font-bold mb-6">Our Vehicle Fleet</h2>
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No vehicles found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.filter(vehicle => vehicle.available).map((vehicle) => (
              <div key={vehicle._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {vehicle.imageUrl ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Vehicle';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">{vehicle.name}</span>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                    {vehicle.pricePerDay && (
                      <span className="bg-secondary/20 px-2 py-1 rounded text-sm font-medium">
                        ${vehicle.pricePerDay}/day
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                    <span>{vehicle.type}</span>
                    {vehicle.capacity && (
                      <>
                        <span>•</span>
                        <span>{vehicle.capacity} {vehicle.capacity === 1 ? 'person' : 'people'}</span>
                      </>
                    )}
                  </div>
                  
                  {vehicle.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{vehicle.description}</p>
                  )}
                  
                  <button className="btn btn-secondary mt-2 w-full">Check Availability</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Our Riders</h2>
        
        {ridersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading riders...</p>
          </div>
        ) : ridersError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading riders: {ridersError}
          </div>
        ) : riders.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No riders available at the moment.</p>
        ) : (
          <div>
            <p className="mb-6">
              All our riders are professionally trained, speak English, and have extensive local knowledge
              to enhance your travel experience.
            </p>
            
            {Object.entries(riderGroups).map(([type, groupRiders]) => (
              <div key={type} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{type}s</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupRiders.filter(rider => rider.available).map((rider) => (
                    <div key={rider._id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
                      <h4 className="font-semibold text-lg mb-2">{rider.name}</h4>
                      <div className="text-sm text-gray-600 mb-3">
                        <p><span className="font-medium">Experience:</span> {rider.experience} {rider.experience === 1 ? 'year' : 'years'}</p>
                        <p><span className="font-medium">Languages:</span> {rider.languages.join(', ')}</p>
                        
                        {rider.specialties && rider.specialties.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Specialties:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rider.specialties.map((specialty, idx) => (
                                <span key={idx} className="bg-secondary/20 text-xs px-2 py-1 rounded">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {rider.description && (
                        <p className="text-gray-600 text-sm mb-4">{rider.description}</p>
                      )}
                      
                      <button className="btn btn-secondary w-full text-sm">Book with {rider.name.split(' ')[0]}</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Vehicle Facilities</h2>
        <p className="mb-4">
          Our vehicles come with various amenities to ensure your comfort during your journey:
        </p>
        <ul className="grid md:grid-cols-2 gap-2 list-disc pl-5">
          <li>Air conditioning</li>
          <li>Comfortable seating</li>
          <li>Mineral water</li>
          <li>Wi-Fi (in select vehicles)</li>
          <li>First aid kit</li>
          <li>Mobile phone charging</li>
          <li>Luggage space</li>
          <li>Child seats (upon request)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Book Your Transportation</h2>
        <button className="btn btn-primary">Check Availability & Prices</button>
      </section>
    </div>
  );
}

export default Vehicles;