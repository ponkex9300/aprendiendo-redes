const express = require('express');
const router = express.Router();
const { Class, Module, Video } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');

// listar clases del teacher
router.get('/classes', authMiddleware, role(['teacher']), async (req, res) => {
  const classes = await Class.findAll({ where: { teacher_id: req.user.id } });
  res.json(classes);
});

// opcional: crear clase, módulos, etc. (simplificado)
module.exports = router;
