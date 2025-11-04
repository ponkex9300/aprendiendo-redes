require('dotenv').config();
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});

console.log('\n=== Testing S3 Presigned URL ===\n');

// Generar URL presigned
const params = {
  Bucket: process.env.S3_BUCKET,
  Key: `test/test-${Date.now()}.mp4`,
  Expires: 600,
  ContentType: 'video/mp4'
};

s3.getSignedUrl('putObject', params, (err, url) => {
  if (err) {
    console.error('❌ Error generando URL:', err);
    return;
  }
  
  console.log('✅ URL generada exitosamente');
  console.log('\nURL:', url.substring(0, 100) + '...');
  console.log('\nBucket:', process.env.S3_BUCKET);
  console.log('Region:', process.env.AWS_REGION);
  
  // Verificar CORS
  console.log('\n=== Checking CORS Configuration ===\n');
  
  s3.getBucketCors({ Bucket: process.env.S3_BUCKET }, (err, data) => {
    if (err) {
      console.error('❌ Error obteniendo CORS:', err.code);
      if (err.code === 'NoSuchCORSConfiguration') {
        console.log('\n⚠️  PROBLEMA ENCONTRADO: El bucket NO tiene configuración CORS');
        console.log('\nPara solucionarlo, configura CORS en tu bucket S3:');
        console.log(JSON.stringify({
          "CORSRules": [
            {
              "AllowedOrigins": ["*"],
              "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
              "AllowedHeaders": ["*"],
              "ExposeHeaders": ["ETag"],
              "MaxAgeSeconds": 3000
            }
          ]
        }, null, 2));
      }
      return;
    }
    
    console.log('✅ CORS configurado:');
    console.log(JSON.stringify(data, null, 2));
  });
});
