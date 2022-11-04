const Post = require('../../models/post');
const postType = require('../customTypes/post');
const { GraphQLString, GraphQLError } = require('graphql');

const field = {
  type: postType,
  args: {
    url_form_of_title: { type: GraphQLString },
  },
  resolve: async (_, { url_title } ) => {
    let post = await Post.findOne({ url_form_of_title: url_title });

    if (!post) {
      return new GraphQLError('No such post');
    }

    return post;
  }
}

module.exports = field;
