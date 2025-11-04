require('dotenv').config();

console.log('\n=== Environment Variables ===\n');
console.log('S3_BUCKET:', process.env.S3_BUCKET || 'NOT SET');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');
console.log('AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
