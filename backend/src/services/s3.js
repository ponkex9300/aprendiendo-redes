const { s3 } = require('../config/aws');

function getPresignedPutUrl(Key, ContentType, expiresSec = 600) {
  const params = { Bucket: process.env.S3_BUCKET, Key, Expires: expiresSec, ContentType };
  return s3.getSignedUrlPromise('putObject', params);
}

function getPresignedGetUrl(Key, expiresSec = 3600) {
  const params = { Bucket: process.env.S3_BUCKET, Key, Expires: expiresSec };
  return s3.getSignedUrlPromise('getObject', params);
}

function headObject(Key) {
  const params = { Bucket: process.env.S3_BUCKET, Key };
  return s3.headObject(params).promise();
}

module.exports = { getPresignedPutUrl, getPresignedGetUrl, headObject };
