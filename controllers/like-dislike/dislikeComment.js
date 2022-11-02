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

  (req, res, next) => {
    Comment.findById(req.params.id)
      .select('likes dislikes')
      .exec((err, comment) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        if (comment.dislikes.includes(req.user._id)) {
          return errHandler(new BadRequestErr('User already disliked the comment.'), req, res);
        }
        else {
          comment.dislikes.push(req.user._id);
        }

        // if the user liked the comment, remove the user from it
        if (comment.likes.includes(req.user._id)) {
          let index = comment.likes.indexOf(req.user._id);
          comment.likes.splice(index, 1);
        }

        Comment.findByIdAndUpdate(comment._id, comment)
          .exec((err, comment) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            res.json('User disliked the comment successfully.');
          });
      });
  }
];

module.exports = controller;
