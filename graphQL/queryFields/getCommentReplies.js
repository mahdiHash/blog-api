const Comment = require('../../models/comment');
const commentType = require('../customTypes/comment');
const { GraphQLError, GraphQLList, GraphQLID } = require('graphql');

const field = {
  type: new GraphQLList(commentType),
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, { id }) => {
    let comment = await Comment.findById(id)
      .select('replies')
      .populate('replies');

    if (!comment) {
      return new GraphQLError('No such comment');
    }

    return comment.replies;
  }
}

module.exports = field;
