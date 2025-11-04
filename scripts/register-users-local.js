// Script para registrar usuarios directamente usando el backend local en el servidor
const http = require('http');

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
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
          resolve(JSON.parse(responseData));
        } else {
          console.log(`⚠️  ${user.email}: ${responseData}`);
          resolve(null);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error para ${user.email}:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('\n===========================================');
  console.log('Registrando usuarios en el backend local');
  console.log('===========================================\n');
  
  for (const user of users) {
    await registerUser(user);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n===========================================');
  console.log('Proceso completado');
  console.log('===========================================\n');
}

main().catch(console.error);
