import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaArrowLeft, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

function InvestmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useContext(AuthContext);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/investments/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setInvestment(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching investment:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    // Here you would normally send the form data to your API
    // For now, we'll just simulate a submission
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
        setShowContactForm(false);
      }, 5000);
    }, 1500);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-6">
      Error loading investment: {error}
    </div>
  );

  if (!investment) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-700">Investment not found</h2>
      <p className="mt-4 text-gray-500">The investment opportunity you're looking for might have been removed or doesn't exist.</p>
      <Link to="/investments" className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-teal-700">
        Back to Investments
      </Link>
    </div>
  );

  // Function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Price on request';
    return `$${Number(amount).toLocaleString()}`;
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Under Offer':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Admin edit button */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link 
            to={`/admin/investments/edit/${investment._id}`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Edit Investment
          </Link>
        </div>
      )}

      {/* Back to investments */}
      <div className="mb-6">
        <Link to="/investments" className="text-primary hover:underline flex items-center">
          <FaArrowLeft className="mr-1" />
          Back to Investment Opportunities
        </Link>
      </div>

      <motion.article 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-6">
          {/* Status and category */}
          <div className="flex flex-wrap justify-between items-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(investment.status)}`}>
              {investment.status}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
              {investment.category}
            </span>
          </div>

          {/* Title and location */}
          <h1 className="text-3xl font-bold mb-2 text-primary">{investment.title}</h1>
          {investment.location && (
            <div className="text-gray-600 mb-4">
              <span className="flex items-center">
                <FaMapMarkerAlt className="w-5 h-5 mr-1 text-gray-500" />
                {investment.location}
              </span>
            </div>
          )}

          {/* Price and ROI */}
          <div className="flex flex-wrap gap-4 mb-6">
            {investment.price && (
              <div className="bg-secondary/20 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">Price</div>
                <div className="font-bold text-xl">{formatCurrency(investment.price)}</div>
              </div>
            )}
            {investment.roi && (
              <div className="bg-secondary/20 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">Return on Investment</div>
                <div className="font-bold text-xl">{investment.roi}</div>
              </div>
            )}
          </div>

          {/* Image */}
          {investment.imageUrl ? (
            <div className="mb-6 max-h-96 overflow-hidden rounded-lg shadow-md">
              <img 
                src={investment.imageUrl} 
                alt={investment.title} 
                className="w-full object-contain mx-auto max-h-96"
                onError={(e) => {
                  console.error(`Failed to load image: ${investment.imageUrl}`);
                  e.target.onerror = null; // Prevent infinite error loop
                  e.target.style.display = 'none'; // Hide the broken image
                  e.target.parentNode.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
                  const placeholder = document.createElement('span');
                  placeholder.className = 'text-gray-500 text-lg';
                  placeholder.textContent = 'No image available';
                  e.target.parentNode.appendChild(placeholder);
                }}
              />
            </div>
          ) : (
            <div className="mb-6 h-64 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          )}

          {/* Description */}
          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-3">About This Investment</h2>
            <p>{investment.description || "No detailed description available."}</p>
          </div>
          
          {/* Key benefits */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Key Benefits</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-start">
                  <FaCheck className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Strategic location with growth potential</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Strong tourism sector performance</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Government incentives for investors</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span>Full ownership rights for foreign investors</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-8">
            {investment.status === 'Sold' ? (
              <div className="text-red-600 font-medium text-center p-4 bg-red-50 rounded-lg w-full">
                This investment opportunity has been sold. Please browse our other available options.
              </div>
            ) : (
              <button 
                onClick={() => setShowContactForm(true)} 
                className="btn btn-primary"
                disabled={investment.status === 'Sold'}
              >
                Request More Information
              </button>
            )}
          </div>
        </div>
      </motion.article>

      {/* Contact form modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Request Investment Information</h2>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {formSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  Thank you for your interest! Our investment team will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      rows="4"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please tell us what you're looking for and any specific questions about this investment opportunity."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Similar investments section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Investment Opportunities</h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/investments">Beachfront Land in Weligama</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Prime development land with direct beach access</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/investments">Boutique Hotel in Galle</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Established hotel with excellent review ratings</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold hover:text-primary">
                <Link to="/investments">Tea Plantation in Nuwara Eliya</Link>
              </h3>
              <p className="text-sm text-gray-500 mt-2">Productive plantation with tourism potential</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InvestmentDetail;