const Post = require('../../models/post');
const PostType = require('../customTypes/post');
const { GraphQLList } = require('graphql');

const field = {
  type: new GraphQLList(PostType),
  resolve: async () => {
    let posts = await Post.find().select({ content: 0, creation_time: 0 });

    return posts;
  }
}

module.exports = field;
