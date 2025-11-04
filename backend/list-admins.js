const { User } = require('./src/models');

async function listAdmins() {
  try {
    const admins = await User.findAll({ 
      where: { role: 'admin' },
      attributes: ['id', 'email', 'name', 'role']
    });

    console.log('\n=== USUARIOS ADMINISTRADORES ===\n');
    
    if (admins.length === 0) {
      console.log('❌ No hay usuarios admin en el sistema');
    } else {
      admins.forEach(admin => {
        console.log(`ID: ${admin.id}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Nombre: ${admin.name}`);
        console.log(`Rol: ${admin.role}`);
        console.log('---');
      });
      console.log(`Total: ${admins.length} administrador(es)\n`);
      console.log('💡 Nota: Las contraseñas están hasheadas y no se pueden ver.');
      console.log('   Usa las credenciales que te proporcionaron al crear el usuario.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listAdmins();
