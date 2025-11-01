const express = require('express');
const router = express.Router();
const { User, Class } = require('../models');
const { authMiddleware, role } = require('../middlewares/auth');
const bcrypt = require('bcryptjs');

// Students CRUD
router.get('/students', authMiddleware, role(['admin']), async (req, res) => {
  const students = await User.findAll({ where: { role: 'student' }, attributes: ['id','email','name','role'] });
  res.json(students);
});

router.post('/students', authMiddleware, role(['admin']), async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({ email, password_hash: hash, name, role: 'student' });
  res.json({ id: u.id, email: u.email, name: u.name });
});

router.put('/students/:id', authMiddleware, role(['admin']), async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  const { name, email } = req.body;
  u.name = name || u.name;
  u.email = email || u.email;
  await u.save();
  res.json({ ok: true });
});

router.delete('/students/:id', authMiddleware, role(['admin']), async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  await u.destroy();
  res.json({ ok: true });
});

// Teachers and Classes endpoints follow same pattern (example teacher list)
router.get('/teachers', authMiddleware, role(['admin']), async (req, res) => {
  const teachers = await User.findAll({ where: { role: 'teacher' }, attributes: ['id','email','name','role'] });
  res.json(teachers);
});

// Classes CRUD
router.get('/classes', authMiddleware, role(['admin']), async (req, res) => {
  const classes = await Class.findAll();
  res.json(classes);
});

module.exports = router;
