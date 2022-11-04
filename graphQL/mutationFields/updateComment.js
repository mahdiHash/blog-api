const Comment = require('../../models/comment');
const CommentType = require('../customTypes/comment');
const authenticateReqJWT = require('../../lib/authenticateJWT');
const { GraphQLError, GraphQLID } = require('graphql');
const { updateCommentInput } = require('../customTypes/inputs');

const field = {
  type: CommentType,
  args: {
    id: { type: GraphQLID },
    inputs: { type: updateCommentInput },
  },
  resolve: async (_, { id, inputs }, req) => {
    // user authentication
    let authenticatedUser = await authenticateReqJWT(req);

    if (!authenticatedUser) {
      return new GraphQLError('User not authorized');
    }

    
    // check comment's author being the same as user
    let comment = await Comment.findById(id);

    if (!comment) {
      return new GraphQLError('No such comment');
    }

    if (comment.author !== authenticatedUser.username) {
      return new GraphQLError('User can\'t take this action');
    }


    // inputs validation
    if (inputs.text.trim().length < 1) {
      return new GraphQLError('Text can\'t be empty');
    }


    // update comment
    comment.text = inputs.text.trim();
    await comment.save();

    return comment;
  }
}

module.exports = field;
