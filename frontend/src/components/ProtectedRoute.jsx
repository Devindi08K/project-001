import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Protected route that requires authentication
export const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

// Admin route that requires admin role
export const AdminRoute = () => {
  const { user, isAdmin, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  return user && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};