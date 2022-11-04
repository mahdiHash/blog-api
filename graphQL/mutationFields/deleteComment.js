const Comment = require('../../models/comment');
const Post = require('../../models/post');
const authenticateReqJWT = require('../../lib/authenticateJWT');
const { GraphQLBoolean, GraphQLID, GraphQLError } = require('graphql');

const field = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, { id }, req) => {
    // user authentication
    let comment = await Comment.findById(id);
    let authenticatedUser = await authenticateReqJWT(req);

    if (!authenticatedUser) {
      return new GraphQLError('User not authorized');
    }

    if (!authenticatedUser.is_admin && comment.author !== authenticatedUser.username) {
      return new GraphQLError('User can not take this action');
    }


    // delete comment
    comment.remove();
    

    // delete the comment from its post comments array
    let post = await Post.findById(comment.post).select('comments');
    let index = post.comments.indexOf(comment._id.toString());
    post.comments.splice(index, 1);
    post.save();

    return true;
  }
}

module.exports = field;
