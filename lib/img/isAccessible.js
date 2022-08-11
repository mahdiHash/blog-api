const s3 = require('../../config/s3Cloud.js');
const { HeadObjectCommand } = require('@aws-sdk/client-s3');

const isImgAccessible = async (imgName) => {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: process.env.BUCKET,
      Key: imgName,
    }));
    return true;
  }
  catch (err) {
    let errCode = err['$metadata'].httpStatusCode;

    if (errCode === 404 || errCode === 403) {
      return false;
    }
    else {
      throw err;
    }
  }
}

module.exports = isImgAccessible;
