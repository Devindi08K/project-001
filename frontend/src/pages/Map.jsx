import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different types of locations
const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const accommodationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function Map() {
  const [destinations, setDestinations] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [showDestinations, setShowDestinations] = useState(true);
  const [showAccommodations, setShowAccommodations] = useState(true);
  const [loading, setLoading] = useState(true);

  // Sample destinations with coordinates - replace with your API data
  const sampleDestinations = [
    { id: 1, name: 'Sigiriya Rock Fortress', lat: 7.9571, lng: 80.7603, description: 'Ancient rock fortress and palace ruins' },
    { id: 2, name: 'Kandy', lat: 7.2906, lng: 80.6337, description: 'Cultural capital and Temple of the Tooth' },
    { id: 3, name: 'Galle Fort', lat: 6.0329, lng: 80.2168, description: 'Historic Dutch colonial fort' },
    { id: 4, name: 'Ella', lat: 6.8667, lng: 81.0500, description: 'Scenic hill country town' },
    { id: 5, name: 'Mirissa', lat: 5.9487, lng: 80.4583, description: 'Beautiful beach and whale watching' },
    { id: 6, name: 'Polonnaruwa', lat: 7.9403, lng: 81.0188, description: 'Ancient city ruins' },
    { id: 7, name: 'Dambulla', lat: 7.8731, lng: 80.6511, description: 'Cave temple complex' },
    { id: 8, name: 'Anuradhapura', lat: 8.3114, lng: 80.4037, description: 'Ancient capital city' }
  ];

  const sampleAccommodations = [
    { id: 1, name: 'Heritance Kandalama', lat: 7.8500, lng: 80.6500, description: 'Luxury eco hotel near Dambulla' },
    { id: 2, name: 'Amangalla Galle', lat: 6.0329, lng: 80.2168, description: 'Historic luxury hotel in Galle Fort' },
    { id: 3, name: 'Ella Jungle Resort', lat: 6.8667, lng: 81.0500, description: 'Eco-friendly resort in Ella' },
    { id: 4, name: 'Mirissa Hills', lat: 5.9487, lng: 80.4583, description: 'Boutique hotel overlooking the ocean' },
    { id: 5, name: 'Cinnamon Lodge Habarana', lat: 8.0367, lng: 80.7514, description: 'Wildlife lodge near national parks' }
  ];

  useEffect(() => {
    // In a real app, fetch from your API
    const fetchData = async () => {
      try {
        // Replace with actual API calls
        // const destResponse = await fetch('/api/destinations');
        // const accomResponse = await fetch('/api/accommodations');
        // const destData = await destResponse.json();
        // const accomData = await accomResponse.json();
        
        setDestinations(sampleDestinations);
        setAccommodations(sampleAccommodations);
      } catch (error) {
        console.error('Error fetching map data:', error);
        setDestinations(sampleDestinations);
        setAccommodations(sampleAccommodations);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Interactive Map of Sri Lanka</h1>
          <p className="text-gray-600">
            Explore destinations, accommodations, and plan your perfect Sri Lankan adventure
          </p>
        </div>
        
        {/* Map Controls */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDestinations}
              onChange={(e) => setShowDestinations(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Destinations
            </span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showAccommodations}
              onChange={(e) => setShowAccommodations(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Accommodations
            </span>
          </label>
        </div>
      </div>

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <MapContainer
          center={[7.8731, 80.7718]} // Center of Sri Lanka
          zoom={8}
          style={{ height: '600px', width: '100%' }}
          scrollWheelZoom={false}
          touchZoom={true}
          doubleClickZoom={true}
          dragging={true}
          className="rounded-lg"
          whenCreated={(mapInstance) => {
            // Enable scroll wheel zoom only when map is focused/clicked
            mapInstance.on('focus', () => {
              mapInstance.scrollWheelZoom.enable();
            });
            mapInstance.on('blur', () => {
              mapInstance.scrollWheelZoom.disable();
            });
            mapInstance.on('mousedown', () => {
              mapInstance.scrollWheelZoom.enable();
            });
            mapInstance.on('mouseout', () => {
              mapInstance.scrollWheelZoom.disable();
            });
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Destination Markers */}
          {showDestinations && destinations.map((destination) => (
            <Marker
              key={`dest-${destination.id}`}
              position={[destination.lat, destination.lng]}
              icon={destinationIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg text-primary">{destination.name}</h3>
                  <p className="text-gray-600 mt-1">{destination.description}</p>
                  <div className="mt-2">
                    <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-teal-700">
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Accommodation Markers */}
          {showAccommodations && accommodations.map((accommodation) => (
            <Marker
              key={`accom-${accommodation.id}`}
              position={[accommodation.lat, accommodation.lng]}
              icon={accommodationIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-lg text-blue-600">{accommodation.name}</h3>
                  <p className="text-gray-600 mt-1">{accommodation.description}</p>
                  <div className="mt-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      View Hotel
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Overlay message for mobile users */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-sm md:hidden pointer-events-none">
          Tap map to interact
        </div>
      </div>
      
      {/* Map Legend and Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Map Features
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              Tourist destinations and attractions
            </li>
            <li className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              Hotels and accommodations
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Click markers for more information
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Use checkboxes to filter locations
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Planning Tips
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Cultural Triangle: Sigiriya, Dambulla, Polonnaruwa, Anuradhapura</li>
            <li>• Hill Country: Kandy, Ella, Nuwara Eliya</li>
            <li>• Southern Coast: Galle, Mirissa, Unawatuna</li>
            <li>• Consider travel times between distant locations</li>
            <li>• Plan 2-3 days minimum per region</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary/10 to-emerald-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-primary">Need Help Planning Your Route?</h2>
        <p className="mb-4 text-gray-700">
          Our travel experts can help you create the perfect itinerary based on your interests,
          timeframe, and preferred pace of travel. We'll optimize your route to minimize travel time
          and maximize your experience.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Contact Travel Planner</button>
          <button className="btn btn-secondary">View Sample Itineraries</button>
        </div>
      </div>
    </div>
  );
}

export default Map;