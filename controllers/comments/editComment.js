const Comment = require('../../models/comment');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const errHandler = require('../error');
const {
  UnauthorizedErr,
  ForbiddenErr,
  BadRequestErr,
  BadGatewayErr,
} = require('../../lib/errors');

require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  // check for authentication
  (req, res, next) => {
    Comment.findById(req.params.id)
      .exec((err, comment) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        if (!comment) {
          return errHandler(new BadRequestErr('No such comment'), req, res);
        }

        if (req.user.username !== comment.author) {
          return errHandler([new ForbiddenErr()], req, res);
        }
        else {
          next();
        }
      })
  },

  body('text', 'The comment text can\'t be empty').trim().isLength({ min: 1 }),

  (req, res, next) => {
    let errors = validationResult(req).array();

    if (errors.length) {
      return errHandler(errors, req, res);
    }

    let commentUp = new Comment({
      _id: req.params.id,
      text: req.body.text,
      is_editted: true,
    });

    Comment.findByIdAndUpdate(req.params.id, commentUp)
      .exec((err, doc) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        res.json(doc);
      })
  }
];

module.exports = controller;
