const getImgFromCloud = require('../../lib/img/getImg');
const fsPromsie = require('fs/promises');
const errHandler = require('../error');
const { NotFoundErr } = require('../../lib/errors');

const controller = async (req, res, next) => {
  let filePath;

  try {
    filePath = await getImgFromCloud(req.params.imgName);
    res.sendFile(filePath);
  }
  catch (err) {
    errHandler(new NotFoundErr(), req, res);
  }
  finally {
    if (filePath) {
      fsPromsie.rm(filePath);
    }
  }
}

module.exports = controller;
