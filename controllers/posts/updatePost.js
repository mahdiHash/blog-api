const Post = require('../../models/post');
const errHandler = require('../error');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const {
  BadRequestErr,
  BadGatewayErr,
  ForbiddenErr,
} = require('../../lib/errors');

require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  // check for authentication
  (req, res, next) => {
    if (!req.user.is_admin) {
      return errHandler(new ForbiddenErr(), req, res);
    }
    else {
      // user is admin so go the next middleware
      next();
    }
  },

  body('title', 'Title must at least have 1 charachter.').trim()
    .isLength({ min: 1 }),
  body('content', 'The content of post must at least have 10 characters.').trim()
    .isLength({ min: 10 }),

  (req, res, next) => {
    let errors = validationResult(req).array();

    if (errors.length) {
      return errHandler(errors, req, res);
    }

    Post.findById(req.params.id)
      .exec((err, result) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        // no such post with this id
        if (!result) {
          return errHandler(new BadRequestErr(), req, res);
        }
        else {
          let upPost = result;
          upPost.title = req.body.title.trim();
          upPost.url_form_of_title = req.body.title.toLowerCase().replaceAll(' ', '-');
          upPost.content = req.body.content;
          upPost.last_update = Date.now();

          Post.findByIdAndUpdate(req.params.id, upPost)
            .exec((err, result) => {
              if (err) {
                return errHandler(new BadGatewayErr(), req, res);
              }

              res.json('The post is successfully updated.');
            });
        }
      });
  }
];

module.exports = controller;
