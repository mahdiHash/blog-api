const Post = require('../../models/post');
const PostType = require('../customTypes/post');
const { createPostInput } = require('../customTypes/inputs');
const { GraphQLError } = require('graphql');
const md = require('markdown-it')();
const authenticateReqJWT = require('../../lib/authenticateJWT');

const field = {
  type: PostType,
  args: {
    inputs: { type: createPostInput },
  },
  resolve: async (_, { inputs }, req) => {
    // user authentication
    let authenticatedUser = await authenticateReqJWT(req);

    if (!authenticatedUser || !authenticatedUser.is_admin) {
      return new GraphQLError('User not authorized');
    }


    // input validation
    if (inputs.title.trim().length < 1) {
      return new GraphQLError('Post title can\'t be empty');
    }

    if (inputs.content.trim().length < 10) {
      return new GraphQLError('Post content can\'t be less than 10 characters');
    }


    // check if there's already a post with this title
    let duplicatePost = await Post.findOne({ title: inputs.title.trim() });

    if (duplicatePost) {
      return new GraphQLError('There\'s already a post with this title');
    }


    // submit the post
    let post = new Post({
      title: inputs.title.trim(),
      creation_time: Date.now(),
      content: inputs.content.trim(),
      likes: [],
      dislikes: [],
      last_update: Date.now(),
      comments: [],
      url_form_of_title: inputs.title.trim().toLowerCase().replaceAll(' ', '-'),
    });

    await post.save();
    post.content = md.render(post.content);
    post.content = post.content.replace(/\n/gm, '<br>');

    return post;
  }
}

module.exports = field;
