#!/usr/bin/env node

// Script para crear usuarios de prueba usando la API
const https = require('https');

const API_URL = 'redes.tecnologia.bo';

const users = [
  {
    email: 'admin@redes.bo',
    password: 'admin123',
    name: 'Administrador Principal',
    role: 'admin'
  },
  {
    email: 'profesor1@redes.bo',
    password: 'profesor123',
    name: 'Juan Perez',
    role: 'teacher'
  },
  {
    email: 'profesor2@redes.bo',
    password: 'profesor123',
    name: 'Maria Garcia',
    role: 'teacher'
  },
  {
    email: 'estudiante1@redes.bo',
    password: 'estudiante123',
    name: 'Carlos Mamani',
    role: 'student'
  },
  {
    email: 'estudiante2@redes.bo',
    password: 'estudiante123',
    name: 'Ana Lopez',
    role: 'student'
  },
  {
    email: 'estudiante3@redes.bo',
    password: 'estudiante123',
    name: 'Luis Quispe',
    role: 'student'
  }
];

async function registerUser(user) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(user);
    
    const options = {
      hostname: API_URL,
      port: 443,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      rejectUnauthorized: false // Para certificados autofirmados
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
          resolve(JSON.parse(responseData));
        } else {
          console.log(`⚠️  Error al crear ${user.email}: ${responseData}`);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error de conexión para ${user.email}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n===========================================');
  console.log('Creando usuarios de prueba en el sistema');
  console.log('===========================================\n');
  
  for (const user of users) {
    await registerUser(user);
    // Esperar un poco entre cada registro
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n===========================================');
  console.log('Proceso completado');
  console.log('===========================================\n');
  console.log('Credenciales de acceso:\n');
  console.log('ADMIN:');
  console.log('  Email: admin@redes.bo');
  console.log('  Password: admin123\n');
  console.log('PROFESOR:');
  console.log('  Email: profesor1@redes.bo');
  console.log('  Password: profesor123\n');
  console.log('ESTUDIANTE:');
  console.log('  Email: estudiante1@redes.bo');
  console.log('  Password: estudiante123\n');
}

main().catch(console.error);
