const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

function getPresignedPutUrl(Key, ContentType, expiresSec = 600){
  const params = { Bucket: process.env.S3_BUCKET, Key, Expires: expiresSec, ContentType };
  return s3.getSignedUrlPromise('putObject', params);
}

function getPresignedGetUrl(Key, expiresSec = 3600){
  const params = { Bucket: process.env.S3_BUCKET, Key, Expires: expiresSec };
  return s3.getSignedUrlPromise('getObject', params);
}

module.exports = { getPresignedPutUrl, getPresignedGetUrl, s3 };
