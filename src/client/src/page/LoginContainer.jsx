import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

function LoginContainer({ children }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (children);
}

export default LoginContainer;
