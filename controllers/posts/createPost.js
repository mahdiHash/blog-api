const Post = require('../../models/post');
const passport = require('../../config/passport');
const errHandler = require('../error');
const { body, validationResult } = require('express-validator');
const md = require('markdown-it')();

const {
  BadGatewayErr,
  ForbiddenErr,
  UnauthorizedErr,
  BadRequestErr,
} = require('../../lib/errors');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  // check for authentication
  (req, res, next) => {
    // user is logged in
    if (req.user) {
      if (!req.user.is_admin) {
        return errHandler(new ForbiddenErr(), req, res);
      }
      else {
        next();
      }
    }
    // user is not logged in
    else {
      return errHandler(new UnauthorizedErr(), req, res);
    }
  },

  body('title', 'Title must at least have 1 character.').trim()
    .isLength({ min: 1 }),
  body('content', 'The content of post must at least have 10 characters.').trim()
    .isLength({ min: 10 }),

  // store the post's title and content in db
  (req, res, next) => {
    let errors = validationResult(req).array();

    if (errors.length) {
      return errHandler([errors], req, res);
    }

    // check if there's already an post with this title
    Post.findOne({ title: req.body.title })
      .exec((err, result) => {
        if (err) {
          return errHandler(new BadGatewayErr(), req, res);
        }

        if (result) {
          return errHandler(
            [new BadRequestErr('There\'s already a post with this title.')],
            req,
            res
          );
        }

        let post = new Post({
          title: req.body.title,
          creation_time: Date.now(),
          content: req.body.content,
          likes: [],
          dislikes: [],
          last_update: Date.now(),
          comments: [],
          url_form_of_title: req.body.title.toLowerCase().replaceAll(' ', '-'),
        });

        post.save((err, info) => {
          if (err) {
            return errHandler(new BadGatewayErr(), req, res);
          }

          post.content = md.render(post.content);
          post.content = post.content.replace(/\n/gm, '<br>');

          res.json(post);
        });
      })
  }
];

module.exports = controller;
