const express = require('express');
const router = express.Router();
const { Course, Class, Module, Video, User, Enrollment } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');

// ============ COURSES ============
// Listar solo los cursos donde el teacher tiene clases asignadas
router.get('/courses', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    // Obtener IDs de cursos donde el teacher tiene clases
    const classes = await Class.findAll({
      where: { teacher_id: req.user.id },
      attributes: ['course_id']
    });
    
    const courseIds = [...new Set(classes.map(c => c.course_id))];
    
    if (courseIds.length === 0) {
      return res.json([]);
    }
    
    const courses = await Course.findAll({
      where: { id: courseIds }
    });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo curso
router.post('/courses', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.create({ title, description });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un curso
router.put('/courses/:id', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    
    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un curso
router.delete('/courses/:id', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    await course.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CLASSES ============
// Listar clases del teacher
router.get('/classes', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classes = await Class.findAll({ 
      where: { teacher_id: req.user.id },
      include: [{ model: Course, as: 'course' }]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva clase
router.post('/classes', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const { course_id, title } = req.body;
    const newClass = await Class.create({
      course_id,
      title,
      teacher_id: req.user.id
    });
    res.json(newClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una clase
router.put('/classes/:id', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Clase no encontrada' });
    if (classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const { title, course_id } = req.body;
    classItem.title = title || classItem.title;
    classItem.course_id = course_id || classItem.course_id;
    await classItem.save();
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una clase
router.delete('/classes/:id', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Clase no encontrada' });
    if (classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    await classItem.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENROLLMENTS ============
// Obtener estudiantes de una clase
router.get('/classes/:classId/students', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.classId);
    if (!classItem || classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const enrollments = await Enrollment.findAll({
      where: { class_id: req.params.classId },
      include: [{ model: User, as: 'student', attributes: ['id', 'name', 'email'] }]
    });
    
    res.json(enrollments.map(e => e.student));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar todos los estudiantes disponibles
router.get('/students', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const students = await User.findAll({ 
      where: { role: 'student' },
      attributes: ['id', 'name', 'email']
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar estudiante a una clase
router.post('/classes/:classId/students', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.classId);
    if (!classItem || classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const { student_id } = req.body;
    
    // Verificar que el estudiante existe
    const student = await User.findByPk(student_id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    // Verificar que no esté ya inscrito
    const existing = await Enrollment.findOne({
      where: { student_id, class_id: req.params.classId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'El estudiante ya está inscrito en esta clase' });
    }
    
    const enrollment = await Enrollment.create({
      student_id,
      class_id: req.params.classId
    });
    
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar estudiante de una clase
router.delete('/classes/:classId/students/:studentId', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.classId);
    if (!classItem || classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const enrollment = await Enrollment.findOne({
      where: { 
        student_id: req.params.studentId,
        class_id: req.params.classId
      }
    });
    
    if (!enrollment) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }
    
    await enrollment.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MODULES ============
// Obtener módulos de una clase
router.get('/classes/:classId/modules', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.classId);
    if (!classItem || classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const modules = await Module.findAll({
      where: { class_id: req.params.classId },
      order: [['module_order', 'ASC']]
    });
    
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear módulo en una clase
router.post('/classes/:classId/modules', authMiddleware, role(['teacher']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.classId);
    if (!classItem || classItem.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const { title, module_order } = req.body;
    const module = await Module.create({
      class_id: req.params.classId,
      title,
      module_order
    });
    
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
