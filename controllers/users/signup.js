const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const path = require('path');
const saveImgLocally = require('../../config/multer');
const fsPromise = require('fs/promises');
const errHandler = require('../../controllers/error');
const uploadImgToCloud = require('../../lib/img/uploadImg');
const jwt = require('jsonwebtoken');
const {
  body,
  validationResult
} = require('express-validator');
const {
  ServerSideErr,
  BadGatewayErr,
  BadRequestErr,
} = require('../../lib/errors');

require('dotenv').config();

const controller = [
  (req, res, next) => {
    saveImgLocally.single('profile_pic')(req, res, (error) => {
      if (error) {
        req.fileErr = error;
      }

      next();
    });
  },

  // validation
  body('username', 'Username must contain alphanumeric characters').trim().isAlphanumeric().custom((value) => {
    return value.trim().toLowerCase() !== 'deleted';
  }),
  body('password', 'Password must contain at least 8 characters').trim().isLength({ min: 8 }),
  body('passwordConfirm', 'Passwords are not the same').trim().custom((value, { req }) => {
    return value.trim() === req.body.password;
  }),

  (req, res, next) => {
    let errors = validationResult(req).array();

    if (req.fileErr) {
      errors.push(req.fileErr);
    }

    if (errors.length) {
      if (req.file) {
        fsPromise.rm(req.file.path);
      }
      
      return errHandler(errors, req, res);
    }

    User.findOne({ username: req.body.username })
      .exec((err, user) => {
        if (err) {
          if (req.file) {
            fsPromise.rm(req.file.path);
          }

          return errHandler(new BadGatewayErr(), req, res);
        }

        if (user) {
          if (req.file) {
            fsPromise.rm(req.file.path);
          }

          return errHandler(new BadRequestErr('Username is already taken'), req, res);
        }

        bcrypt.hash(req.body.password, 16, async (err, hashedPass) => {
          if (err) {
            if (req.file) {
              fsPromise.rm(req.file.path);
            }

            return errHandler(new ServerSideErr(), req, res);
          }

          let newUser = new User({
            username: req.body.username,
            password: hashedPass,
            profile_pic: null,
            comments: [],
          });

          try {
            if (req.file) {
              newUser.profile_pic = newUser.username + path.extname(req.file.originalname);
              await uploadImgToCloud(req.file.path, newUser.profile_pic)
                .then(() => {
                  fsPromise.rm(req.file.path);
                })
            }

            newUser.save((err, user) => {
              if (err) {
                errHandler(new BadGatewayErr(), req, res);
              }
            });
            let payloadLiteral = JSON.parse(JSON.stringify(newUser));
            let token = jwt.sign(payloadLiteral, process.env.TOKEN_SECRET, {
              expiresIn: '3d',
            });
            res.json({ token });
          }
          catch (err) {
            if (req.file) {
              fsPromise.rm(req.file.path);
            }
            
            errHandler(new BadRequestErr(), req, res);
          }
        });
      });
  }
];

module.exports = controller;
