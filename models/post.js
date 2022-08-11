const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({
  title: { type: String, required: true },
  creation_time: { type: Number },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  last_update: { type: Number },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  url_form_of_title: { type: String, required: true },
});

module.exports = mongoose.model('Post', Post);
