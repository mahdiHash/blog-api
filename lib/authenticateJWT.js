const passport = require('passport');

require('../config/passport');

module.exports = async function (req) {
  let user = await new Promise((resolve) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        throw err;
      }

      if (user) {
        resolve(user);
      }
    })(req);
  });

  return user;
}
