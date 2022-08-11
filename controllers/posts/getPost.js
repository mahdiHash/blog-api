const Post = require('../../models/post');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({ breaks: true });
const errHandler = require('../error');
const {
  BadGatewayErr,
  BadRequestErr,
} = require('../../lib/errors');

const controller = (req, res, next) => {
  Post.findOne({ url_form_of_title: req.params.title.toLowerCase()})
    .populate('comments')
    .exec((err, result) => {
      if (err) {
        return errHandler(new BadGatewayErr(), req, res);
      }

      if (!result) {
        return errHandler(new BadRequestErr('There\'s no post with this title'), req, res);
      }
      else {
        result.content = md.render(result.content).replaceAll(/\n/gm, '<br>');
        res.json(result);
      }
    });
}

module.exports = controller;
