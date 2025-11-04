const { User } = require('./src/models');
const bcrypt = require('bcryptjs');

async function ensureAdmin() {
  try {
    // Buscar si existe un admin
    const admin = await User.findOne({ where: { role: 'admin' } });
    
    if (admin) {
      console.log('✅ Usuario admin ya existe:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Nombre: ${admin.name}`);
    } else {
      // Crear usuario admin por defecto
      console.log('⚠️  No se encontró usuario admin. Creando uno...');
      const hash = await bcrypt.hash('admin123', 10);
      const newAdmin = await User.create({
        email: 'admin@redes.bo',
        password_hash: hash,
        name: 'Administrador',
        role: 'admin'
      });
      console.log('✅ Usuario admin creado exitosamente:');
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Contraseña: admin123`);
      console.log(`   Nombre: ${newAdmin.name}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

ensureAdmin();
