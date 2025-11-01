import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClassView from './pages/ClassView';
import VideoPlayer from './pages/VideoPlayer';
import RoleGuard from './components/RoleGuard';

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RoleGuard><Dashboard/></RoleGuard>} />
      <Route path="/class/:id" element={<RoleGuard><ClassView/></RoleGuard>} />
      <Route path="/video/:id" element={<RoleGuard><VideoPlayer/></RoleGuard>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
