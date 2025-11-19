import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function ItineraryDetail() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/itineraries/${id}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        
        const data = await res.json();
        setItinerary(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError(err.message);
        setLoading(false);
        
        // Set fallback data if fetch fails
        if (id === 'p1') {
          setItinerary({
            _id: 'p1',
            title: 'Package 1: Cultural Triangle Explorer',
            days: 5,
            price: 850,
            highlights: ['Sigiriya Rock Fortress', 'Polonnaruwa Ancient City', 'Dambulla Cave Temples', 'Anuradhapura Sacred City'],
            description: 'Discover Sri Lanka\'s ancient civilizations and UNESCO World Heritage sites in this cultural journey through the island\'s historic heartland.',
            dayByDay: [
              { day: 1, title: 'Arrival & Colombo', description: 'Airport pickup and transfer to your hotel in Colombo. Rest and recover from jet lag with an optional evening city tour if time permits.' },
              { day: 2, title: 'Colombo to Sigiriya', description: 'Drive to Sigiriya with a stop at the Dambulla Cave Temples, a UNESCO World Heritage site with ancient Buddha statues and paintings.' },
              { day: 3, title: 'Sigiriya & Polonnaruwa', description: 'Morning climb to the spectacular Sigiriya Rock Fortress. Afternoon exploration of the ancient city of Polonnaruwa by bicycle or vehicle.' },
              { day: 4, title: 'Anuradhapura', description: 'Full day tour of Anuradhapura, Sri Lanka\'s first ancient capital with stupas, palaces, and the sacred Sri Maha Bodhi tree.' },
              { day: 5, title: 'Return to Colombo', description: 'Return to Colombo with stops at spice gardens and handicraft centers. Evening at leisure in Colombo before departure.' }
            ],
            inclusions: ['4 nights accommodation', 'Daily breakfast', 'Air-conditioned private vehicle', 'English-speaking guide', 'Entrance fees to all sites', 'Water bottles during tours'],
            exclusions: ['International flights', 'Visa fees', 'Travel insurance', 'Meals not mentioned', 'Personal expenses', 'Tips and gratuities']
          });
        }
      }
    };
    
    fetchItinerary();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error && !itinerary) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading itinerary: {error}
    </div>
  );

  if (!itinerary) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-700">Itinerary not found</h2>
      <p className="mt-4 text-gray-500">The itinerary you're looking for might have been removed or doesn't exist.</p>
      <Link to="/itinerary" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-teal-700">
        Back to Itineraries
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back to itineraries */}
      <div className="mb-6">
        <Link to="/itinerary" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Packages
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-primary">{itinerary.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-secondary/20 px-4 py-1 rounded-full font-medium">
              {itinerary.days} days
            </span>
            <span className="bg-secondary/20 px-4 py-1 rounded-full font-medium">
              ${itinerary.price} per person
            </span>
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">{itinerary.description}</p>

          {/* Highlights */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Trip Highlights</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="grid md:grid-cols-2 gap-3">
                {itinerary.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Day by day itinerary */}
          {itinerary.dayByDay && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Day by Day Itinerary</h2>
              <div className="space-y-4">
                {itinerary.dayByDay.map((day, idx) => (
                  <div key={idx} className="border-l-4 border-primary pl-4 pb-4">
                    <h3 className="font-bold text-lg">Day {day.day}: {day.title}</h3>
                    <p className="text-gray-600">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions and exclusions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">What's Included</h2>
              <ul className="space-y-2">
                {itinerary.inclusions?.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">What's Not Included</h2>
              <ul className="space-y-2">
                {itinerary.exclusions?.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary">Book This Package</button>
            <button className="btn btn-secondary">Customize This Package</button>
          </div>
        </div>
      </article>

      {/* Contact section */}
      <div className="mt-10 bg-secondary/20 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Need More Information?</h2>
        <p className="mb-4">Our travel experts are ready to answer any questions you may have about this itinerary.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="tel:+94123456789" className="btn btn-white">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call Us
          </a>
          <a href="mailto:info@srilankatravel.com" className="btn btn-white">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default ItineraryDetail;