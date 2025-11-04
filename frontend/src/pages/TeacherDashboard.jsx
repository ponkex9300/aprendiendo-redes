import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import '../styles/TeacherDashboard.css';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [profile, setProfile] = useState(null);
  
  // Courses state
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Classes state
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ course_id: '', title: '' });
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Students state
  const [allStudents, setAllStudents] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  
  // Modules state
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ title: '', module_order: 1 });
  
  // Videos state
  const [selectedModule, setSelectedModule] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const token = storage.getToken();

  useEffect(() => {
    fetchProfile();
    fetchCourses();
    fetchClasses();
    fetchAllStudents();
  }, []);

  // Limpiar selectedClass si ya no está en la lista de clases del profesor
  useEffect(() => {
    if (selectedClass && classes.length > 0) {
      const stillExists = classes.some(c => c.id === selectedClass.id);
      if (!stillExists) {
        setSelectedClass(null);
        setClassStudents([]);
        setModules([]);
      }
    }
  }, [classes, selectedClass]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Error al cargar perfil');
      }
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      alert('Error al cargar perfil. Por favor, vuelva a iniciar sesión.');
      storage.clear();
      window.location.href = '/login';
    }
  };

  // ========== COURSES ==========
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teacher/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        setNewCourse({ title: '', description: '' });
        fetchCourses();
        alert('Curso creado exitosamente');
      }
    } catch (error) {
      console.error('Error al crear curso:', error);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/teacher/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCourse)
      });
      if (res.ok) {
        setEditingCourse(null);
        fetchCourses();
        alert('Curso actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar curso:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este curso?')) return;
    try {
      const res = await fetch(`/api/teacher/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCourses();
        alert('Curso eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar curso:', error);
    }
  };

  // ========== CLASSES ==========
  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/teacher/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/teacher/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newClass)
      });
      if (res.ok) {
        setNewClass({ course_id: '', title: '' });
        fetchClasses();
        alert('Clase creada exitosamente');
      }
    } catch (error) {
      console.error('Error al crear clase:', error);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta clase?')) return;
    try {
      const res = await fetch(`/api/teacher/classes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchClasses();
        alert('Clase eliminada exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar clase:', error);
    }
  };

  // ========== STUDENTS ==========
  const fetchAllStudents = async () => {
    try {
      const res = await fetch('/api/teacher/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllStudents(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  const fetchClassStudents = async (classId) => {
    try {
      const res = await fetch(`/api/teacher/classes/${classId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        console.error('Error al cargar estudiantes:', res.status);
        setClassStudents([]);
        return;
      }
      
      const data = await res.json();
      setClassStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar estudiantes de la clase:', error);
      setClassStudents([]);
    }
  };

  const handleSelectClass = (classItem) => {
    // Verificar que la clase esté en la lista del profesor
    const isOwner = classes.some(c => c.id === classItem.id);
    if (!isOwner) {
      alert('No tienes acceso a esta clase');
      return;
    }
    
    setSelectedClass(classItem);
    fetchClassStudents(classItem.id);
    fetchModules(classItem.id);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass) return;
    
    try {
      const res = await fetch(`/api/teacher/classes/${selectedClass.id}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: parseInt(selectedStudent) })
      });
      
      if (res.ok) {
        setSelectedStudent('');
        fetchClassStudents(selectedClass.id);
        alert('Estudiante agregado exitosamente');
      } else {
        const error = await res.json();
        alert(error.error || 'Error al agregar estudiante');
      }
    } catch (error) {
      console.error('Error al agregar estudiante:', error);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('¿Está seguro de eliminar este estudiante de la clase?')) return;
    try {
      const res = await fetch(`/api/teacher/classes/${selectedClass.id}/students/${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchClassStudents(selectedClass.id);
        alert('Estudiante eliminado de la clase');
      }
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
    }
  };

  // ========== MODULES ==========
  const fetchModules = async (classId) => {
    try {
      const res = await fetch(`/api/teacher/classes/${classId}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        console.error('Error al cargar módulos:', res.status);
        setModules([]);
        return;
      }
      
      const data = await res.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar módulos:', error);
      setModules([]);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    
    try {
      const res = await fetch(`/api/teacher/classes/${selectedClass.id}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newModule)
      });
      if (res.ok) {
        setNewModule({ title: '', module_order: modules.length + 1 });
        fetchModules(selectedClass.id);
        alert('Módulo creado exitosamente');
      }
    } catch (error) {
      console.error('Error al crear módulo:', error);
    }
  };

  // ========== VIDEOS ==========
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !selectedModule || !selectedClass) {
      alert('Por favor selecciona un módulo y un archivo de video');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('Iniciando subida de video:', {
        filename: videoFile.name,
        size: videoFile.size,
        type: videoFile.type,
        classId: selectedClass.id,
        moduleId: selectedModule.id
      });

      // Paso 0: Obtener duración del video
      console.log('Obteniendo duración del video...');
      const duration = await new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          console.log('Duración del video:', video.duration, 'segundos');
          resolve(video.duration);
        };
        
        video.onerror = () => {
          reject(new Error('Error al leer el archivo de video'));
        };
        
        video.src = URL.createObjectURL(videoFile);
      });

      // Paso 1: Obtener URL pre-firmada
      setUploadProgress(10);
      const presignRes = await fetch('/api/videos/presign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: videoFile.name,
          contentType: videoFile.type || 'video/mp4',
          classId: selectedClass.id,
          moduleId: selectedModule.id,
          videoOrder: 1,
          title: videoTitle || videoFile.name,
          duration: duration
        })
      });

      if (!presignRes.ok) {
        const errorData = await presignRes.json().catch(() => ({}));
        console.error('Error en presign:', errorData);
        throw new Error(errorData.error || 'Error al obtener URL de carga');
      }

      const { uploadUrl, videoId, s3Key } = await presignRes.json();
      console.log('URL presigned obtenida, videoId:', videoId);
      console.log('Upload URL:', uploadUrl.substring(0, 100) + '...');
      setUploadProgress(25);

      // Paso 2: Subir archivo a S3 usando XMLHttpRequest para mejor compatibilidad
      console.log('Subiendo a S3...');
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = 25 + Math.round((e.loaded / e.total) * 50);
            setUploadProgress(percentComplete);
            console.log(`Progreso: ${percentComplete}%`);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            console.log('✅ Video subido a S3 exitosamente');
            console.log('ETag:', xhr.getResponseHeader('ETag'));
            setUploadProgress(75);
            resolve();
          } else {
            console.error('❌ Error en S3:', xhr.status, xhr.statusText);
            console.error('Response:', xhr.responseText);
            reject(new Error(`Error al subir: ${xhr.status} ${xhr.statusText}`));
          }
        });

        xhr.addEventListener('error', () => {
          console.error('❌ Error de red al subir a S3');
          reject(new Error('Error de red al subir el video'));
        });

        xhr.addEventListener('abort', () => {
          console.error('❌ Subida cancelada');
          reject(new Error('Subida cancelada'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', videoFile.type || 'video/mp4');
        xhr.send(videoFile);
      });

      // Paso 3: Confirmar la subida
      console.log('Confirmando subida...');
      const confirmRes = await fetch('/api/videos/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ videoId })
      });

      if (!confirmRes.ok) {
        const errorData = await confirmRes.json().catch(() => ({}));
        console.error('Error en confirm:', errorData);
        throw new Error(errorData.error || 'Error al confirmar la subida del video');
      }

      console.log('Video confirmado exitosamente');
      setUploadProgress(100);
      alert('¡Video subido exitosamente!');
      
      // Limpiar formulario
      setVideoFile(null);
      setVideoTitle('');
      setUploadProgress(0);
      
      // Recargar la lista de módulos si es necesario
      if (selectedClass) {
        fetchModules(selectedClass.id);
      }
      
    } catch (error) {
      console.error('Error al subir video:', error);
      alert('Error al subir video: ' + error.message);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile) return <div className="loading">Cargando...</div>;

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Dashboard del Profesor</h1>
        <p>Bienvenido, {profile.name}</p>
      </header>

      <nav className="dashboard-tabs">
        <button 
          className={activeTab === 'courses' ? 'active' : ''} 
          onClick={() => setActiveTab('courses')}
        >
          Cursos
        </button>
        <button 
          className={activeTab === 'classes' ? 'active' : ''} 
          onClick={() => setActiveTab('classes')}
        >
          Clases
        </button>
        <button 
          className={activeTab === 'students' ? 'active' : ''} 
          onClick={() => setActiveTab('students')}
        >
          Estudiantes
        </button>
      </nav>

      <main className="dashboard-content">
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="tab-content">
            <h2>Gestión de Cursos</h2>
            
            <div className="form-section">
              <h3>{editingCourse ? 'Editar Curso' : 'Crear Nuevo Curso'}</h3>
              <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                <input
                  type="text"
                  placeholder="Título del curso"
                  value={editingCourse ? editingCourse.title : newCourse.title}
                  onChange={(e) => editingCourse 
                    ? setEditingCourse({...editingCourse, title: e.target.value})
                    : setNewCourse({...newCourse, title: e.target.value})
                  }
                  required
                />
                <textarea
                  placeholder="Descripción del curso"
                  value={editingCourse ? editingCourse.description : newCourse.description}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({...editingCourse, description: e.target.value})
                    : setNewCourse({...newCourse, description: e.target.value})
                  }
                  rows="4"
                />
                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    {editingCourse ? 'Actualizar' : 'Crear'} Curso
                  </button>
                  {editingCourse && (
                    <button type="button" className="btn-secondary" onClick={() => setEditingCourse(null)}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="list-section">
              <h3>Cursos Existentes</h3>
              <div className="items-grid">
                {courses.map(course => (
                  <div key={course.id} className="card">
                    <h4>{course.title}</h4>
                    <p>{course.description}</p>
                    <div className="card-actions">
                      <button onClick={() => setEditingCourse(course)} className="btn-edit">
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
          </div>
        )}

        {/* CLASSES TAB */}
        {activeTab === 'classes' && (
          <div className="tab-content">
            <h2>Gestión de Clases</h2>
            
            <div className="form-section">
              <h3>Crear Nueva Clase</h3>
              <form onSubmit={handleCreateClass}>
                <select
                  value={newClass.course_id}
                  onChange={(e) => setNewClass({...newClass, course_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Título de la clase"
                  value={newClass.title}
                  onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                  required
                />
                <button type="submit" className="btn-primary">Crear Clase</button>
              </form>
            </div>

            <div className="list-section">
              <h3>Mis Clases</h3>
              <div className="items-grid">
                {classes.map(classItem => (
                  <div key={classItem.id} className="card">
                    <h4>{classItem.title}</h4>
                    <p>Curso: {classItem.course?.title || 'N/A'}</p>
                    <div className="card-actions">
                      <button onClick={() => handleSelectClass(classItem)} className="btn-view">
                        Ver Detalles
                      </button>
                      <button onClick={() => handleDeleteClass(classItem.id)} className="btn-delete">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="tab-content">
            <h2>Gestión de Estudiantes</h2>
            
            {!selectedClass ? (
              <div className="info-message">
                <p>Selecciona una clase desde la pestaña "Clases" para gestionar sus estudiantes</p>
              </div>
            ) : (
              <>
                <div className="class-info">
                  <h3>Clase Seleccionada: {selectedClass.title}</h3>
                  <button onClick={() => setSelectedClass(null)} className="btn-secondary">
                    Cambiar Clase
                  </button>
                </div>

                <div className="form-section">
                  <h3>Agregar Estudiante a la Clase</h3>
                  <form onSubmit={handleAddStudent}>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                    >
                      <option value="">Seleccionar estudiante</option>
                      {allStudents
                        .filter(s => !classStudents.find(cs => cs.id === s.id))
                        .map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name} ({student.email})
                          </option>
                        ))
                      }
                    </select>
                    <button type="submit" className="btn-primary">Agregar Estudiante</button>
                  </form>
                </div>

                <div className="list-section">
                  <h3>Estudiantes Inscritos ({classStudents.length})</h3>
                  <table className="students-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map(student => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <button 
                              onClick={() => handleRemoveStudent(student.id)} 
                              className="btn-delete-small"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modules-section">
                  <h3>Módulos de la Clase</h3>
                  
                  <div className="form-section">
                    <h4>Crear Nuevo Módulo</h4>
                    <form onSubmit={handleCreateModule}>
                      <input
                        type="text"
                        placeholder="Título del módulo"
                        value={newModule.title}
                        onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Orden"
                        value={newModule.module_order}
                        onChange={(e) => setNewModule({...newModule, module_order: parseInt(e.target.value)})}
                        min="1"
                      />
                      <button type="submit" className="btn-primary">Crear Módulo</button>
                    </form>
                  </div>

                  <div className="modules-list">
                    {modules.length === 0 ? (
                      <p>No hay módulos creados para esta clase</p>
                    ) : (
                      <ul>
                        {modules.map(module => (
                          <li key={module.id} onClick={() => setSelectedModule(module)} 
                              className={selectedModule?.id === module.id ? 'module-selected' : ''}>
                            <span className="module-order">{module.module_order}.</span>
                            <span className="module-title">{module.title}</span>
                            {selectedModule?.id === module.id && <span className="module-badge">Seleccionado</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {selectedModule && (
                  <div className="videos-section">
                    <h3>Subir Video al Módulo: {selectedModule.title}</h3>
                    
                    <div className="form-section">
                      <form onSubmit={handleVideoUpload}>
                        <input
                          type="text"
                          placeholder="Título del video (opcional)"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                        />
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files[0])}
                          required
                          disabled={isUploading}
                        />
                        {videoFile && (
                          <p className="file-info">
                            Archivo seleccionado: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                        {isUploading && (
                          <div className="upload-progress">
                            <div className="progress-bar" style={{width: `${uploadProgress}%`}}>
                              {uploadProgress}%
                            </div>
                          </div>
                        )}
                        <button 
                          type="submit" 
                          className="btn-primary" 
                          disabled={isUploading || !videoFile}
                        >
                          {isUploading ? 'Subiendo...' : 'Subir Video'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
