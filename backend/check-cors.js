const { s3 } = require('./src/config/aws');
require('dotenv').config();

console.log('\n=== Checking S3 CORS Configuration ===\n');
console.log('Bucket:', process.env.S3_BUCKET);
console.log('Region:', process.env.AWS_REGION);

s3.getBucketCors({ Bucket: process.env.S3_BUCKET }, (err, data) => {
  if (err) {
    console.error('\n❌ ERROR:', err.code);
    
    if (err.code === 'NoSuchCORSConfiguration') {
      console.log('\n🔴 PROBLEMA ENCONTRADO: El bucket NO tiene configuración CORS\n');
      console.log('Esto impide que el navegador suba archivos directamente a S3.');
      console.log('\n📋 Solución: Configura CORS en AWS S3 Console:\n');
      console.log('1. Ve a: https://s3.console.aws.amazon.com/s3/buckets/aprendiendo-redes-videos');
      console.log('2. Pestaña: Permissions');
      console.log('3. Sección: Cross-origin resource sharing (CORS)');
      console.log('4. Pega esta configuración:\n');
      console.log(JSON.stringify([
        {
          "AllowedOrigins": ["https://redes.tecnologia.bo", "http://localhost:3000"],
          "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
          "AllowedHeaders": ["*"],
          "ExposeHeaders": ["ETag"],
          "MaxAgeSeconds": 3000
        }
      ], null, 2));
      console.log('\n5. Click "Save changes"\n');
    }
    return;
  }
  
  console.log('\n✅ CORS está configurado:');
  console.log(JSON.stringify(data, null, 2));
});
