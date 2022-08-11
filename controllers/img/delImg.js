const delImgFromCloud = require('../../lib/img/delImg');
const isImgAccessible = require('../../lib/img/isAccessible');
const passport = require('passport');
const errHandler = require('../error');
const {
  UnauthorizedErr,
  BadRequestErr,
  ForbiddenErr,
  BadGatewayErr
} = require('../../lib/errors');

require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('jwt', { session: false }),

  async (req, res, next) => {
    try {
      if (!isImgAccessible(req.params.imgName)) {
        return errHandler(new BadRequestErr('No such image'), req, res);
      }
    }
    catch (err) {
      return errHandler(new BadGatewayErr(), req, res);
    }

    // user is not logged in
    if (!req.user) {
      errHandler(new UnauthorizedErr(), req, res);
    }
    else if (!req.user.is_admin) {
      errHandler(new ForbiddenErr(), req, res);
    }
    // user is admin
    else {
      await delImgFromCloud(req.params.imgName);
      res.json('Image deleted successfully.');
    }
  }
];

module.exports = controller;
