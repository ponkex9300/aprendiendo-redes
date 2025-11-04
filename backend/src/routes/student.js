const express = require('express');
const router = express.Router();
const { Enrollment, Class, Module, Video, Course, Progress } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');

// Obtener todas las clases en las que está inscrito el estudiante
router.get('/classes', authMiddleware, role(['student']), async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { student_id: req.user.id },
      include: [{
        model: Class,
        as: 'class',
        include: [{
          model: Course,
          as: 'course'
        }]
      }]
    });
    
    const classes = enrollments.map(e => e.class);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener módulos de una clase
router.get('/classes/:classId/modules', authMiddleware, role(['student']), async (req, res) => {
  try {
    // Verificar que el estudiante está inscrito en la clase
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: req.user.id,
        class_id: req.params.classId
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'No estás inscrito en esta clase' });
    }

    const modules = await Module.findAll({
      where: { class_id: req.params.classId },
      include: [{
        model: Video,
        as: 'videos',
        where: { status: 'available' },
        required: false,
        order: [['video_order', 'ASC']]
      }],
      order: [['module_order', 'ASC']]
    });

    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener videos de un módulo
router.get('/modules/:moduleId/videos', authMiddleware, role(['student']), async (req, res) => {
  try {
    // Obtener el módulo con su clase para verificar inscripción
    const module = await Module.findByPk(req.params.moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    // Verificar inscripción
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: req.user.id,
        class_id: module.class_id
      }
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'No estás inscrito en esta clase' });
    }

    const videos = await Video.findAll({
      where: {
        module_id: req.params.moduleId,
        status: 'available'
      },
      order: [['video_order', 'ASC']]
    });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener progreso de una clase
router.get('/classes/:classId/progress', authMiddleware, role(['student']), async (req, res) => {
  try {
    // Obtener todos los módulos de la clase
    const modules = await Module.findAll({
      where: { class_id: req.params.classId },
      include: [{
        model: Video,
        as: 'videos',
        where: { status: 'available' },
        required: false
      }]
    });

    // Obtener todos los IDs de videos
    const videoIds = [];
    modules.forEach(module => {
      if (module.videos) {
        module.videos.forEach(video => {
          videoIds.push(video.id);
        });
      }
    });

    // Obtener progreso del estudiante
    const progress = await Progress.findAll({
      where: {
        student_id: req.user.id,
        video_id: videoIds
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Legacy: enrollments (mantener compatibilidad)
router.get('/enrollments', authMiddleware, role(['student']), async (req, res) => {
  const enrolls = await Enrollment.findAll({ where: { student_id: req.user.id } });
  res.json(enrolls);
});

// Legacy: obtener clase con módulos y videos (mantener compatibilidad)
router.get('/classes/:id', authMiddleware, role(['student','teacher','admin']), async (req, res) => {
  const classId = req.params.id;
  const modules = await Module.findAll({
    where: { class_id: classId },
    include: [{ model: Video, as: 'videos' }]
  });
  res.json({ modules });
});

module.exports = router;
