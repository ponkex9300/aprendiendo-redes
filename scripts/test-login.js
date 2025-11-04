// Test de login
const http = require('http');

const testLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, password });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
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
          const result = JSON.parse(responseData);
          console.log(`\n✅ Login exitoso para ${email}`);
          console.log(`   Rol: ${result.user.role}`);
          console.log(`   Nombre: ${result.user.name}`);
          console.log(`   Token generado: ${result.token.substring(0, 50)}...`);
        } else {
          console.log(`\n❌ Error al hacer login con ${email}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response: ${responseData}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error de conexión:`, error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

async function main() {
  console.log('\n=============================================');
  console.log('Probando credenciales de usuarios');
  console.log('=============================================');
  
  await testLogin('profesor1@redes.bo', 'profesor123');
  await testLogin('estudiante1@redes.bo', 'estudiante123');
  await testLogin('admin@redes.bo', 'admin123');
  
  console.log('\n=============================================');
  console.log('Pruebas completadas');
  console.log('=============================================\n');
}

main().catch(console.error);
