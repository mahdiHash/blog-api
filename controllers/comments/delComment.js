const Comment = require('../../models/comment');
const Post = require('../../models/post');
const User = require('../../models/user');
const passport = require('passport');
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

        if (!req.user.is_admin && req.user.username !== comment.author) {
          return errHandler([new ForbiddenErr()], req, res);
        }
        else {
          next();
        }
      })
  },

  (req, res, next) => {
    Comment.findByIdAndDelete(req.params.id)
      .exec((err, comment) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        // delete the comment's id from its post's comment field
        Post.findById(comment.post)
          .exec((err, post) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            let commentIndex = post.comments.indexOf(comment._id);
            post.comments.splice(commentIndex, 1);

            Post.findByIdAndUpdate(post._id, post)
              .exec((err) => {
                if (err) {
                  errHandler(new BadGatewayErr(), req, res);
                }

                res.json('Comment deleted successfully.');
              });
          });
      });
  }
];

module.exports = controller;
