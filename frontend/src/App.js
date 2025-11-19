import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// Auth context provider
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Blogs from './pages/Blogs';
import Vehicles from './pages/Vehicles';
import Accommodations from './pages/Accommodations';
import Map from './pages/Map';
import TermsOfServices from './pages/TermsOfServices';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Investments from './pages/Investments';
import Itinerary from './pages/Itinerary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BlogDetail from './pages/BlogDetail';
import DestinationDetail from './pages/DestinationDetail';
import VehicleDetail from './pages/VehicleDetail';
import ItineraryDetail from './pages/ItineraryDetail';
import InvestmentDetail from './pages/InvestmentDetail';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import BlogsAdmin from './pages/admin/BlogsAdmin';
import BlogForm from './pages/admin/BlogForm';
import DestinationsAdmin from './pages/admin/DestinationsAdmin';
import DestinationForm from './pages/admin/DestinationForm';
import AccommodationsAdmin from './pages/admin/AccommodationsAdmin';
import VehicleForm from './pages/admin/VehicleForm';
import VehiclesAdmin from './pages/admin/VehiclesAdmin';
import AccommodationForm from './pages/admin/AccommodationForm';
import ItinerariesAdmin from './pages/admin/ItinerariesAdmin';
import ItineraryForm from './pages/admin/ItineraryForm';
import InvestmentsAdmin from './pages/admin/InvestmentsAdmin';
import InvestmentForm from './pages/admin/InvestmentForm';
import RidersAdmin from './pages/admin/RidersAdmin';
import RiderForm from './pages/admin/RiderForm';
import GuidesAdmin from './pages/admin/GuidesAdmin';
import GuideForm from './pages/admin/GuideForm';

// Navigation component with conditional rendering based on auth state
function Navigation() {
  const { user, isAdmin, logout } = useContext(AuthContext);
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto py-4 px-6">
        <nav>
          <ul className="flex flex-wrap items-center space-x-6 justify-between">
            <li className="font-bold text-xl"><Link to="/">Sri Lanka Travel</Link></li>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/accommodations">Stay</Link></li>
            <li><Link to="/vehicles">Transport</Link></li>
            <li><Link to="/itinerary">Itinerary</Link></li>
            <li><Link to="/investments">Investments</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/map">Map</Link></li>
            
            {/* Show these links only when user is logged in */}
            {user ? (
              <>
                <li className="ml-auto">
                  {isAdmin && (
                    <Link to="/admin" className="bg-secondary text-dark px-3 py-1 rounded mr-4">
                      Admin Dashboard
                    </Link>
                  )}
                  <span className="mr-4">Welcome, {user.name}</span>
                  <button 
                    onClick={logout}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="ml-auto">
                  <Link to="/login" className="mr-4">Login</Link>
                  <Link to="/signup" className="bg-secondary text-dark px-3 py-1 rounded">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-light">
          <Navigation />

          <main className="flex-grow container mx-auto py-8 px-6">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/accommodations" element={<Accommodations />} />
              <Route path="/map" element={<Map />} />
              <Route path="/terms" element={<TermsOfServices />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/investments/:id" element={<InvestmentDetail />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/itinerary/:id" element={<ItineraryDetail />} />
              <Route path="/investments/:id" element={<InvestmentDetail />} />

              {/* Admin routes - protected by AdminRoute */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  
                  {/* Blog routes */}
                  <Route path="blogs" element={<BlogsAdmin />} />
                  <Route path="blogs/new" element={<BlogForm />} />
                  <Route path="blogs/edit/:id" element={<BlogForm />} />
                  
                  {/* Destination routes */}
                  <Route path="destinations" element={<DestinationsAdmin />} />
                  <Route path="destinations/new" element={<DestinationForm />} />
                  <Route path="destinations/edit/:id" element={<DestinationForm />} />
                  
                  {/* Accommodation routes */}
                  <Route path="accommodations" element={<AccommodationsAdmin />} />
                  <Route path="accommodations/new" element={<AccommodationForm />} />
                  <Route path="accommodations/edit/:id" element={<AccommodationForm />} />
                  
                  {/* Vehicle routes */}
                  <Route path="vehicles" element={<VehiclesAdmin />} />
                  <Route path="vehicles/new" element={<VehicleForm />} />
                  <Route path="vehicles/edit/:id" element={<VehicleForm />} />
                  
                  {/* Itinerary routes */}
                  <Route path="itineraries" element={<ItinerariesAdmin />} />
                  <Route path="itineraries/new" element={<ItineraryForm />} />
                  <Route path="itineraries/edit/:id" element={<ItineraryForm />} />
                  
                  {/* Rider routes */}
                  <Route path="riders" element={<RidersAdmin />} />
                  <Route path="riders/new" element={<RiderForm />} />
                  <Route path="riders/edit/:id" element={<RiderForm />} />
                  
                  {/* Investment routes */}
                  <Route path="investments" element={<InvestmentsAdmin />} />
                  <Route path="investments/new" element={<InvestmentForm />} />
                  <Route path="investments/edit/:id" element={<InvestmentForm />} />
                  
                  {/* Guide routes */}
                  <Route path="guides" element={<GuidesAdmin />} />
                  <Route path="guides/new" element={<GuideForm />} />
                  <Route path="guides/edit/:id" element={<GuideForm />} />
                </Route>
              </Route>
            </Routes>
          </main>

          <footer className="bg-dark text-white py-8">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-lg font-semibold mb-4">Sri Lanka Travel</h3>
                  <p>Your gateway to authentic Sri Lankan experiences</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Legal</h4>
                  <ul>
                    <li><Link to="/terms">Terms of Service</Link></li>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                <p>© 2023 Sri Lanka Travel Platform. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
