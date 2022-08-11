const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../config/s3Cloud');
const fs = require('fs');
const fsPromise = require('fs/promises');

function uploadImgToCloud(fileLocalPath, cloudImgName) {
  return s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: cloudImgName,
    ACL: 'public-read',
    Body: fs.createReadStream(fileLocalPath),
  }))
    .then(() => {
      fsPromise.rm(fileLocalPath)
    });
}

module.exports = uploadImgToCloud;
