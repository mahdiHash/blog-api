const User = require('../../models/user');
const Comment = require('../../models/comment');
const errHandler = require('../error');
const {
  BadRequestErr,
  BadGatewayErr,
} = require('../../lib/errors');

const controller = (req, res, next) => {
  User.findOne({ username: req.params.username }, { password: 0 })
    .select({ is_admin: 0, password: 0 })
    .exec((err, user) => {
      if (err) {
        return errHandler(new BadGatewayErr(), req, res);
      }

      if (!user) {
        errHandler(new BadRequestErr(), req, res);
      }
      else {
        Comment.find({ author: user.username })
          .populate('post')
          .exec((err, comments) => {
            if (err) {
              return errHandler(new BadGatewayErr(), req, res);
            }

            user.comments = comments;
            res.json(JSON.parse(JSON.stringify(user)));
          });
      }
    });
}

module.exports = controller;
