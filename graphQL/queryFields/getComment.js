const Comment = require('../../models/comment');
const CommentType = require('../customTypes/comment');
const { GraphQLID, GraphQLError } = require('graphql');

const field = {
  type: CommentType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, { id }) => {
    let comment = await Comment.findById(id);

    if (!comment) {
      return new GraphQLError('No such comment');
    }

    return comment;
  }
}

module.exports = field;
