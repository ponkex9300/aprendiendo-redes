-- Script para insertar datos de prueba en la base de datos
-- Ejecutar después de init-db.sql

-- Insertar usuarios de ejemplo (las contraseñas están hasheadas con bcrypt)
-- Contraseña de ejemplo para todos: "password123"
-- Hash bcrypt de "password123": $2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K

-- Admin
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Administrador Principal', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Profesores
INSERT INTO users (email, password_hash, name, role) VALUES
('profesor1@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Dr. Juan Pérez', 'teacher'),
('profesor2@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Ing. María García', 'teacher')
ON CONFLICT (email) DO NOTHING;

-- Estudiantes
INSERT INTO users (email, password_hash, name, role) VALUES
('estudiante1@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Carlos Mamani', 'student'),
('estudiante2@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Ana López', 'student'),
('estudiante3@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Luis Quispe', 'student'),
('estudiante4@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Sofia Condori', 'student'),
('estudiante5@redes.bo', '$2a$10$rZ5YBFJHHgzCkTQVwMhBiOQIkMKE8qI8.nYrVk6Z1cP7lHk9QQN0K', 'Diego Rojas', 'student')
ON CONFLICT (email) DO NOTHING;

-- Cursos de ejemplo
INSERT INTO courses (title, description) VALUES
('Redes de Computadoras I', 'Introducción a las redes de computadoras, topologías, modelos OSI y TCP/IP'),
('Seguridad Informática', 'Fundamentos de seguridad en redes, criptografía y protección de datos'),
('Administración de Redes', 'Gestión y administración de infraestructura de red empresarial'),
('Redes Inalámbricas', 'Tecnologías Wi-Fi, Bluetooth y comunicaciones móviles')
ON CONFLICT DO NOTHING;

-- Clases de ejemplo (asumiendo que el profesor1 tiene id=2)
-- Nota: Ajusta los teacher_id según los IDs reales de tu base de datos
INSERT INTO classes (course_id, title, teacher_id) VALUES
(1, 'Redes I - Grupo A (Mañana)', 2),
(1, 'Redes I - Grupo B (Tarde)', 2),
(2, 'Seguridad - Grupo Único', 3),
(3, 'Admin Redes - Avanzado', 2)
ON CONFLICT DO NOTHING;

-- Módulos de ejemplo para la primera clase
INSERT INTO modules (class_id, title, module_order) VALUES
(1, 'Introducción a las Redes', 1),
(1, 'Modelo OSI', 2),
(1, 'Protocolo TCP/IP', 3),
(1, 'Direccionamiento IP', 4),
(1, 'Subnetting', 5)
ON CONFLICT DO NOTHING;

-- Inscripciones de ejemplo (estudiantes en clases)
-- Clase 1 (Redes I - Grupo A)
INSERT INTO enrollments (student_id, class_id) VALUES
(4, 1),  -- Carlos Mamani
(5, 1),  -- Ana López
(6, 1)   -- Luis Quispe
ON CONFLICT DO NOTHING;

-- Clase 2 (Redes I - Grupo B)
INSERT INTO enrollments (student_id, class_id) VALUES
(7, 2),  -- Sofia Condori
(8, 2)   -- Diego Rojas
ON CONFLICT DO NOTHING;

-- Verificar los datos insertados
SELECT 'Usuarios:' as tabla, COUNT(*) as total FROM users
UNION ALL
SELECT 'Cursos:', COUNT(*) FROM courses
UNION ALL
SELECT 'Clases:', COUNT(*) FROM classes
UNION ALL
SELECT 'Módulos:', COUNT(*) FROM modules
UNION ALL
SELECT 'Inscripciones:', COUNT(*) FROM enrollments;

-- Ver todos los usuarios con sus roles
SELECT id, name, email, role FROM users ORDER BY role, id;

-- Ver todas las clases con sus cursos
SELECT c.id, c.title as clase, co.title as curso, u.name as profesor
FROM classes c
JOIN courses co ON c.course_id = co.id
LEFT JOIN users u ON c.teacher_id = u.id
ORDER BY c.id;

-- Ver inscripciones
SELECT e.id, u.name as estudiante, c.title as clase
FROM enrollments e
JOIN users u ON e.student_id = u.id
JOIN classes c ON e.class_id = c.id
ORDER BY c.id, u.name;
