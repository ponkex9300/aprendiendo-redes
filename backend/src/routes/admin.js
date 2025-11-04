const express = require('express');
const router = express.Router();
const { User, Class, Course, Video, Module } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');
const bcrypt = require('bcryptjs');

// ============ USERS (ALL ROLES) ============
router.get('/users', authMiddleware, role(['admin']), async (req, res) => {
  try {
    console.log('[ADMIN] GET /users - User:', req.user);
    const users = await User.findAll({ 
      attributes: ['id', 'email', 'name', 'role'],
      order: [['id', 'DESC']]
    });
    console.log('[ADMIN] Found', users.length, 'users');
    res.json(users);
  } catch (error) {
    console.error('[ADMIN] Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validar que el role sea válido
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }
    
    // Verificar si el email ya existe
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      email, 
      password_hash: hash, 
      name, 
      role 
    });
    
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    const { name, email, role, password } = req.body;
    
    // Actualizar campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && ['student', 'teacher', 'admin'].includes(role)) {
      user.role = role;
    }
    if (password) {
      user.password_hash = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/users/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    // No permitir que el admin se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }
    
    await user.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ COURSES ============
router.get('/courses', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const courses = await Course.findAll({
      order: [['title', 'ASC']]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/courses', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.create({ title, description });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/courses/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    
    const { title, description } = req.body;
    if (title) course.title = title;
    if (description) course.description = description;
    
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/courses/:id', authMiddleware, role(['admin']), async (req, res) => {
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
router.get('/classes', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: Course, as: 'course', attributes: ['id', 'title'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
      ],
      order: [['title', 'ASC']]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/classes', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { course_id, teacher_id, title } = req.body;
    const classItem = await Class.create({ course_id, teacher_id, title });
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/classes/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Clase no encontrada' });
    
    const { title, course_id, teacher_id } = req.body;
    if (title) classItem.title = title;
    if (course_id) classItem.course_id = course_id;
    if (teacher_id) classItem.teacher_id = teacher_id;
    
    await classItem.save();
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/classes/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);
    if (!classItem) return res.status(404).json({ error: 'Clase no encontrada' });
    await classItem.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ VIDEOS ============
router.get('/videos', authMiddleware, role(['admin']), async (req, res) => {
  try {
    console.log('[ADMIN] GET /videos - User:', req.user);
    const videos = await Video.findAll({
      include: [
        { 
          model: Module, 
          as: 'module',
          attributes: ['id', 'title'],
          include: [
            { 
              model: Class, 
              as: 'class',
              attributes: ['id', 'title']
            }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });
    console.log('[ADMIN] Found', videos.length, 'videos');
    res.json(videos);
  } catch (error) {
    console.error('[ADMIN] Error fetching videos:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/videos/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });
    
    const { title, status } = req.body;
    if (title) video.title = title;
    if (status && ['available', 'processing', 'error'].includes(status)) {
      video.status = status;
    }
    
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/videos/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });
    await video.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MODULES ============
router.get('/modules', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [
        { model: Class, as: 'class', attributes: ['id', 'title'] }
      ],
      order: [['class_id', 'ASC'], ['module_order', 'ASC']]
    });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/modules', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { class_id, title, module_order } = req.body;
    const module = await Module.create({ class_id, title, module_order: module_order || 0 });
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/modules/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: 'Módulo no encontrado' });
    
    const { title, module_order } = req.body;
    if (title) module.title = title;
    if (module_order !== undefined) module.module_order = module_order;
    
    await module.save();
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/modules/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: 'Módulo no encontrado' });
    await module.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ENROLLMENTS ============
const { Enrollment } = require('../models');

router.get('/enrollments', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
        { model: Class, as: 'class', attributes: ['id', 'title'] }
      ]
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/enrollments', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { student_id, class_id } = req.body;
    
    // Verificar si ya existe el enrollment
    const existing = await Enrollment.findOne({ where: { student_id, class_id } });
    if (existing) {
      return res.status(400).json({ error: 'El estudiante ya está inscrito en esta clase' });
    }
    
    const enrollment = await Enrollment.create({ student_id, class_id });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/enrollments/:id', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
    await enrollment.destroy();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ VIDEO UPLOAD (usando presigned URLs como teacher) ============
const { getPresignedPutUrl, headObject } = require('../services/s3');

router.post('/videos/presign', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { filename, contentType, moduleId, title, videoOrder, duration } = req.body;
    
    if (!filename || !contentType || !moduleId) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    if (!duration || duration <= 0) {
      return res.status(400).json({ error: 'La duración del video es requerida' });
    }
    
    // Verificar que el módulo existe
    const module = await Module.findByPk(moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }
    
    const key = `modules/${moduleId}/${Date.now()}_${filename}`;
    const uploadUrl = await getPresignedPutUrl(key, contentType, 600);
    
    const video = await Video.create({
      module_id: moduleId,
      title: title || filename,
      s3_key: key,
      video_order: videoOrder || 0,
      duration_seconds: Math.round(duration),
      status: 'pending'
    });
    
    res.json({ uploadUrl, s3Key: key, videoId: video.id });
  } catch (error) {
    console.error('Error creating presigned URL:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/videos/confirm', authMiddleware, role(['admin']), async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Falta videoId' });
    }
    
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video no encontrado' });
    }
    
    try {
      await headObject(video.s3_key);
      video.status = 'available';
      await video.save();
      return res.json({ ok: true, videoId: video.id });
    } catch (err) {
      video.status = 'failed';
      await video.save();
      return res.status(400).json({ error: 'Archivo no encontrado en S3' });
    }
  } catch (error) {
    console.error('Error confirming video:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
