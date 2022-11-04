const {
  GraphQLObjectType,
} = require('graphql');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: require('./createPost'),
    updatePost: require('./updatePost'),
    deletePost: require('./deletePost'),
    dislikePost: require('./dislikePost'),
    likePost: require('./likePost'),

    createComment: require('./createComment'),
    updateComment: require('./updateComment'),
    deleteComment: require('./deleteComment'),
    dislikeComment: require('./dislikeComment'),
    likeComment: require('./likeComment'),
  }
});

module.exports = mutation;
