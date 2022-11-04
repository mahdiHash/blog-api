const Comment = require('../../models/comment');
const authenticateReqJWT = require('../../lib/authenticateJWT');
const { GraphQLError, GraphQLBoolean, GraphQLID } = require('graphql');

const field = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, { id }, req) => {
    // user authentication
    let authenticatedUser = await authenticateReqJWT(req);

    if (!authenticatedUser) {
      return new GraphQLError('User not authorized');
    }

    // like comment
    let comment = await Comment.findById(id).select('likes dislikes');

    if (!comment) {
      return new GraphQLError('No such comment');
    }

    if (comment.likes.includes(authenticatedUser._id)) {
      return new GraphQLError('User already liked the comment.');
    }
    else {
      comment.likes.push(authenticatedUser._id);
    }

    // if the user disliked the comment, remove the user from it
    if (comment.dislikes.includes(authenticatedUser._id)) {
      let index = comment.dislikes.indexOf(authenticatedUser._id);
      comment.dislikes.splice(index, 1);
    }

    comment.save();
    return true;
  }
}

module.exports = field;
