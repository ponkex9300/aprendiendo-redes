const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
    env[key] = value;
  }
});

console.log('\n=== Testing S3 Configuration ===\n');

// Check environment variables
console.log('AWS Configuration:');
console.log('- AWS_ACCESS_KEY_ID:', env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing');
console.log('- AWS_SECRET_ACCESS_KEY:', env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing');
console.log('- AWS_REGION:', env.AWS_REGION || '✗ Missing');
console.log('- S3_BUCKET:', env.S3_BUCKET || '✗ Missing');

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION
});

// Test S3 connection
console.log('\n=== Testing S3 Bucket Access ===\n');

s3.listObjectsV2({
  Bucket: env.S3_BUCKET,
  MaxKeys: 5
}, (err, data) => {
  if (err) {
    console.error('❌ Error accessing S3 bucket:', err.message);
    console.error('   Code:', err.code);
    if (err.code === 'NoSuchBucket') {
      console.error('   The bucket does not exist or you do not have access to it.');
    } else if (err.code === 'InvalidAccessKeyId') {
      console.error('   Invalid AWS Access Key ID.');
    } else if (err.code === 'SignatureDoesNotMatch') {
      console.error('   Invalid AWS Secret Access Key.');
    }
  } else {
    console.log('✅ Successfully connected to S3 bucket!');
    console.log(`   Bucket: ${env.S3_BUCKET}`);
    console.log(`   Objects found: ${data.Contents.length}`);
    if (data.Contents.length > 0) {
      console.log('\n   Recent objects:');
      data.Contents.forEach(obj => {
        console.log(`   - ${obj.Key} (${(obj.Size / 1024).toFixed(2)} KB)`);
      });
    }
  }
  
  console.log('\n=== Test Complete ===\n');
});
