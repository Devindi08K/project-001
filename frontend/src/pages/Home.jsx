import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaHotel, FaCar, FaMountain, FaUmbrellaBeach, FaLandmark, FaLeaf, FaUsers, FaAward, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section with Animated Gradient */}
      <motion.div 
        className="relative bg-gradient-to-br from-primary via-teal-600 to-emerald-700 text-white rounded-2xl p-12 text-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 right-8 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-8 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover Sri Lanka
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-emerald-50"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the beauty, culture and adventure of the pearl of the Indian Ocean
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link 
              to="/destinations" 
              className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              <FaMapMarkedAlt className="mr-2" />
              Explore Destinations
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.section 
        className="py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Plan Your Journey
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: FaMapMarkedAlt, title: 'Destinations', desc: 'Explore amazing places', link: '/destinations', gradient: 'from-emerald-500 to-teal-600' },
            { icon: FaHotel, title: 'Accommodations', desc: 'Find perfect stays', link: '/accommodations', gradient: 'from-blue-500 to-cyan-600' },
            { icon: FaCar, title: 'Transport', desc: 'Book your ride', link: '/vehicles', gradient: 'from-purple-500 to-indigo-600' },
            { icon: FaLeaf, title: 'Investments', desc: 'Business opportunities', link: '/investments', gradient: 'from-green-500 to-emerald-600' }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <Link to={item.link}>
                <div className={`bg-gradient-to-br ${item.gradient} p-8 rounded-2xl text-white text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <item.icon className="text-4xl mx-auto mb-4 relative z-10" />
                  <h3 className="text-xl font-semibold mb-2 relative z-10">{item.title}</h3>
                  <p className="text-sm opacity-90 relative z-10">{item.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Vision & Mission with New Design */}
      <motion.section 
        className="py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Our Vision & Mission
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="relative bg-gradient-to-br from-primary/10 via-teal-50 to-emerald-50 p-8 rounded-2xl border border-primary/20 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <div className="absolute top-4 right-4">
              <FaHeart className="text-3xl text-primary/30" />
            </div>
            <h3 className="text-3xl font-semibold mb-6 text-primary">Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become the premier platform connecting travelers with authentic Sri Lankan experiences, 
              while promoting sustainable tourism that benefits local communities.
            </p>
          </motion.div>
          <motion.div 
            className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-primary/10 p-8 rounded-2xl border border-emerald-200 hover:shadow-xl transition-all duration-300"
            variants={itemVariants}
          >
            <div className="absolute top-4 right-4">
              <FaAward className="text-3xl text-emerald-500/30" />
            </div>
            <h3 className="text-3xl font-semibold mb-6 text-emerald-700">Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              We strive to showcase the best of Sri Lanka through carefully curated experiences, 
              providing exceptional service and supporting local economies while preserving cultural heritage.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Destinations with Enhanced Design */}
      <motion.section 
        className="py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Featured Destinations
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: FaLandmark, title: 'Sigiriya', desc: 'Ancient rock fortress with stunning views', gradient: 'from-orange-400 to-red-500' },
            { icon: FaMountain, title: 'Ella', desc: 'Picturesque hill country with tea plantations', gradient: 'from-green-400 to-emerald-500' },
            { icon: FaUmbrellaBeach, title: 'Mirissa', desc: 'Beautiful beaches and whale watching', gradient: 'from-blue-400 to-cyan-500' }
          ].map((destination, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${destination.gradient} p-8 rounded-2xl text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <destination.icon className="text-5xl mb-6 relative z-10" />
                <h3 className="text-2xl font-semibold mb-4 relative z-10">{destination.title}</h3>
                <p className="text-white/90 relative z-10">{destination.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <Link 
            to="/destinations" 
            className="inline-flex items-center bg-gradient-to-r from-primary to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaMapMarkedAlt className="mr-2" />
            View All Destinations
          </Link>
        </motion.div>
      </motion.section>

      {/* About Us Section with New Visual Treatment */}
      <motion.section 
        className="py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          About Us
        </motion.h2>
        <motion.div 
          className="relative bg-gradient-to-br from-white via-emerald-50/50 to-primary/5 p-12 rounded-3xl border border-emerald-100 shadow-xl"
          variants={itemVariants}
        >
          <div className="absolute top-8 right-8">
            <FaUsers className="text-6xl text-primary/20" />
          </div>
          <div className="relative z-10">
            <p className="text-xl mb-6 text-gray-700 leading-relaxed">
              Sri Lanka Travel is your comprehensive platform for exploring the wonders of Sri Lanka. 
              We connect travelers with authentic experiences, from stunning beaches to ancient cities, 
              lush tea plantations to wildlife safaris.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our team of local experts ensures that you receive the most accurate information, 
              personalized itineraries, and access to quality accommodations and transportation 
              throughout your journey.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Home;