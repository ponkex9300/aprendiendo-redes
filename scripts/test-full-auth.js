const http = require('http');

const data = JSON.stringify({
  email: 'profesor1@redes.bo',
  password: 'profesor123'
});

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
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
    
    if (res.statusCode === 200) {
      const result = JSON.parse(responseData);
      console.log('\n✅ Login exitoso!');
      console.log('Token:', result.token.substring(0, 50) + '...');
      
      // Ahora probar el profile
      const profileOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/profile',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${result.token}`
        }
      };
      
      const profileReq = http.request(profileOptions, (profileRes) => {
        let profileData = '';
        
        profileRes.on('data', (chunk) => {
          profileData += chunk;
        });
        
        profileRes.on('end', () => {
          console.log('\n=== Profile Endpoint ===');
          console.log('Status:', profileRes.statusCode);
          console.log('Response:', profileData);
        });
      });
      
      profileReq.on('error', (error) => {
        console.error('Error:', error);
      });
      
      profileReq.end();
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
