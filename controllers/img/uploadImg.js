const uploadImgToCloud = require('../../lib/img/uploadImg');
const isImgAccessible = require('../../lib/img/isAccessible');
const storeImgLocally = require('../../config/multer');
const fsPromise = require('fs/promises');
const errHandler = require('../error');
const {
  BadRequestErr,
} = require('../../lib/errors');

const controller = (req, res, next) => {
  storeImgLocally.single('img')(req, res, (err) => {
    if (err) {
      return errHandler(err, req, res);
    }

    // check if there's an image in the cload with the uploaded image's name
    isImgAccessible(req.file.originalname)
      .then((result) => {
        if (result) {
          return errHandler(
            new BadRequestErr('Aleady an image with this name.'),
            req,
            res
          );
        }
        else {
          uploadImgToCloud(req.file.path, req.file.originalname)
            .then(() => {
              res.json('Image uploaded successfully.');
            });
        }
      })
      .catch((err) => {
        errHandler(err, req, res);
      })
      .finally(() => {
        fsPromise.rm(req.file.path);
      });
  });
}

module.exports = controller;
