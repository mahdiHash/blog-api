const errHandler = require('../../controllers/error');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { BadRequestErr, LoginFailedErr } = require('../../lib/errors');

require('../../config/passport');

const controller = [
  passport.initialize(),
  passport.authenticate('local', { session: false }),

  (err, req, res, next) => {
    if (err instanceof LoginFailedErr) {
      return errHandler(new BadRequestErr('Username or password is wrong.'), req, res);
    }

    if (req.user) {
      let token = jwt.sign(
        { _id: req.user._id.toString(), username: req.user.username },
        process.env.TOKEN_SECRET,
        { expiresIn: '3d' },
      );
      res.json({ token });
    }
  }
];

module.exports = controller;
