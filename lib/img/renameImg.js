const delImgFromCloud = require('./delImg');
const uploadImgToCloud = require('./uploadImg');
const getImgFromCloud = require('./getImg');
const fsPromise = require('fs/promises');

const controller = async (oldName, newName, localFilePath) => {
  // if the given local file path is null, we need to get the image
  // from cloud and upload it with new name
  if (localFilePath === null) {
    localFilePath = await getImgFromCloud(oldName);
  }

  return new Promise(async (resolve, reject) => {
    await delImgFromCloud(oldName)
    await uploadImgToCloud(localFilePath, newName);
    fsPromise.rm(localFilePath);
    resolve();
  });
}

module.exports = controller;
