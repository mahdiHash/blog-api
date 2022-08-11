const Comment = require('../../models/comment');
const passport = require('passport');
const errHandler = require('../error');
const {
  UnauthorizedErr,
  BadRequestErr,
  BadGatewayErr,
} = require('../../lib/errors');

require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  // authentication check
  (req, res, next) => {
    if (!req.user) {
      return errHandler(new UnauthorizedErr(), req, res);
    }

    next();
  },

  (req, res, next) => {
    Comment.findById(req.params.id)
      .select('likes dislikes')
      .exec((err, comment) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        if (comment.likes.includes(req.user._id)) {
          return errHandler(new BadRequestErr('User already liked the comment.'), req, res);
        }
        else {
          comment.likes.push(req.user._id);
        }

        // if the user disliked the comment, remove the user from it
        if (comment.dislikes.includes(req.user._id)) {
          let index = comment.dislikes.indexOf(req.user._id);
          comment.dislikes.splice(index, 1);
        }

        Comment.findByIdAndUpdate(comment._id, comment)
          .exec((err, comment) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            res.json('User liked the comment successfully.');
          });
      });
  }
];

module.exports = controller;
