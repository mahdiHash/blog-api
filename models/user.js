const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  profile_pic: { type: String, default: null },
  is_admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', User);
