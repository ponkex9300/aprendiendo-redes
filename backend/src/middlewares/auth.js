const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function role(requiredRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No user' });
    if (!requiredRoles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

module.exports = { authMiddleware, role };
