const Post = require('../../models/post');
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
    Post.findById(req.params.id)
      .select('likes dislikes')
      .exec((err, post) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        if (post.dislikes.includes(req.user._id)) {
          return errHandler(new BadRequestErr('User already disliked the post'), req, res);
        }
        else {
          post.dislikes.push(req.user._id);
        }

        // if the user liked the post, remove the user from it
        if (post.likes.includes(req.user._id)) {
          let index = post.likes.indexOf(req.user._id);
          post.likes.splice(index, 1);
        }

        Post.findByIdAndUpdate(post._id, post)
          .exec((err, post) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            res.json('User disliked the post successfully.');
          });
      });
  }
];

module.exports = controller;
