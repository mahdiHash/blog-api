const Post = require('../../models/post');
const authenticateReqJWT = require('../../lib/authenticateJWT');
const { GraphQLError, GraphQLBoolean, GraphQLID } = require('graphql');

const field = {
  type: GraphQLBoolean ,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, { id }, req) => {
    // user authentication
    let authenticatedUser = await authenticateReqJWT(req);

    if (!authenticatedUser) {
      return new GraphQLError('User not authorized');
    }
    
    
    // dislike post
    let post = await Post.findById(id).select('dislikes likes');

    if (!post) {
      return new GraphQLError('No such post');
    }
    
    if (post.dislikes.includes(authenticatedUser._id)) {
      return new GraphQLError('User already disliked the post');
    }
    else {
      post.dislikes.push(authenticatedUser._id);
    }
    
    // if the user liked the post, remove the user from it
    if (post.likes.includes(authenticatedUser._id)) {
      let index = post.likes.indexOf(authenticatedUser._id);
      post.likes.splice(index, 1);
    }

    post.save();
    return true;
  }
}

module.exports = field;
