const multer = require('multer');
const path = require('path');
const os = require('os');
const { BadRequestErr } = require('../lib/errors');
const errHandler = require('../controllers/error');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    let name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  }
});

const storeImageLocally = multer({
  storage: storage,
  limits: {
    fileSize: 500000,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    let allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    if (!allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
      let err = new BadRequestErr('File extension is not valid. Only .jpg, .jpeg, .png, and .gif are accepted');
      return cb(err, false);
    }

    cb(null, true);
  }
});

module.exports = storeImageLocally;
