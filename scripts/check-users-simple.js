// Script para verificar usuarios en la base de datos (sin dotenv)
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Leer el archivo .env manualmente
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const sequelize = new Sequelize(
  envVars.DB_NAME,
  envVars.DB_USER,
  envVars.DB_PASS,
  {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Conexión a la base de datos exitosa');
    console.log(`📍 DB: ${envVars.DB_NAME} @ ${envVars.DB_HOST}\n`);
    
    const [results] = await sequelize.query(
      'SELECT id, email, name, role FROM users ORDER BY role, id'
    );
    
    console.log('===========================================');
    console.log('Usuarios en la base de datos:');
    console.log('===========================================\n');
    
    if (results.length === 0) {
      console.log('❌ No hay usuarios en la base de datos\n');
    } else {
      results.forEach(user => {
        console.log(`[${user.id}] ${user.email.padEnd(30)} | ${user.name.padEnd(25)} | ${user.role}`);
      });
    }
    
    // Contar por rol
    const [counts] = await sequelize.query(
      "SELECT role, COUNT(*) as total FROM users GROUP BY role ORDER BY role"
    );
    
    console.log('\n===========================================');
    console.log('Resumen por roles:');
    console.log('===========================================\n');
    counts.forEach(c => {
      console.log(`${c.role.padEnd(10)}: ${c.total} usuario(s)`);
    });
    
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkUsers();
