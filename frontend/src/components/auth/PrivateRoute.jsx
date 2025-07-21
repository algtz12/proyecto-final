import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isAuthorized } = useAuthorization(allowedRoles);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !isAuthorized()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;