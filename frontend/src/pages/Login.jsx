import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { storage } from '../utils/storage';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await login(email, password);
      storage.setToken(data.token);
      storage.setUser(data.user);
      navigate('/dashboard');
    } catch (error) {
      setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
          </div>
          <h1>Aprendiendo Redes</h1>
          <p>Plataforma de Educación Online</p>
        </div>

        <form onSubmit={onSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">🔒 Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              '🚀 Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Problemas para acceder? Contacta al administrador</p>
        </div>
      </div>
    </div>
  );
}
