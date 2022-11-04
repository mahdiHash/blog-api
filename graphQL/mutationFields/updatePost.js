const Post = require('../../models/post');
const PostType = require('../customTypes/post');
const { GraphQLError, GraphQLID } = require('graphql');
const { updatePostInput } = require('../customTypes/inputs');
const authenticateReqJWT = require('../../lib/authenticateJWT');

const field = {
  type: PostType,
  args: {
    id: { type: GraphQLID },
    inputs: { type: updatePostInput },
  },
  resolve: async (_, { inputs, id }, req) => {
    // user authentication
    let authenticatedUser = await authenticateReqJWT(req);

    if (!authenticateReqJWT || !authenticatedUser.is_admin) {
      return new GraphQLError('User not authorized');
    }

    
    // input validation
    if (inputs.title.trim().length < 1) {
      return new GraphQLError('Post title can\'t be empty');
    }

    if (inputs.content.trim().length < 10) {
      return new GraphQLError('Post content can\'t be less that 10 characters');
    }


    // update post
    let post = await Post.findById(id);

    if (!post) {
      return new GraphQLError('No such post');
    }

    post.title = inputs.title.trim();
    post.url_form_of_title = inputs.title.toLowerCase().replaceAll(' ', '-');
    post.content = inputs.content;
    post.last_update = Date.now();
    await post.save();

    return post;
}
}

module.exports = field;
