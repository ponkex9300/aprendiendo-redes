const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Crear token de admin
const adminToken = jwt.sign(
  { id: 1, email: 'admin@example.com', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

console.log('Token de admin:');
console.log(adminToken);

// Probar las rutas
const fetch = require('node-fetch');

async function testAdminRoutes() {
  try {
    console.log('\n=== Probando /api/admin/users ===');
    const usersRes = await fetch('http://localhost:3000/api/admin/users', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Status:', usersRes.status);
    const usersData = await usersRes.json();
    console.log('Response:', JSON.stringify(usersData, null, 2));

    console.log('\n=== Probando /api/admin/videos ===');
    const videosRes = await fetch('http://localhost:3000/api/admin/videos', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Status:', videosRes.status);
    const videosData = await videosRes.json();
    console.log('Response:', JSON.stringify(videosData, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminRoutes();
