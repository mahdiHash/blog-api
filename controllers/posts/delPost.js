const Post = require('../../models/post');
const Comment = require('../../models/comment');
const errHandler = require('../error');
const passport = require('passport');
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

  (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
      .exec((err, result) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        // there's no such post in db
        if (!result) {
          errHandler(new BadRequestErr(''), req, res);
        }

        Comment.deleteMany({ post: result._id }, (err) => {
          if (err) {
            errHandler(new BadGatewayErr(), req, res);
          }
          else {
            res.json('The post is successfully deleted.');
          }
        })
      });
  }
];

module.exports = controller;
