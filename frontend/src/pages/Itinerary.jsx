import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Itinerary() {
  const [guideTypes, setGuideTypes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch guide types
        const guidesRes = await fetch('/api/guides');
        if (!guidesRes.ok) throw new Error(`Guides API error: ${guidesRes.status}`);
        const guidesData = await guidesRes.json();
        
        // Fetch packages
        const packagesRes = await fetch('/api/itineraries');
        if (!packagesRes.ok) throw new Error(`Itineraries API error: ${packagesRes.status}`);
        const packagesData = await packagesRes.json();
        
        setGuideTypes(guidesData);
        setPackages(packagesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // This is for the guide details modal
  const openGuideDetails = (guide) => {
    setSelectedGuide(guide);
  };

  const closeGuideDetails = () => {
    setSelectedGuide(null);
  };

  // Fallback data in case the API isn't available yet
  const fallbackGuideTypes = [
    { _id: 'g1', title: 'Area Guides', description: 'Local experts with deep knowledge of specific regions', details: 'Our area guides are born and raised in the regions they specialize in. They know every hidden spot, local custom, and historical detail that you won\'t find in guidebooks.' },
    { _id: 'g2', title: 'Site Guides', description: 'Specialized guides for historical and cultural sites', details: 'Site guides have academic backgrounds in archaeology, history, or cultural studies with specific expertise in Sri Lanka\'s UNESCO sites and cultural landmarks.' },
    { _id: 'g3', title: 'Chauffeur Guide', description: 'Professional drivers with guiding expertise', details: 'Our chauffeur guides offer the convenience of transport combined with expert guidance. They\'re professionally trained drivers with extensive knowledge of routes, attractions, and local insights.' },
    { _id: 'g4', title: 'National Guide', description: 'Comprehensive knowledge of the entire country', details: 'National guides hold the highest level of certification and can guide you throughout the entire country. They have in-depth knowledge of Sri Lanka\'s history, culture, wildlife, and geography.' }
  ];

  const fallbackPackages = [
    { _id: 'p1', title: 'Package 1: Cultural Triangle Explorer', days: 5, price: 850, highlights: ['Sigiriya Rock Fortress', 'Polonnaruwa Ancient City', 'Dambulla Cave Temples', 'Anuradhapura Sacred City'], description: 'Discover Sri Lanka\'s ancient civilizations and UNESCO World Heritage sites in this cultural journey through the island\'s historic heartland.' },
    { _id: 'p2', title: 'Package 2: Beach Paradise', days: 7, price: 950, highlights: ['Mirissa Beach Relaxation', 'Unawatuna Bay', 'Bentota River Safari', 'Hikkaduwa Marine Sanctuary'], description: 'Experience the best beaches of southern Sri Lanka with plenty of time for relaxation, water sports, and coastal exploration.' },
    { _id: 'p3', title: 'Package 3: Hill Country Adventure', days: 6, price: 900, highlights: ['Ella Rock Hike', 'Nuwara Eliya Tea Plantations', 'Kandy Temple of the Tooth', 'Horton Plains National Park'], description: 'Escape to the cool climate of Sri Lanka\'s central highlands, with misty mountains, tea plantations, waterfalls, and colonial charm.' },
    { _id: 'p4', title: 'Package 4: Wildlife Safari', days: 4, price: 750, highlights: ['Yala National Park', 'Udawalawe Elephant Transit Home', 'Minneriya Elephant Gathering', 'Kaudulla National Park'], description: 'Get up close with Sri Lanka\'s incredible wildlife including elephants, leopards, sloth bears, and hundreds of bird species.' },
    { _id: 'p5', title: 'Package 5: Comprehensive Sri Lanka', days: 14, price: 1800, highlights: ['Colombo City Tour', 'Kandy Cultural Show', 'Nuwara Eliya Train Journey', 'Ella Nine Arch Bridge', 'Yala Safari', 'Mirissa Whale Watching', 'Galle Fort'], description: 'The ultimate Sri Lankan experience combining culture, wildlife, highlands, and beaches in one comprehensive two-week journey.' },
    { _id: 'p6', title: 'Package 6: Northern Explorer', days: 8, price: 1100, highlights: ['Jaffna Peninsula', 'Trincomalee Beaches', 'Anuradhapura Sacred City', 'Wilpattu National Park'], description: 'Venture to Sri Lanka\'s less-visited northern regions to experience unique Tamil culture, untouched beaches, and off-the-beaten-path wildlife.' },
    { _id: 'p7', title: 'Package 7: East Coast Beaches', days: 6, price: 880, highlights: ['Trincomalee Natural Harbor', 'Nilaveli Beach', 'Pasikudah Bay', 'Batticaloa Lagoons'], description: 'Discover the pristine beaches of Sri Lanka\'s east coast, known for powder-soft sand, turquoise waters, and excellent snorkeling and diving.' },
    { _id: 'p8', title: 'Package 8: Ayurvedic Retreat', days: 10, price: 1250, highlights: ['Traditional Wellness Centers', 'Meditation Sessions', 'Yoga Classes', 'Natural Healing Therapies'], description: 'Rejuvenate your body and mind with traditional Ayurvedic treatments, yoga, meditation, and wholesome cuisine in serene settings.' },
    { _id: 'p9', title: 'Package 9: Adventure Sri Lanka', days: 7, price: 920, highlights: ['White Water Rafting in Kitulgala', 'Adam\'s Peak Climb', 'Mountain Biking in Knuckles Range', 'Rock Climbing in Ella'], description: 'For thrill-seekers, this action-packed itinerary offers the best adventure activities across Sri Lanka\'s diverse landscapes.' }
  ];

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      <p>Error loading content: {error}</p>
      <p className="mt-2">Showing demo content instead.</p>
    </div>
  );

  // Use fetched data or fallback if API returns empty arrays
  const displayGuides = guideTypes.length ? guideTypes : fallbackGuideTypes;
  const displayPackages = packages.length ? packages : fallbackPackages;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-6">Guidance & Itinerary</h1>
        <p className="mb-8">
          Our expert guides and carefully crafted itineraries ensure you experience the best of Sri Lanka. 
          Whether you're interested in cultural exploration, wildlife safaris, beach relaxation, 
          or adventure activities, we have the perfect journey for you.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Our Expert Guides</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {displayGuides.map((guide) => (
            <div 
              key={guide._id} 
              className="card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openGuideDetails(guide)}
            >
              <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
              <p>{guide.description}</p>
              <p className="text-primary mt-2 text-sm">Click to view details</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Tour Packages</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {displayPackages.map((pkg) => (
            <div key={pkg._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-primary">{pkg.title}</h3>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-600">{pkg.days} days</p>
                  <span className="bg-secondary/20 px-3 py-1 rounded-full text-sm font-medium">
                    ${pkg.price}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>
                
                <h4 className="font-medium text-sm text-gray-700 mb-2">Highlights:</h4>
                <ul className="mb-4">
                  {pkg.highlights.slice(0, 3).map((highlight, i) => (
                    <li key={i} className="flex items-start mb-1">
                      <svg className="w-4 h-4 text-primary mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </li>
                  ))}
                  {pkg.highlights.length > 3 && (
                    <li className="text-sm text-gray-500 ml-6">+ {pkg.highlights.length - 3} more</li>
                  )}
                </ul>
                
                <Link 
                  to={`/itinerary/${pkg._id}`} 
                  className="btn btn-primary w-full text-center block"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Custom Itineraries</h2>
        <p className="mb-4">
          Want something unique? We can create a customized itinerary based on your interests, 
          timeframe, and budget. Our local experts will work with you to design the perfect 
          Sri Lankan experience.
        </p>
        <button className="btn btn-primary">Request Custom Itinerary</button>
      </section>

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-primary">{selectedGuide.title}</h2>
                <button 
                  onClick={closeGuideDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedGuide.description}</p>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">About our {selectedGuide.title}:</h3>
                <p className="text-gray-600">{selectedGuide.details}</p>
              </div>
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold mb-2">Requirements & Qualifications:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Government licensed and certified</li>
                  <li>Minimum 3 years of experience</li>
                  <li>Fluent in English (additional languages available)</li>
                  <li>First aid trained</li>
                  <li>Extensive knowledge of local culture and history</li>
                </ul>
              </div>
              <div className="mt-6 flex justify-center">
                <button className="btn btn-primary">Request This Guide Type</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Itinerary;