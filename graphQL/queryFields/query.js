const {
  GraphQLObjectType,
} = require('graphql');

const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getAllPosts: require('./getAllPosts'),
    getComment: require('./getComment'),
    getCommentReplies: require('./getCommentReplies'),
    getPostById: require('./getPostById'),
    getPostByUrlFormTitle: require('./getPostByUrlFormTitle'),
    getUser: require('./getUser'),
  }
});

module.exports = query;
