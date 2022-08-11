const s3 = require('../../config/s3Cloud');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const os = require('os');
const path = require('path');

const controller = async (imgCloudName) => {
  let filePath = `${os.tmpdir()}\\${Date.now() + path.extname(imgCloudName)}`;
  let fileStream = fs.createWriteStream(filePath);

  await new Promise((resolve, reject) => {
    fileStream.on('finish', () => {
      resolve();
    });

    s3.send(new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key: imgCloudName,
    }))
      .then(async (data) => {
        data.Body.pipe(fileStream);
      }) 
  });

  return filePath;
}

module.exports = controller;
