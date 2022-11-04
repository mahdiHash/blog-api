const Comment = require('../../models/comment');
const Post = require('../../models/post');
const CommentType = require('../customTypes/comment');
const authenticateReqJWT = require('../../lib/authenticateJWT');
const { GraphQLError } = require('graphql');
const { createCommentInput } = require('../customTypes/inputs');

const field = {
  type: CommentType,
  args: {
    inputs: { type: createCommentInput },
  },
  resolve: async (_, { inputs }, req) => {
    // user authentication
    let authenticatedUser = await authenticateReqJWT(req);
    
    if (!authenticatedUser) {
      return new GraphQLError('User not authorized');
    }


    // input validation
    let inputErrs = [];
    let post = await Post.findById(inputs.post);

    if (!post) {
      inputErrs.push(new GraphQLError('No such post'));
    }

    if (inputs.text.trim().length < 1) {
      inputErrs.push(new GraphQLError('Text should not be empty'));
    }

    if (inputs.replyTo) {
      let comment = await Comment.findById(inputs.replyTo);
      if (!comment) {
        inputErrs.push(new GraphQLError('Parent comment doesn\'t exist'));
      }
    }

    if (inputErrs.length) {
      return new GraphQLError(inputErrs);
    }


    // store comment
    let comment = new Comment({
      author: authenticatedUser.username,
      timestamp: Date.now(),
      post: inputs.post,
      text: inputs.text,
      replies: [],
      likes: [],
      dislikes: [],
      is_editted: false,
      in_reply_to: inputs.replyTo ?? null,
    });
    comment.save();

    if (comment.in_reply_to) {
      let parentComment = await Comment.findById(comment.in_reply_to);
      parentComment.replies.push(comment._id);
      parentComment.save();
    }

    post.comments.push(comment._id);
    post.save();

    return comment;
  }
}

module.exports = field;
