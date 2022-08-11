const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = new Schema({
  author: { type: String, required: true },
  timestamp: { type: Number, required: true },
  post: { type: Schema.Types.ObjectId, required: true, ref:'Post' },
  text: { type: String, required: true, length: { min: 1 } },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  is_editted: { type: Boolean, default: false },
  in_reply_to: { type: Schema.Types.ObjectId, default: null },
});

module.exports = mongoose.model('Comment', Comment);
