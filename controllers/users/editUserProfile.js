const User = require('../../models/user');
const path = require('path');
const saveImgLocally = require('../../config/multer');
const fsPromise = require('fs/promises');
const errHandler = require('../../controllers/error');
const uploadImgToCloud = require('../../lib/img/uploadImg');
const delImgFromCloud = require('../../lib/img/delImg');
const renameImgInCloud = require('../../lib/img/renameImg');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  body,
  validationResult
} = require('express-validator');
const {
  BadRequestErr,
  UnauthorizedErr,
  BadGatewayErr,
} = require('../../lib/errors');

require('dotenv').config();
require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  (req, res, next) => {
    // user is not logged in
    if (!req.user) {
      return errHandler(new UnauthorizedErr(), req, res);
    }

    // logged in user is not the target user
    if (req.user.username !== req.params.username) {
      return errHandler(new BadRequestErr(), req, res);
    }

    saveImgLocally.single('profile_pic')(req, res, (error) => {
      if (error) {
        req.fileErr = error;
      }

      // image stored successfully
      next();
    });
  },

  // validation
  body('username', 'Username must contain alphanumeric characters').trim().isAlphanumeric(),

  (req, res, next) => {
    let errors = validationResult(req).array();

    if (req.fileErr) {
      errors.push(req.fileErr);
    }

    if (errors.length) {
      if (req.file) {
        fsPromise(req.file.path);
      }
      return errHandler(errors, req, res);
    }

    User.findOne({ username: req.body.username })
      .exec(async (err, user) => {
        if (err) {
          if (req.file) {
            fsPromise.rm(req.file.path);
          }
          return errHandler(new BadGatewayErr(), req, res);
        }

        if (user && user.username !== req.params.username) {
          if (req.file) {
            fsPromise.rm(req.file.path);
          }

          return errHandler(new BadRequestErr('Username is already taken'), req, res);
        }

        let userUpdate = new User({
          _id: req.user._id,
          username: req.body.username,
          password: req.user.password,
          profile_pic: null,
          comments: req.user.comments,
          is_admin: req.user.is_admin,
        });

        try {
          if (req.file) {
            userUpdate.profile_pic = userUpdate.username + path.extname(req.file.originalname);

            // delete the user's profile image with the name of latest username 
            if (req.user.profile_pic) {
              await delImgFromCloud(req.user.profile_pic);
            }

            // upload the new image with the new username
            uploadImgToCloud(req.file.path, userUpdate.profile_pic);
          }
          // user had uploaded an image, so it should be renamed now
          else if (!req.file && req.user.profile_pic) {
            userUpdate.profile_pic = userUpdate.username + path.extname(req.user.profile_pic);

            renameImgInCloud(req.user.profile_pic, userUpdate.profile_pic, null);
          }
        }
        catch (err) {
          errHandler(new BadRequestErr(), req, res);
        }
        finally {
          User.findByIdAndUpdate(req.user._id, userUpdate)
            .exec((err) => {
              if (err) {
                errHandler(new BadGatewayErr(), req, res);
              }

              let newToken = jwt.sign(
                { _id: req.user._id.toString(), username: userUpdate.username},
                process.env.TOKEN_SECRET,
              );
              res.json({ token: newToken });
            });
        }
      });
  }
];

module.exports = controller;
