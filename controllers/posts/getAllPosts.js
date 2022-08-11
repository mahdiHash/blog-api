const Post = require('../../models/post');
const errHander = require('../error');
const {
  BadGatewayErr,
} = require('../../lib/errors');

const controller = (req, res, next) => {
  Post.find()
    .select({ content: 0, creation_time: 0 })
    .exec((err, posts) => {
      if (err) {
        return errHander(new BadGatewayErr(), req, res);
      }
      
      res.json(posts);
    });
}

module.exports = controller;
