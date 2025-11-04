const { User } = require('./src/models');

async function listUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role'],
      order: [['role', 'ASC'], ['id', 'ASC']]
    });
    
    console.log('\n=========================================');
    console.log('USUARIOS EN LA BASE DE DATOS');
    console.log('=========================================\n');
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios registrados\n');
    } else {
      users.forEach(u => {
        const user = u.toJSON();
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`Rol: ${user.role}`);
        console.log('---');
      });
      console.log(`\nTotal: ${users.length} usuario(s)\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();
