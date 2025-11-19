import React from 'react';

function Map() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Interactive Map of Sri Lanka</h1>
      
      <p className="mb-6">
        Explore Sri Lanka's destinations, attractions, accommodations, and more with our interactive map.
        Plan your journey visually and discover the proximity between different locations.
      </p>
      
      <div className="bg-gray-200 rounded-lg p-4 h-[500px] flex items-center justify-center">
        <p className="text-lg">Interactive map will be loaded here</p>
        {/* In a real implementation, you would integrate Google Maps or Leaflet here */}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Map Features</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>View all major destinations</li>
            <li>Filter by categories (beaches, heritage sites, wildlife, etc.)</li>
            <li>See accommodations and their proximity to attractions</li>
            <li>Calculate distances and travel times</li>
            <li>Plan routes between multiple destinations</li>
          </ul>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Planning Your Route</h2>
          <p className="mb-3">
            Use our map to plan the most efficient route for your Sri Lankan adventure.
            Consider these factors when planning:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Seasonal weather patterns in different regions</li>
            <li>Travel time between destinations</li>
            <li>Special events and festivals</li>
            <li>Accommodation availability</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-secondary/20 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Need Help Planning?</h2>
        <p className="mb-4">
          Our travel experts can help you create the perfect itinerary based on your interests,
          timeframe, and preferred pace of travel.
        </p>
        <button className="btn btn-primary">Contact a Travel Planner</button>
      </div>
    </div>
  );
}

export default Map;