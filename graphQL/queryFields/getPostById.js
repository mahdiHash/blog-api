const Post = require('../../models/post');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({ breaks: true });
const PostType = require('../customTypes/post');
const { GraphQLString, GraphQLError } = require('graphql');

const field = {
  type: PostType,
  args: {
    url_form_of_title: { type: GraphQLString },
  },
  resolve: async (_, { url_form_of_title }) => {
    let post = await Post.findOne({ url_form_of_title: url_form_of_title.toLowerCase() })
      .populate('comments');

    if (!post) {
      return new GraphQLError('No such post');
    }

    post.content = md.render(post.content).replaceAll(/\n/gm, '<br>');
    return post;
  }
}

module.exports = field;
