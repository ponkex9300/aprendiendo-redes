const { s3 } = require('./src/config/aws');
require('dotenv').config();

console.log('\n=== Verificando Política del Bucket ===\n');

s3.getBucketPolicy({ Bucket: process.env.S3_BUCKET }, (err, data) => {
  if (err) {
    if (err.code === 'NoSuchBucketPolicy') {
      console.log('⚠️  No hay política configurada en el bucket');
      console.log('\nEsto es normal, pero asegúrate de que el bucket no sea privado.\n');
      
      // Verificar ACL del bucket
      s3.getBucketAcl({ Bucket: process.env.S3_BUCKET }, (err, acl) => {
        if (err) {
          console.error('Error obteniendo ACL:', err.code);
          return;
        }
        console.log('ACL del bucket:');
        console.log(JSON.stringify(acl, null, 2));
      });
    } else {
      console.error('❌ Error:', err.code);
    }
    return;
  }
  
  console.log('Política del bucket:');
  console.log(data.Policy);
});

// Verificar configuración de bloqueo público
console.log('\n=== Verificando Bloqueo de Acceso Público ===\n');

s3.getPublicAccessBlock({ Bucket: process.env.S3_BUCKET }, (err, data) => {
  if (err) {
    console.log('⚠️  No hay configuración de bloqueo público');
    return;
  }
  
  console.log('Configuración de bloqueo:');
  console.log(JSON.stringify(data, null, 2));
  
  if (data.PublicAccessBlockConfiguration.BlockPublicAcls || 
      data.PublicAccessBlockConfiguration.BlockPublicPolicy) {
    console.log('\n⚠️  ADVERTENCIA: El acceso público está bloqueado');
    console.log('Esto no debería afectar las URLs presigned, pero verifica los permisos.');
  }
});
