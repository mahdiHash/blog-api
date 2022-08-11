const User = require('../../models/user');
const Comment = require('../../models/comment');
const Post = require('../../models/post');
const passport = require('passport');
const errHandler = require('../error');
const delImgFromCloud = require('../../lib/img/delImg');
const {
  ForbiddenErr,
  UnauthorizedErr,
  BadGatewayErr,
} = require('../../lib/errors');

require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  (req, res, next) => {
    if (req.user) {
      if (req.user.username === req.params.username) {
        User.deleteOne({ username: req.params.username })
          .exec((err, user) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }
          });

        if (req.user.profile_pic) {
          delImgFromCloud(req.user.profile_pic);
        }

        // set author field of comments created by this username to Deleted
        Comment.find({ author: req.params.username })
          .exec((err, comments) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            for (let comment of comments) {
              comment.author = 'Deleted';
              Comment.findByIdAndUpdate(comment._id, comment)
                .exec((err) => {
                  if (err) {
                    return errHandler(new BadGatewayErr(), req, res);
                  }
                });
            }
          });

        // remove user's _id from any liked comment
        Comment.find({ likes: req.user._id })
          .exec((err, comments) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            for (let comment of comments) {
              let index = comment.likes.indexOf(req.user._id);
              comment.likes.splice(index, 1);

              Comment.findByIdAndUpdate(comment._id, comment)
                .exec((err) => {
                  if (err) {
                    return errHandler(new BadGatewayErr(), req, res);
                  }
                });
            }
          })

        // remove user's _id from any disliked comment
        Comment.find({ dislikes: req.user._id })
          .exec((err, comments) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            for (let comment of comments) {
              let index = comment.dislikes.indexOf(req.user._id);
              comment.dislikes.splice(index, 1);

              Comment.findByIdAndUpdate(comment._id, comment)
                .exec((err) => {
                  if (err) {
                    return errHandler(new BadGatewayErr(), req, res);
                  }
                });
            }
          });

        // remove user's _id from any liked post
        Post.find({ likes: req.user._id })
          .exec((err, posts) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            for (let post of posts) {
              let index = post.likes.indexOf(req.user._id);
              post.likes.splice(index, 1);

              Post.findByIdAndUpdate(post._id, post)
                .exec((err) => {
                  if (err) {
                    return errHandler(new BadGatewayErr(), req, res);
                  }
                });
            }
          })

        // remove user's _id from any disliked post
        Post.find({ dislikes: req.user._id })
          .exec((err, posts) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            for (let post of posts) {
              let index = post.dislikes.indexOf(req.user._id);
              post.dislikes.splice(index, 1);

              Post.findByIdAndUpdate(post._id, post)
                .exec((err) => {
                  if (err) {
                    return errHandler(new BadGatewayErr(), req, res);
                  }
                });
            }

            res.json('User is deleted successfully.')
          });
      }
      // user is not the target user
      else {
        return errHandler(new ForbiddenErr(), req, res);
      }
    }
    // user is not logged in
    else {
      errHandler(new UnauthorizedErr(), req, res);
    }
  }
];

module.exports = controller;
