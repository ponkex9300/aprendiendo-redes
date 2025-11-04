import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import '../styles/StudentDashboard.css';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [progress, setProgress] = useState([]);

  const token = storage.getToken();

  useEffect(() => {
    fetchProfile();
    fetchEnrolledClasses();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar perfil');
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      storage.clear();
      window.location.href = '/login';
    }
  };

  const fetchEnrolledClasses = async () => {
    try {
      const res = await fetch('/api/student/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar clases');
      const data = await res.json();
      setEnrolledClasses(data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  };

  const fetchModules = async (classId) => {
    try {
      const res = await fetch(`/api/student/classes/${classId}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar módulos');
      const data = await res.json();
      setModules(data);
    } catch (error) {
      console.error('Error al cargar módulos:', error);
    }
  };

  const fetchVideos = async (moduleId) => {
    try {
      const res = await fetch(`/api/student/modules/${moduleId}/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al cargar videos');
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error('Error al cargar videos:', error);
    }
  };

  const fetchProgress = async (classId) => {
    try {
      const res = await fetch(`/api/student/classes/${classId}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setProgress(data);
    } catch (error) {
      console.error('Error al cargar progreso:', error);
    }
  };

  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    setSelectedVideo(null);
    setVideoUrl('');
    await fetchModules(classItem.id);
    await fetchProgress(classItem.id);
  };

  const handleSelectVideo = async (video) => {
    setSelectedVideo(video);
    try {
      const res = await fetch(`/api/videos/${video.id}/url`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Video no disponible');
      const data = await res.json();
      setVideoUrl(data.url);
      
      // Marcar video como visto
      await markVideoAsWatched(video.id);
    } catch (error) {
      console.error('Error al cargar video:', error);
      alert('Error al cargar el video');
    }
  };

  const markVideoAsWatched = async (videoId) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ video_id: videoId, watched: true })
      });
      // Recargar progreso
      if (selectedClass) {
        fetchProgress(selectedClass.id);
      }
    } catch (error) {
      console.error('Error al marcar video como visto:', error);
    }
  };

  const getProgressPercentage = () => {
    if (modules.length === 0) return 0;
    const totalVideos = modules.reduce((sum, mod) => sum + (mod.videos?.length || 0), 0);
    if (totalVideos === 0) return 0;
    const watchedVideos = progress.filter(p => p.watched).length;
    return Math.round((watchedVideos / totalVideos) * 100);
  };

  if (!profile) return <div className="loading">Cargando...</div>;

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Mi Panel de Estudiante</h1>
        <p>Bienvenido, {profile.name}</p>
      </header>

      <div className="dashboard-container">
        {/* Sidebar con clases inscritas */}
        <aside className="classes-sidebar">
          <h2>Mis Clases</h2>
          {enrolledClasses.length === 0 ? (
            <p className="no-classes">No estás inscrito en ninguna clase todavía</p>
          ) : (
            <ul className="classes-list">
              {enrolledClasses.map(classItem => (
                <li 
                  key={classItem.id}
                  className={selectedClass?.id === classItem.id ? 'active' : ''}
                  onClick={() => handleSelectClass(classItem)}
                >
                  <div className="class-item">
                    <h3>{classItem.title}</h3>
                    <p className="course-name">{classItem.course?.title || 'Curso'}</p>
                    {selectedClass?.id === classItem.id && progress.length > 0 && (
                      <div className="progress-mini">
                        <div className="progress-bar-mini" style={{ width: `${getProgressPercentage()}%` }}></div>
                        <span className="progress-text">{getProgressPercentage()}% completado</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Contenido principal */}
        <main className="dashboard-main">
          {!selectedClass ? (
            <div className="welcome-message">
              <h2>👋 ¡Hola, {profile.name}!</h2>
              <p>Selecciona una clase de la barra lateral para comenzar a estudiar.</p>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{enrolledClasses.length}</div>
                  <div className="stat-label">Clases Inscritas</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="class-header">
                <h2>{selectedClass.title}</h2>
                <p className="class-course">Curso: {selectedClass.course?.title || 'N/A'}</p>
                {progress.length > 0 && (
                  <div className="progress-section">
                    <div className="progress-info">
                      <span>Progreso del curso</span>
                      <span className="progress-percentage">{getProgressPercentage()}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {modules.length === 0 ? (
                <div className="no-content">
                  <p>📚 Esta clase aún no tiene módulos disponibles.</p>
                </div>
              ) : (
                <div className="modules-grid">
                  {modules.map((module, index) => (
                    <div key={module.id} className="module-card">
                      <div className="module-header">
                        <span className="module-number">{module.module_order}</span>
                        <h3>{module.title}</h3>
                      </div>
                      <div className="module-videos">
                        {module.videos && module.videos.length > 0 ? (
                          <ul>
                            {module.videos.map(video => {
                              const isWatched = progress.find(p => p.video_id === video.id)?.watched;
                              return (
                                <li 
                                  key={video.id}
                                  className={`video-item ${isWatched ? 'watched' : ''} ${selectedVideo?.id === video.id ? 'active' : ''}`}
                                  onClick={() => handleSelectVideo(video)}
                                >
                                  <span className="video-icon">
                                    {isWatched ? '✅' : '▶️'}
                                  </span>
                                  <span className="video-title">{video.title}</span>
                                  {video.duration_seconds > 0 && (
                                    <span className="video-duration">
                                      {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="no-videos">No hay videos en este módulo</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Player */}
              {selectedVideo && videoUrl && (
                <div className="video-player-section">
                  <h3>Reproduciendo: {selectedVideo.title}</h3>
                  <div className="video-container">
                    <video 
                      key={videoUrl}
                      controls 
                      autoPlay
                      className="video-player"
                      onEnded={() => markVideoAsWatched(selectedVideo.id)}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
