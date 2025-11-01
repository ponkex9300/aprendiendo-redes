const jwt = require('jsonwebtoken');
function sign(payload, expires = '8h') { return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires }); }
function verify(token) { return jwt.verify(token, process.env.JWT_SECRET); }
module.exports = { sign, verify };
