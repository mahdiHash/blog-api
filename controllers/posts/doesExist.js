const Post = require('../../models/post');
const errHander = require('../error');
const { BadGatewayErr } = require('../../lib/errors');

// this controller checks for a post with the given title
const controller = (req, res, next) => {
  console.log(req.params.title);
  Post.findOne({ url_form_of_title: req.params.title.toLowerCase() })
    .exec((err, result) => {
      if (err) {
        return errHander(new BadGatewayErr(), req, res);
      }

      if (result) {
        res.json(true);
      }
      else {
        res.json(false);
      }
    });
}

module.exports = controller;
