const { s3 } = require('./src/config/aws');
require('dotenv').config();

console.log('\n=== Test Completo de Subida S3 ===\n');

// Paso 1: Generar URL presigned
const key = `test/test-${Date.now()}.txt`;
const params = {
  Bucket: process.env.S3_BUCKET,
  Key: key,
  Expires: 600,
  ContentType: 'text/plain'
};

console.log('Paso 1: Generando URL presigned...');
s3.getSignedUrl('putObject', params, (err, url) => {
  if (err) {
    console.error('❌ Error:', err);
    return;
  }
  
  console.log('✅ URL generada\n');
  console.log('URL:', url.substring(0, 80) + '...\n');
  
  // Paso 2: Probar subida
  console.log('Paso 2: Probando subida...');
  const https = require('https');
  const { URL } = require('url');
  
  const uploadUrl = new URL(url);
  const content = 'Test file content';
  
  const options = {
    hostname: uploadUrl.hostname,
    path: uploadUrl.pathname + uploadUrl.search,
    method: 'PUT',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': content.length
    }
  };
  
  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    
    if (res.statusCode === 200) {
      console.log('✅ Archivo subido exitosamente a S3');
      console.log('ETag:', res.headers.etag);
      
      // Paso 3: Verificar que el archivo existe
      console.log('\nPaso 3: Verificando archivo...');
      s3.headObject({ Bucket: process.env.S3_BUCKET, Key: key }, (err, data) => {
        if (err) {
          console.error('❌ Archivo no encontrado');
          return;
        }
        console.log('✅ Archivo confirmado en S3');
        console.log('Tamaño:', data.ContentLength, 'bytes');
        
        // Limpiar
        console.log('\nLimpiando archivo de prueba...');
        s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: key }, (err) => {
          if (err) console.error('Error limpiando:', err);
          else console.log('✅ Test completado exitosamente\n');
        });
      });
    } else {
      console.error('❌ Error al subir:', res.statusCode);
    }
  });
  
  req.on('error', (e) => {
    console.error('❌ Error de red:', e.message);
  });
  
  req.write(content);
  req.end();
});
