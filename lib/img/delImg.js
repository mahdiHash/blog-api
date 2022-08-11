const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require(process.cwd() + '/config/s3Cloud');

const controller = (imgCloudName) => {
  return s3.send(new DeleteObjectCommand({
    Bucket: process.env.BUCKET,
    Key: imgCloudName,
  }));
}

module.exports = controller;
