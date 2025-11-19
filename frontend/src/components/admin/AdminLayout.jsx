import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-dark text-white min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Manage your site content</p>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className="block py-2 px-4 rounded hover:bg-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/blogs" className="block py-2 px-4 rounded hover:bg-primary">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/admin/destinations" className="block py-2 px-4 rounded hover:bg-primary">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/admin/accommodations" className="block py-2 px-4 rounded hover:bg-primary">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link to="/admin/vehicles" className="block py-2 px-4 rounded hover:bg-primary">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link to="/admin/itineraries" className="block py-2 px-4 rounded hover:bg-primary">
                  Itineraries
                </Link>
              </li>
              <li>
                <Link to="/admin/investments" className="block py-2 px-4 rounded hover:bg-primary">
                  Investments
                </Link>
              </li>
              <li>
                <Link to="/admin/riders" className="block py-2 px-4 rounded hover:bg-primary">
                  Riders
                </Link>
              </li>
              <li>
                <Link to="/admin/guides" className="block py-2 px-4 rounded hover:bg-primary">
                  Guides
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto pt-8">
            <Link to="/" className="block py-2 px-4 text-sm text-gray-400 hover:text-white">
              ← Back to Website
            </Link>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;