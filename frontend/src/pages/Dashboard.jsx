import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import AdminDashboard from './AdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.getToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al cargar perfil');
        }
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar perfil:', err);
        storage.clear();
        window.location.href = '/login';
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando dashboard...</div>;
  if (!profile) return <div>No se pudo cargar el perfil.</div>;

  if (profile.role === 'admin') {
    return <AdminDashboard />;
  }

  if (profile.role === 'teacher') {
    return <TeacherDashboard />;
  }

  if (profile.role === 'student') {
    return <StudentDashboard />;
  }

  return <div>Rol desconocido: {profile.role}</div>;
}
