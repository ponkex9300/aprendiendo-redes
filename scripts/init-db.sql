-- crear base si no existe (en Postgres normalmente creas DB desde psql o console)
-- asume que crearás la DB 'aprendiendo' desde psql o la consola RDS/Aurora

-- tablas (con tipos Postgres)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','student','teacher'))
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  teacher_id INT
);

CREATE TABLE IF NOT EXISTS modules (
  id SERIAL PRIMARY KEY,
  class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title VARCHAR(255),
  module_order INT
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  module_id INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255),
  s3_key VARCHAR(512) NOT NULL,
  video_order INT,
  duration_seconds INT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','available','failed'))
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id INT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  watched BOOLEAN DEFAULT FALSE,
  watched_at TIMESTAMP NULL
);
