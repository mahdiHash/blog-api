const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  Strategy: JwtStrategy,
  ExtractJwt
} = require('passport-jwt')
const {
  ServerSideErr,
  LoginFailedErr,
  BadGatewayErr,
  BadRequestErr,
} = require('../lib/errors');

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username })
    .exec((err, user) => {
      if (err) {
        return done(new BadGatewayErr());
      }

      if (!user) {
        return done(new LoginFailedErr());
      }

      if (user) {
        bcrypt.compare(password.trim(), user.password, (err, isMatch) => {
          if (err) {
            return done(new ServerSideErr());
          }

          if (isMatch) {
            done(null, user);
          }
          else {
            done(new LoginFailedErr());
          }
        });
      }
    });
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
}, (payload, done) => {
  User.findById(payload._id, (err, user) => {
    if (err) {
      return done(new BadGatewayErr());
    }

    if (user) {
      done(null, user);
    }
    else {
      done(new BadRequestErr('JWT is not valid.'), false);
    }
  });
}));

module.exports = passport;
