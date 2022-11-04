const Post = require('../../models/post');
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


    // like post
    let post = await Post.findById(id).select('likes dislikes');

    if (!post) {
      return new GraphQLError('No such post');
    }

    if (!post.likes.includes(authenticatedUser._id)) {
      post.likes.push(authenticatedUser._id);
    }
    else {
      return new GraphQLError('User already liked the post');
    }
    
    // if the user disliked the post, remove the user from it
    if (post.dislikes.includes(authenticatedUser._id)) {
      let index = post.dislikes.indexOf(authenticatedUser._id);
      post.dislikes.splice(index, 1);
    }

    post.save();
    return true;
  }
}

module.exports = field;
