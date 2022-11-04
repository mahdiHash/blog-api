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
      return GraphQLError('User not authorized');
    }
    
    
    // dislike the comment
    let comment = await Comment.findById(id).select('dislikes likes');
    
    if (!comment) {
      return new GraphQLError('No such comment');
    }
    
    if (comment.dislikes.includes(authenticatedUser._id)) {
      return new GraphQLError('User already disliked the comment.');
    }
    else {
      comment.dislikes.push(authenticatedUser._id);
    }
    
    // if the user liked the comment, remove the user from it
    if (comment.likes.includes(authenticatedUser._id)) {
      let index = comment.likes.indexOf(authenticatedUser._id.toString());
      comment.likes.splice(index, 1);
    }

    comment.save();
    return true;
  }
}

module.exports = field;
