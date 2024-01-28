import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import NotFound from './NotFound';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const { isValidClass } = useProfile();


  if (!user) {
    return <Navigate to="/accounts/login" replace />;
  }




  if (!isValidClass) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen z-10">
        <NotFound />
      </div>
    );
  }

  return children;
}
