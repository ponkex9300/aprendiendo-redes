const bcrypt = require('bcryptjs');

// Función para generar hash de contraseña
async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`\nContraseña: ${password}`);
  console.log(`Hash: ${hash}\n`);
  return hash;
}

// Generar hashes para las contraseñas de prueba
async function main() {
  console.log('=== Generando hashes para usuarios de prueba ===\n');
  
  await generateHash('password123');
  await generateHash('admin123');
  await generateHash('teacher123');
  await generateHash('student123');
  
  console.log('=== Hashes generados exitosamente ===');
}

main();
