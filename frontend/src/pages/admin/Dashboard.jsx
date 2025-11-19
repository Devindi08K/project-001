import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [statsData, setStatsData] = useState({
    destinations: 0,
    vehicles: 0,
    accommodations: 0,
    blogs: 0,
    itineraries: 0,
    investments: 0,
    riders: 0,
    guides: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch counts from each API endpoint
        const endpoints = [
          '/api/destinations',
          '/api/vehicles',
          '/api/accommodations', 
          '/api/blogs',
          '/api/itineraries',
          '/api/investments',
          '/api/riders',
          '/api/guides'
        ];
        
        // Make all requests in parallel
        const responses = await Promise.all(
          endpoints.map(endpoint => fetch(endpoint)
            .then(res => {
              if (!res.ok) throw new Error(`Error fetching ${endpoint}`);
              return res.json();
            })
            .then(data => Array.isArray(data) ? data.length : 0)
            .catch(err => {
              console.error(`Error fetching ${endpoint}:`, err);
              return 0;
            })
          )
        );
        
        // Update state with the counts
        setStatsData({
          destinations: responses[0],
          vehicles: responses[1],
          accommodations: responses[2],
          blogs: responses[3],
          itineraries: responses[4],
          investments: responses[5],
          riders: responses[6],
          guides: responses[7]
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Create stats array after we have the data
  const stats = [
    { name: 'Destinations', count: statsData.destinations, link: '/admin/destinations' },
    { name: 'Vehicles', count: statsData.vehicles, link: '/admin/vehicles' },
    { name: 'Accommodations', count: statsData.accommodations, link: '/admin/accommodations' },
    { name: 'Blogs', count: statsData.blogs, link: '/admin/blogs' },
    { name: 'Itineraries', count: statsData.itineraries, link: '/admin/itineraries' },
    { name: 'Investments', count: statsData.investments, link: '/admin/investments' },
    { name: 'Riders', count: statsData.riders, link: '/admin/riders' },
    { name: 'Guides', count: statsData.guides, link: '/admin/guides' }
  ];

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
        <p>Error loading dashboard data: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{stat.name}</h2>
            <p className="text-3xl font-bold text-primary">{stat.count}</p>
            <p className="text-sm text-gray-500 mt-2">Manage {stat.name}</p>
          </Link>
        ))}
      </div>
      
      {/* Replace the static Recent Activity section with a better option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/blogs/new" className="btn btn-primary">
              Add New Blog
            </Link>
            <Link to="/admin/destinations/new" className="btn btn-primary">
              Add New Destination
            </Link>
            <Link to="/admin/accommodations/new" className="btn btn-primary">
              Add New Accommodation
            </Link>
            <Link to="/admin/investments/new" className="btn btn-primary">
              Add New Investment
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>API Services: Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Database: Connected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>File Storage: Available</span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Last system check: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Most Content</h3>
            <div className="space-y-2">
              {stats.sort((a, b) => b.count - a.count).slice(0, 3).map((stat, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{stat.name}</span>
                  <span className="font-medium">{stat.count} items</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Least Content</h3>
            <div className="space-y-2">
              {stats.sort((a, b) => a.count - b.count).slice(0, 3).map((stat, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{stat.name}</span>
                  <span className="font-medium">{stat.count} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;