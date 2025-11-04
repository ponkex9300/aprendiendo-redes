// Script para verificar usuarios en la base de datos
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Conexión a la base de datos exitosa\n');
    
    const [results] = await sequelize.query(
      'SELECT id, email, name, role FROM users ORDER BY role, id'
    );
    
    console.log('===========================================');
    console.log('Usuarios en la base de datos:');
    console.log('===========================================\n');
    
    if (results.length === 0) {
      console.log('❌ No hay usuarios en la base de datos\n');
    } else {
      console.table(results);
    }
    
    // Contar por rol
    const [counts] = await sequelize.query(
      "SELECT role, COUNT(*) as total FROM users GROUP BY role ORDER BY role"
    );
    
    console.log('\n===========================================');
    console.log('Resumen por roles:');
    console.log('===========================================\n');
    console.table(counts);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkUsers();
