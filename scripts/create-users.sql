-- Script rápido para crear usuarios de prueba
-- Ejecutar esto en la base de datos PostgreSQL

-- IMPORTANTE: Primero necesitamos generar los hashes en el servidor
-- Este script se ejecutará después

-- Para generar hash en el servidor, ejecutar en Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('password123', 10).then(hash => console.log(hash));

-- Borramos usuarios de prueba si existen
DELETE FROM enrollments WHERE student_id IN (SELECT id FROM users WHERE email LIKE '%@redes.bo');
DELETE FROM classes WHERE teacher_id IN (SELECT id FROM users WHERE email LIKE '%@redes.bo');
DELETE FROM users WHERE email LIKE '%@redes.bo';

-- Los hashes se generarán en el servidor
-- Por ahora, creamos un script para registrar usuarios vía API
