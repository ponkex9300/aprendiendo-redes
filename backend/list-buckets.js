const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

console.log('\n=== Listando buckets S3 disponibles ===\n');

s3.listBuckets((err, data) => {
  if (err) {
    console.error('❌ Error:', err.message);
    return;
  }
  
  console.log(`Encontrados ${data.Buckets.length} buckets:\n`);
  
  data.Buckets.forEach(bucket => {
    console.log(`  - ${bucket.Name}`);
    if (bucket.Name === process.env.S3_BUCKET) {
      console.log('    ✅ Este es el bucket configurado');
    }
  });
  
  console.log('\nBucket buscado:', process.env.S3_BUCKET);
  
  const bucketExists = data.Buckets.some(b => b.Name === process.env.S3_BUCKET);
  
  if (!bucketExists) {
    console.log('\n🔴 PROBLEMA: El bucket no existe en tu cuenta AWS');
    console.log('\n📋 Soluciones:');
    console.log('1. Crear el bucket "aprendiendo-redes-videos" en AWS S3');
    console.log('2. O cambiar S3_BUCKET en .env a un bucket existente');
  }
});
