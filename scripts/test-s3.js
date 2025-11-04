const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

console.log('\n=== Testing S3 Configuration ===\n');

// Check environment variables
console.log('AWS Configuration:');
console.log('- AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing');
console.log('- AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing');
console.log('- AWS_REGION:', process.env.AWS_REGION || '✗ Missing');
console.log('- AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET || '✗ Missing');

// Test S3 connection
console.log('\n=== Testing S3 Bucket Access ===\n');

s3.listObjectsV2({
  Bucket: process.env.AWS_S3_BUCKET,
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
    console.log(`   Bucket: ${process.env.AWS_S3_BUCKET}`);
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
