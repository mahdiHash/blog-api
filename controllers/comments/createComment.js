const Comment = require('../../models/comment');
const Post = require('../../models/post');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const errHandler = require('../error');
const {
  UnauthorizedErr,
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

  // validation
  body('text', 'The comment text can\'t be empty').trim().isLength({ min: 1 }),
  body('post', 'Post field must be a valid id.').custom(async (value) => {
    if (!value) {
      return false;
    }

    return await new Promise((resolve, reject) => {
      Post.findById(value)
        .exec((err, post) => {
          if (err || !post) {
            resolve(false);
          }

          resolve(true);
        });
    });
  }),
  body('replyTo', 'The replyTo field must be a valid id.').custom(async (value) => {
    if (value === null || value === undefined) {
      return true;
    }

    return await new Promise((resolve, reject) => {
      Comment.findById(value)
        .exec((err, comment) => {
          if (err || !comment) {
            resolve(false);
          }

          resolve(true);
        });
    });
  }),

  (req, res, next) => {
    let errors = validationResult(req).array();

    if (errors.length) {
      return errHandler(errors, req, res);
    }

    let comment = new Comment({
      author: req.user.username,
      timestamp: Date.now(),
      post: req.body.post,
      text: req.body.text,
      replies: [],
      likes: [],
      dislikes: [],
      is_editted: false,
      in_reply_to: req.body.replyTo ?? null,
    });

    comment.save((err, doc) => {
      if (err) {
        return errHandler(new BadGatewayErr(), req, res);
      }

      // add comment's id to the replies field of the parent comment
      if (comment.in_reply_to) {
        Comment.findById(comment.in_reply_to)
          .exec((err, comment) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            comment.replies.push(comment._id);

            Comment.findByIdAndUpdate(comment._id, comment)
              .exec((err) => {
                if (err) {
                  errHandler(new BadGatewayErr(), req, res);
                }
              })
          })
      }

      // add comment's id to comments field of the post that user commented on
      Post.findById(req.body.post)
        .exec((err, post) => {
          if (err) {
            return errHandler(new BadGatewayErr(), req, res);
          }

          post.comments.push(doc._id);

          Post.findByIdAndUpdate(post._id, post)
            .exec((err, doc) => {
              if (err) {
                return errHandler(new BadGatewayErr(), req, res);
              }

              res.json(comment);
            })
        });
    });
  }
];

module.exports = controller;
