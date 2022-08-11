const Comment = require('../../models/comment');
const errHandler = require('../error');
const {
  BadGatewayErr,
  BadRequestErr,
} = require('../../lib/errors');

const controller = (req, res, next) => {
  Comment.findById(req.params.id)
    .exec((err, comment) => {
      if (err) {
        return errHandler(new BadGatewayErr(), req, res);
      }

      if (!comment) {
        errHandler(new BadRequestErr('No such comment'), req, res);
      }
      else {
        res.json(comment);
      }
    });
}

module.exports = controller;
