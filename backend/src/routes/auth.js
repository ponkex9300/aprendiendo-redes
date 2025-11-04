const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({ email, password_hash: hash, name, role });
  res.json({ id: u.id, email: u.email, role: u.role });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/profile', authMiddleware, async (req, res) => {
  const { User } = require('../models');
  const u = await User.findByPk(req.user.id, { attributes: ['id','email','name','role'] });
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json({ id: u.id, email: u.email, name: u.name, role: u.role });
});

module.exports = router;
