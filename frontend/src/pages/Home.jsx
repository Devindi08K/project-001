import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-teal-500 text-white rounded-lg p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Discover Sri Lanka</h1>
        <p className="text-xl mb-8">Experience the beauty, culture and adventure of the pearl of the Indian Ocean</p>
        <Link to="/destinations" className="btn btn-secondary">Explore Destinations</Link>
      </div>

      {/* Vision & Mission */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Vision & Mission</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-2xl font-semibold mb-4">Vision</h3>
            <p>To become the premier platform connecting travelers with authentic Sri Lankan experiences, while promoting sustainable tourism that benefits local communities.</p>
          </div>
          <div className="card">
            <h3 className="text-2xl font-semibold mb-4">Mission</h3>
            <p>We strive to showcase the best of Sri Lanka through carefully curated experiences, providing exceptional service and supporting local economies while preserving the natural and cultural heritage.</p>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Destinations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Sigiriya</h3>
            <p>Ancient rock fortress with stunning views</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Ella</h3>
            <p>Picturesque hill country with tea plantations</p>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Mirissa</h3>
            <p>Beautiful beaches and whale watching</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/destinations" className="btn btn-primary">View All Destinations</Link>
        </div>
      </section>

      {/* About Us */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
        <div className="card">
          <p className="mb-4">
            Sri Lanka Travel is your comprehensive platform for exploring the wonders of Sri Lanka. 
            We connect travelers with authentic experiences, from stunning beaches to ancient cities, 
            lush tea plantations to wildlife safaris.
          </p>
          <p>
            Our team of local experts ensures that you receive the most accurate information, 
            personalized itineraries, and access to quality accommodations and transportation 
            throughout your journey.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;