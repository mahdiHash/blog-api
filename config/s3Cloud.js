const { S3Client } = require('@aws-sdk/client-s3');

require('dotenv').config();

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  }
});

module.exports = s3;
