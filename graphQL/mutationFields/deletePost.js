const Post = require('../../models/post');
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

    if (!authenticatedUser || !authenticatedUser.is_admin) {
      return new GraphQLError('User not authorized');
    }


    // delete post
    let post = await Post.findById(id);

    if (!post) {
      return new GraphQLError('No such post');
    }

    post.remove();
    Comment.deleteMany({ post: post.id });
    return true;
  }
}

module.exports = field;
