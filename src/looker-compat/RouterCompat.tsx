import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// This is a compatibility layer to provide useHistory functionality
// for the Looker Extension SDK which expects React Router v5
export const useHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Create a history-like object that mimics the React Router v5 history API
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    location: location
  };
};

// Export a compatibility component that provides the useHistory hook
export const RouterCompat: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
}; 