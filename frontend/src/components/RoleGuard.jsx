import React from 'react';
import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';

export default function RoleGuard({ children }) {
  const token = storage.getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
