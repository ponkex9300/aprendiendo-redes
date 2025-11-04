import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [profile, setProfile] = useState(null);
  
  // Users
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [editingUser, setEditingUser] = useState(null);
  
  // Courses
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ title: '', description: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Classes
  const [classes, setClasses] = useState([]);
  const [classForm, setClassForm] = useState({ title: '', course_id: '', teacher_id: '' });
  const [editingClass, setEditingClass] = useState(null);
  const [teachers, setTeachers] = useState([]);
  
  // Videos
  const [videos, setVideos] = useState([]);
  const [videoForm, setVideoForm] = useState({ module_id: '', title: '', file: null });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  // Modules
  const [modules, setModules] = useState([]);
  const [moduleForm, setModuleForm] = useState({ class_id: '', title: '', module_order: 0 });
  const [editingModule, setEditingModule] = useState(null);
  
  // Enrollments
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentForm, setEnrollmentForm] = useState({ student_id: '', class_id: '' });
  const [students, setStudents] = useState([]);

  const token = storage.getToken();

  useEffect(() => {
    fetchProfile();
    fetchUsers();
    fetchCourses();
    fetchClasses();
    fetchVideos();
    fetchModules();
    fetchEnrollments();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  };

  // ============ USERS ============
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
      setTeachers(data.filter(u => u.role === 'teacher'));
      setStudents(data.filter(u => u.role === 'student'));
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(userForm)
        });
        if (res.ok) {
          alert('Usuario actualizado exitosamente');
          setEditingUser(null);
        }
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(userForm)
        });
        if (res.ok) {
          alert('Usuario creado exitosamente');
        } else {
          const error = await res.json();
          alert('Error: ' + error.error);
        }
      }
      setUserForm({ name: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar usuario');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Usuario eliminado');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============ COURSES ============
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(courseForm)
        });
        if (res.ok) {
          alert('Curso actualizado');
          setEditingCourse(null);
        }
      } else {
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(courseForm)
        });
        if (res.ok) {
          alert('Curso creado');
        }
      }
      setCourseForm({ title: '', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('¿Eliminar este curso?')) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Curso eliminado');
        fetchCourses();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============ CLASSES ============
  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/admin/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        const res = await fetch(`/api/admin/classes/${editingClass.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(classForm)
        });
        if (res.ok) {
          alert('Clase actualizada');
          setEditingClass(null);
        }
      } else {
        const res = await fetch('/api/admin/classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(classForm)
        });
        if (res.ok) {
          alert('Clase creada');
        }
      }
      setClassForm({ title: '', course_id: '', teacher_id: '' });
      fetchClasses();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('¿Eliminar esta clase?')) return;
    try {
      const res = await fetch(`/api/admin/classes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Clase eliminada');
        fetchClasses();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============ MODULES ============
  const fetchModules = async () => {
    try {
      const res = await fetch('/api/admin/modules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setModules(data);
    } catch (error) {
      console.error('Error al cargar módulos:', error);
    }
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingModule) {
        const res = await fetch(`/api/admin/modules/${editingModule.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(moduleForm)
        });
        if (res.ok) {
          alert('Módulo actualizado');
          setEditingModule(null);
        }
      } else {
        const res = await fetch('/api/admin/modules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(moduleForm)
        });
        if (res.ok) {
          alert('Módulo creado');
        }
      }
      setModuleForm({ class_id: '', title: '', module_order: 0 });
      fetchModules();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm('¿Eliminar este módulo?')) return;
    try {
      const res = await fetch(`/api/admin/modules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Módulo eliminado');
        fetchModules();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============ VIDEOS ============
  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error('Error al cargar videos:', error);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoForm.file) {
      alert('Selecciona un archivo de video');
      return;
    }
    
    setUploadingVideo(true);
    try {
      // 0. Obtener duración del video
      const duration = await new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        
        video.onerror = () => {
          reject(new Error('Error al leer el archivo de video'));
        };
        
        video.src = URL.createObjectURL(videoForm.file);
      });
      
      // 1. Obtener URL de carga presignada
      const presignData = {
        filename: videoForm.file.name,
        contentType: videoForm.file.type,
        moduleId: videoForm.module_id,
        title: videoForm.title || videoForm.file.name,
        duration: duration
      };
      
      const res1 = await fetch('/api/admin/videos/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(presignData)
      });
      
      if (!res1.ok) {
        const error = await res1.json();
        throw new Error(error.error || 'Error obteniendo URL de carga');
      }
      
      const { uploadUrl, videoId } = await res1.json();
      
      // 2. Subir video directamente a S3
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', videoForm.file.type);
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Error subiendo a S3: ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error('Error de red al subir video'));
        xhr.send(videoForm.file);
      });
      
      // 3. Confirmar subida
      const res2 = await fetch('/api/admin/videos/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ videoId })
      });
      
      if (!res2.ok) {
        const error = await res2.json();
        throw new Error(error.error || 'Error confirmando subida');
      }
      
      alert('Video subido exitosamente');
      setVideoForm({ module_id: '', title: '', file: null });
      document.getElementById('videoFileInput').value = '';
      fetchVideos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir video: ' + error.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('¿Eliminar este video?')) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Video eliminado');
        fetchVideos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============ ENROLLMENTS ============
  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/admin/enrollments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
    }
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(enrollmentForm)
      });
      if (res.ok) {
        alert('Estudiante inscrito exitosamente');
        setEnrollmentForm({ student_id: '', class_id: '' });
        fetchEnrollments();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm('¿Eliminar esta inscripción?')) return;
    try {
      const res = await fetch(`/api/admin/enrollments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Inscripción eliminada');
        fetchEnrollments();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    storage.clear();
    window.location.href = '/';
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <div className="header-actions">
          {profile && <span>Bienvenido, {profile.name}</span>}
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab('users')}
          className={activeTab === 'users' ? 'tab active' : 'tab'}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={activeTab === 'courses' ? 'tab active' : 'tab'}
        >
          Cursos
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={activeTab === 'classes' ? 'tab active' : 'tab'}
        >
          Clases
        </button>
        <button
          onClick={() => setActiveTab('modules')}
          className={activeTab === 'modules' ? 'tab active' : 'tab'}
        >
          Módulos
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={activeTab === 'videos' ? 'tab active' : 'tab'}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={activeTab === 'enrollments' ? 'tab active' : 'tab'}
        >
          Inscripciones
        </button>
      </div>

      <div className="dashboard-content">
        {/* ============ USERS TAB ============ */}
        {activeTab === 'users' && (
          <div className="tab-content">
            <h2>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
            <form onSubmit={handleUserSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Nombre"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!editingUser}
              />
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                required
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
                {editingUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setUserForm({ name: '', email: '', password: '', role: 'student' });
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <h2>Lista de Usuarios</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setUserForm({ name: user.name, email: user.email, password: '', role: user.role });
                        }}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="btn-delete">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ COURSES TAB ============ */}
        {activeTab === 'courses' && (
          <div className="tab-content">
            <h2>{editingCourse ? 'Editar Curso' : 'Crear Curso'}</h2>
            <form onSubmit={handleCourseSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Título del curso"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Descripción"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                rows={4}
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingCourse ? 'Actualizar' : 'Crear'}
                </button>
                {editingCourse && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCourse(null);
                      setCourseForm({ title: '', description: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <h2>Lista de Cursos</h2>
            <div className="cards-grid">
              {courses.map(course => (
                <div key={course.id} className="card">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="card-actions">
                    <button
                      onClick={() => {
                        setEditingCourse(course);
                        setCourseForm({ title: course.title, description: course.description });
                      }}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="btn-delete">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ CLASSES TAB ============ */}
        {activeTab === 'classes' && (
          <div className="tab-content">
            <h2>{editingClass ? 'Editar Clase' : 'Crear Clase'}</h2>
            <form onSubmit={handleClassSubmit} className="admin-form">
              <input
                type="text"
                placeholder="Título de la clase"
                value={classForm.title}
                onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                required
              />
              <select
                value={classForm.course_id}
                onChange={(e) => setClassForm({ ...classForm, course_id: e.target.value })}
                required
              >
                <option value="">Seleccionar curso</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <select
                value={classForm.teacher_id}
                onChange={(e) => setClassForm({ ...classForm, teacher_id: e.target.value })}
              >
                <option value="">Seleccionar profesor (opcional)</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingClass ? 'Actualizar' : 'Crear'}
                </button>
                {editingClass && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClass(null);
                      setClassForm({ title: '', course_id: '', teacher_id: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <h2>Lista de Clases</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Curso</th>
                  <th>Profesor</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls.id}>
                    <td>{cls.id}</td>
                    <td>{cls.title}</td>
                    <td>{cls.course?.title || 'N/A'}</td>
                    <td>{cls.teacher?.name || 'Sin asignar'}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingClass(cls);
                          setClassForm({
                            title: cls.title,
                            course_id: cls.course_id,
                            teacher_id: cls.teacher_id || ''
                          });
                        }}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDeleteClass(cls.id)} className="btn-delete">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ MODULES TAB ============ */}
        {activeTab === 'modules' && (
          <div className="tab-content">
            <h2>{editingModule ? 'Editar Módulo' : 'Crear Módulo'}</h2>
            <form onSubmit={handleModuleSubmit} className="admin-form">
              <select
                value={moduleForm.class_id}
                onChange={(e) => setModuleForm({ ...moduleForm, class_id: e.target.value })}
                required
              >
                <option value="">Seleccionar clase</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Título del módulo"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Orden"
                value={moduleForm.module_order}
                onChange={(e) => setModuleForm({ ...moduleForm, module_order: parseInt(e.target.value) })}
                min="0"
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingModule ? 'Actualizar' : 'Crear'}
                </button>
                {editingModule && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingModule(null);
                      setModuleForm({ class_id: '', title: '', module_order: 0 });
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <h2>Lista de Módulos</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Clase</th>
                  <th>Orden</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(mod => (
                  <tr key={mod.id}>
                    <td>{mod.id}</td>
                    <td>{mod.title}</td>
                    <td>{mod.class?.title || 'N/A'}</td>
                    <td>{mod.module_order}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingModule(mod);
                          setModuleForm({
                            class_id: mod.class_id,
                            title: mod.title,
                            module_order: mod.module_order
                          });
                        }}
                        className="btn-edit"
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDeleteModule(mod.id)} className="btn-delete">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ============ VIDEOS TAB ============ */}
        {activeTab === 'videos' && (
          <div className="tab-content">
            <h2>Subir Video</h2>
            <form onSubmit={handleVideoUpload} className="admin-form">
              <select
                value={videoForm.module_id}
                onChange={(e) => setVideoForm({ ...videoForm, module_id: e.target.value })}
                required
              >
                <option value="">Seleccionar módulo</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.class?.title || 'N/A'})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Título del video (opcional)"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
              />
              <input
                type="file"
                id="videoFileInput"
                accept="video/*"
                onChange={(e) => setVideoForm({ ...videoForm, file: e.target.files[0] })}
                required
              />
              <button type="submit" className="btn-primary" disabled={uploadingVideo}>
                {uploadingVideo ? 'Subiendo...' : 'Subir Video'}
              </button>
            </form>

            <h2>Lista de Videos</h2>
            <div className="cards-grid">
              {videos.map(video => (
                <div key={video.id} className="card">
                  <h3>{video.title}</h3>
                  <p>
                    <strong>Módulo:</strong> {video.module?.title || 'N/A'}<br />
                    <strong>Clase:</strong> {video.module?.class?.title || 'N/A'}<br />
                    <strong>Estado:</strong> <span className={`badge badge-${video.status}`}>{video.status}</span>
                  </p>
                  <div className="card-actions">
                    <button onClick={() => handleDeleteVideo(video.id)} className="btn-delete">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ ENROLLMENTS TAB ============ */}
        {activeTab === 'enrollments' && (
          <div className="tab-content">
            <h2>Inscribir Estudiante</h2>
            <form onSubmit={handleEnrollmentSubmit} className="admin-form">
              <select
                value={enrollmentForm.student_id}
                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, student_id: e.target.value })}
                required
              >
                <option value="">Seleccionar estudiante</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
              <select
                value={enrollmentForm.class_id}
                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, class_id: e.target.value })}
                required
              >
                <option value="">Seleccionar clase</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.title} - {c.course?.title || 'N/A'}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary">Inscribir</button>
            </form>

            <h2>Lista de Inscripciones</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Clase</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(enr => (
                  <tr key={enr.id}>
                    <td>{enr.id}</td>
                    <td>{enr.student?.name || 'N/A'} ({enr.student?.email || 'N/A'})</td>
                    <td>{enr.class?.title || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleDeleteEnrollment(enr.id)} className="btn-delete">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
