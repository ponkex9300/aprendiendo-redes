const express = require('express');
const router = express.Router();
const { Enrollment, Class, Module, Video } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');

// enrollments
router.get('/enrollments', authMiddleware, role(['student']), async (req, res) => {
  const enrolls = await Enrollment.findAll({ where: { student_id: req.user.id } });
  res.json(enrolls);
});

// obtener clase con módulos y videos
router.get('/classes/:id', authMiddleware, role(['student','teacher','admin']), async (req, res) => {
  const classId = req.params.id;
  const modules = await Module.findAll({
    where: { class_id: classId },
    include: [{ model: Video }]
  });
  res.json({ modules });
});

module.exports = router;
