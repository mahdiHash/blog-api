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

        if (!post.likes.includes(req.user._id)) {
          post.likes.push(req.user._id);
        }
        else {
          return errHandler(new BadRequestErr('User already liked the post'), req, res);
        }

        // if the user disliked the post, remove the user from it
        if (post.dislikes.includes(req.user._id)) {
          let index = post.dislikes.indexOf(req.user._id);
          post.dislikes.splice(index, 1);
        }

        Post.findByIdAndUpdate(post._id, post)
          .exec((err, post) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            res.json('User liked the post successfully.');
          });
      });
  }
];

module.exports = controller;
